from typing import List
from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from domain.task import Task
from domain.ticket import Ticket
from domain.agent import Agent
from services.ticket_assignment_service import TicketAssignmentService
from utils.ticket_queue import TicketQueue
from models.health import HealthCheck
from models.agent import AgentResponse, AgentRequest, AgentUpdateRequest
from models.assignment import AssignmentResponse
from models.ticket import TicketRequest, QueuedTicketResponse
from models.queue import QueueStatusResponse
from models.task import TaskResponse
import uuid
import queue
import uvicorn

"""
TODO: Implement dynamic reassignment mechanism: Queued tasks (e.g. Korean call) should
be immediately assigned if a matching agent is added or gains the necessary
language skill. At the moment, this functionality is not available in the backend code.
"""

# FastAPI implementation
app = FastAPI(
    title="Ticket Assignment Service",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs"
)
api_v1 = APIRouter(prefix="/api/v1")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


service = TicketAssignmentService()

@api_v1.get(
    "/health",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
def get_health() -> HealthCheck:
    return HealthCheck(status="OK")


@api_v1.post("/agents", status_code=status.HTTP_201_CREATED, response_model=AgentResponse)
def register_agent(agent_request: AgentRequest):
    agent = Agent(
        name=agent_request.name,
        language_skills=agent_request.language_skills
    )
    
    if not service.register_agent(agent):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Agent with name '{agent.name}' already exists"
        )
    
    # Convert to response format
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[]  # No tasks initially
    )

@api_v1.get("/agents/{agent_identifier}", response_model=AgentResponse)
def get_agent(agent_identifier: str, by_name: bool = False):
    """Get agent by ID or name"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

@api_v1.post("/tickets/assign", response_model=AssignmentResponse)
def assign_ticket(ticket_request: TicketRequest):
    # If ID is not provided or empty, generate a UUID
    ticket_id = ticket_request.id if ticket_request.id else str(uuid.uuid4())
    
    ticket = Ticket(
        id=ticket_id,
        restrictions=ticket_request.restrictions,
        platform=ticket_request.platform
    )
    
    # Check if ticket ID is already assigned
    if ticket.id in service.assigned_ticket_ids:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ticket with ID '{ticket.id}' is already assigned"
        )
    
    # Check if ticket is already in queue
    if service.ticket_queue.is_ticket_queued(ticket.id):
        # Try to find an agent for this ticket now
        # First, remove it from the queue
        # Note: This is a simplified approach - in a real system, you'd want to
        # remove the specific ticket from the queue rather than checking all tickets
        
        # Create a temporary queue to hold other tickets
        temp_voice_queue = queue.PriorityQueue()
        temp_text_queue = queue.PriorityQueue()
        found_ticket = False
        
        # Process voice queue
        while not service.ticket_queue.voice_queue.empty():
            priority, counter, queued_ticket = service.ticket_queue.voice_queue.get()
            if queued_ticket.id == ticket.id:
                found_ticket = True
                # Remove from queued set
                service.ticket_queue.queued_ticket_ids.remove(ticket.id)
            else:
                temp_voice_queue.put((priority, counter, queued_ticket))
        
        # Restore voice queue without the target ticket
        service.ticket_queue.voice_queue = temp_voice_queue
        
        # If not found in voice queue, check text queue
        if not found_ticket:
            while not service.ticket_queue.text_queue.empty():
                priority, counter, queued_ticket = service.ticket_queue.text_queue.get()
                if queued_ticket.id == ticket.id:
                    found_ticket = True
                    # Remove from queued set
                    service.ticket_queue.queued_ticket_ids.remove(ticket.id)
                else:
                    temp_text_queue.put((priority, counter, queued_ticket))
            
            # Restore text queue without the target ticket
            service.ticket_queue.text_queue = temp_text_queue
        
        # Now try to assign the ticket
        if found_ticket:
            # Try to find a suitable agent
            best_agent = None
            min_tasks = float('inf')
            
            for agent in service.agents.values():
                if agent.can_accept_task(ticket):
                    if len(agent.assigned_tasks) < min_tasks:
                        min_tasks = len(agent.assigned_tasks)
                        best_agent = agent
            
            if best_agent:
                # Create a new task for this ticket
                task = Task(ticket.platform)
                # Assign the ticket
                best_agent.assigned_tasks.append(task)
                # Mark ticket as assigned
                service.assigned_ticket_ids.add(ticket.id)
                
                return AssignmentResponse(
                    ticket_id=ticket.id,
                    agent_id=best_agent.id,
                    agent_name=best_agent.name,
                    task_id=task.id,
                    queued=False
                )
            else:
                # Put it back in the queue
                service.ticket_queue.add_ticket(ticket)
                
                return AssignmentResponse(
                    ticket_id=ticket.id,
                    queued=True
                )
    
    # If not already assigned or queued, try to assign it
    assignment = service.assign_ticket(ticket)
    
    if assignment:
        return AssignmentResponse(
            ticket_id=ticket.id,
            agent_id=assignment.agent.id,
            agent_name=assignment.agent.name,
            task_id=assignment.task.id,
            queued=False
        )
    else:
        return AssignmentResponse(
            ticket_id=ticket.id,
            queued=True
        )

@api_v1.post("/tasks/complete", status_code=status.HTTP_200_OK)
def complete_task(agent_identifier: str, task_id: str, by_name: bool = False):
    """Mark a task as complete"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
        agent_id = agent.id
    else:
        agent_id = agent_identifier
        if agent_id not in service.agents:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_id}' not found"
            )
    
    if not service.mark_task_complete(agent_id, task_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task not found or already completed"
        )
    return {"message": "Task marked as complete"}

@api_v1.get("/agents", response_model=List[AgentResponse])
def list_agents():
    return [
        AgentResponse(
            id=agent.id,
            name=agent.name,
            language_skills=agent.language_skills,
            assigned_tasks=[
                TaskResponse(id=task.id, platform=task.platform)
                for task in agent.assigned_tasks
            ]
        )
        for agent in service.agents.values()
    ]

@api_v1.get("/queue", response_model=QueueStatusResponse)
def get_queue_status():
    """Get the current status of the ticket queues"""
    # Helper function to extract tickets from a priority queue
    def extract_queue_items(priority_queue):
        # Create a copy of the queue to avoid modifying the original
        queue_copy = queue.PriorityQueue()
        items = []
        
        # Extract all items
        while not priority_queue.empty():
            priority, counter, ticket = priority_queue.get()
            items.append(QueuedTicketResponse(
                priority=priority,
                position=counter,
                ticket_id=ticket.id,
                platform=ticket.platform,
                restrictions=ticket.restrictions,
                is_voice=ticket.is_voice,
                created_at=ticket.created_at
            ))
            queue_copy.put((priority, counter, ticket))
        
        # Restore the original queue
        while not queue_copy.empty():
            priority_queue.put(queue_copy.get())
            
        return items
    
    # Get items from both queues
    voice_items = extract_queue_items(service.ticket_queue.voice_queue)
    text_items = extract_queue_items(service.ticket_queue.text_queue)
    
    return QueueStatusResponse(
        voice_queue=voice_items,
        text_queue=text_items,
        total_queued=len(voice_items) + len(text_items)
    )

# Get completed tasks
@api_v1.get("/tasks/completed")
def get_completed_tasks():
    return {
        "completed_tasks": list(service.completed_tasks)
    }

# Add a debug endpoint to see the current state
@api_v1.get("/debug")
def get_debug_info():
    """Get internal state for debugging"""
    return {
        "assigned_ticket_ids": list(service.assigned_ticket_ids),
        "completed_tasks": list(service.completed_tasks),
        "ticket_to_task_map": service.ticket_to_task_map,
        "queued_ticket_ids": list(service.ticket_queue.queued_ticket_ids),
        "agents": {
            id: {
                "language_skills": agent.language_skills,
                "assigned_tasks": [
                    {"id": task.id, "platform": task.platform}
                    for task in agent.assigned_tasks
                ]
            }
            for id, agent in service.agents.items()
        }
    }

# Add a reset endpoint for testing
@api_v1.post("/reset")
def reset_service():
    """Reset the service state (for testing)"""
    service.agents = {}
    service.ticket_queue = TicketQueue()
    service.completed_tasks = set()
    service.assigned_ticket_ids = set()
    service.ticket_to_task_map = {}
    return {"message": "Service state reset successfully"}

@api_v1.patch("/agents/{agent_identifier}", response_model=AgentResponse)
def update_agent(agent_identifier: str, update_request: AgentUpdateRequest, by_name: bool = False):
    """Update an existing agent's properties"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    # Replace entire language_skills list if provided
    if update_request.language_skills is not None:
        agent.language_skills = update_request.language_skills
    
    # Add individual skills
    if update_request.add_skills:
        for skill in update_request.add_skills:
            if skill not in agent.language_skills:
                agent.language_skills.append(skill)
    
    # Remove individual skills
    if update_request.remove_skills:
        agent.language_skills = [
            skill for skill in agent.language_skills 
            if skill not in update_request.remove_skills
        ]
    
    # Return updated agent
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

# For the example case, we'll need to manually assign tasks
def solve_example_case():
    # Create agents without pre-assigned tasks
    agent_a = Agent(name="A", language_skills=["German", "English"])
    agent_b = Agent(name="B", language_skills=["English", "French"])
    agent_c = Agent(name="C", language_skills=["English", "French"])
    
    service = TicketAssignmentService()
    service.register_agent(agent_a)
    service.register_agent(agent_b)
    service.register_agent(agent_c)
    
    # Manually assign the initial tasks to match the example
    for _ in range(3):  # 3 tasks for agent A
        if _ < 2:
            task = Task("facebook_chat")
        else:
            task = Task("email")
        agent_a.assigned_tasks.append(task)
    
    for _ in range(3):  # 3 tasks for agent B
        if _ == 0:
            task = Task("website_chat")
        elif _ == 1:
            task = Task("facebook_chat")
        else:
            task = Task("call")
        agent_b.assigned_tasks.append(task)
    
    for _ in range(2):  # 2 tasks for agent C
        if _ == 0:
            task = Task("website_chat")
        else:
            task = Task("facebook_chat")
        agent_c.assigned_tasks.append(task)
    
    # Now create and assign the ticket from the example
    ticket_id = str(uuid.uuid4())
    print(f"Example case ticket ID: {ticket_id}")
    
    ticket = Ticket(id=ticket_id, restrictions=["English"], platform="facebook_chat")
    assignment = service.assign_ticket(ticket)
    
    if assignment:
        return f"Ticket assigned to Agent {assignment.agent.name}"
    else:
        return "Ticket queued for later assignment"

# Add a helper endpoint for testing to manually assign tasks to agents
@api_v1.post("/agents/{agent_identifier}/tasks", response_model=AgentResponse)
def assign_manual_task(
    agent_identifier: str, 
    platform: str, 
    by_name: bool = False
):
    """Manually assign a task to an agent (for testing)"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    # Check if agent can accept another task
    if platform == "call" and agent.has_voice_call():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent cannot handle two voice calls simultaneously"
        )
    
    if agent.has_voice_call() and len(agent.assigned_tasks) >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent already has maximum tasks with a voice call"
        )
    
    if not agent.has_voice_call() and platform != "call" and len(agent.assigned_tasks) >= 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent already has maximum text-based tasks"
        )
    
    if not agent.has_voice_call() and platform == "call" and len(agent.assigned_tasks) >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Adding a voice call would exceed maximum tasks"
        )
    
    # Create and assign the task
    task = Task(platform)
    agent.assigned_tasks.append(task)
    
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

app.include_router(api_v1)

if __name__ == "__main__":
    # Run the HTTP server
    uvicorn.run(app, host="0.0.0.0", port=8000)
