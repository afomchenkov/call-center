from typing import List, Optional, Dict, Set, Any
import queue
from domain.task import Task
from domain.ticket import Ticket
from domain.agent import Agent
from domain.ticket_assignment import TicketAssignment
from utils.ticket_queue import TicketQueue
from services.dynamodb_state_store import DynamoDBStateStore

class TicketAssignmentService:
    def __init__(self, state_store: Optional[DynamoDBStateStore] = None):
        self.agents: Dict[str, Agent] = {}  # Map agent IDs to Agent objects
        self.agent_names: Dict[str, str] = {}  # Map agent names to agent IDs
        self.ticket_queue = TicketQueue()
        self.completed_tasks: Set[str] = set()  # Track completed task IDs
        self.assigned_ticket_ids: Set[str] = set()  # Track assigned ticket IDs
        self.ticket_to_task_map: Dict[str, List[str]] = {}  # Map ticket IDs to task IDs
    #     self.state_store = state_store
    #     self._load_state()

    # def _load_state(self) -> None:
    #     if not self.state_store:
    #         return
    #     state = self.state_store.load_state()
    #     if not state:
    #         return
    #     self._restore_state(state)

    # def save_state(self) -> None:
    #     if not self.state_store:
    #         return
    #     state = self._serialize_state()
    #     self.state_store.save_state(state)

    def register_agent(self, agent: Agent) -> bool:
        """Register an agent if not already exists"""
        # Check if agent name is already taken
        if agent.name in self.agent_names:
            return False
        
        # Add agent to maps
        self.agents[agent.id] = agent
        self.agent_names[agent.name] = agent.id
        # self.save_state()
        return True
    
    def get_agent_by_name(self, name: str) -> Optional[Agent]:
        """Get agent by name"""
        if name not in self.agent_names:
            return None
        return self.agents[self.agent_names[name]]
    
    def get_agent_by_id(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    def is_ticket_assigned_or_queued(self, ticket_id: str) -> bool:
        """Check if a ticket is already assigned or queued"""
        return (ticket_id in self.assigned_ticket_ids or 
                self.ticket_queue.is_ticket_queued(ticket_id))
    
    def assign_ticket(self, ticket: Ticket) -> Optional[TicketAssignment]:
        # Check if ticket is already assigned or queued
        if self.is_ticket_assigned_or_queued(ticket.id):
            return None
            
        # First, try to find a suitable agent
        best_agent = None
        min_tasks = float('inf')
        
        for agent in self.agents.values():
            if agent.can_accept_task(ticket):
                # Prefer agent with fewer tasks
                if len(agent.assigned_tasks) < min_tasks:
                    min_tasks = len(agent.assigned_tasks)
                    best_agent = agent
        
        if best_agent:
            # Create a new task for this ticket
            task = Task(ticket.platform)
            # Assign the ticket
            best_agent.assigned_tasks.append(task)
            # self.record_assignment(ticket, task)
            # Mark ticket as assigned
            self.assigned_ticket_ids.add(ticket.id)
            # Track which tasks belong to which ticket
            if ticket.id not in self.ticket_to_task_map:
                self.ticket_to_task_map[ticket.id] = []
            self.ticket_to_task_map[ticket.id].append(task.id)
            return TicketAssignment(best_agent, ticket, task)
        else:
            # Queue the ticket for later assignment
            success = self.ticket_queue.add_ticket(ticket)
            if not success:
                # Ticket is already in queue
                return None
            # self.save_state()
            return None
    
    def process_queued_tickets(self):
        """Try to assign queued tickets when agents become available"""
        ticket = self.ticket_queue.get_next_ticket()
        while ticket:
            # Since we're taking the ticket from the queue, we need to either
            # assign it or put it back
            assignment = None
            
            # Find a suitable agent
            best_agent = None
            min_tasks = float('inf')
            
            for agent in self.agents.values():
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
                self.assigned_ticket_ids.add(ticket.id)
                # self.record_assignment(ticket, task)
                assignment = TicketAssignment(best_agent, ticket, task)
            
            if not assignment:
                # If we couldn't assign this ticket, put it back and stop
                self.ticket_queue.add_ticket(ticket)
                # self.save_state()
                break
                
            # Try the next ticket
            ticket = self.ticket_queue.get_next_ticket()
        # self.save_state()
    
    def mark_task_complete(self, agent_id: str, task_id: str) -> bool:
        """Mark a task as complete and remove it from agent's assigned tasks"""
        # Check if task already completed
        if task_id in self.completed_tasks:
            return False
            
        if agent_id not in self.agents:
            return False
            
        agent = self.agents[agent_id]
        task_found = False
        
        for i, task in enumerate(agent.assigned_tasks):
            if task.id == task_id:
                # Remove the task
                agent.assigned_tasks.pop(i)
                # Mark as completed
                self.completed_tasks.add(task_id)
                task_found = True
                break
                
        if not task_found:
            return False
        
        # Clean up ticket_to_task_map and assigned_ticket_ids
        ticket_to_remove = None
        for ticket_id, task_ids in self.ticket_to_task_map.items():
            if task_id in task_ids:
                task_ids.remove(task_id)
                # If this was the last task for this ticket, we can remove the ticket ID
                if not task_ids:
                    ticket_to_remove = ticket_id
                break
        
        # Remove the ticket ID if all its tasks are completed
        if ticket_to_remove:
            self.assigned_ticket_ids.remove(ticket_to_remove)
            del self.ticket_to_task_map[ticket_to_remove]
        
        # Try to assign queued tickets
        self.process_queued_tickets()
        # self.save_state()
        return True

    # def reset(self) -> None:
    #     self.agents = {}
    #     self.agent_names = {}
    #     self.ticket_queue = TicketQueue()
    #     self.completed_tasks = set()
    #     self.assigned_ticket_ids = set()
    #     self.ticket_to_task_map = {}
    #     self.save_state()

    # def record_assignment(self, ticket: Ticket, task: Task) -> None:
    #     self.assigned_ticket_ids.add(ticket.id)
    #     if ticket.id not in self.ticket_to_task_map:
    #         self.ticket_to_task_map[ticket.id] = []
    #     self.ticket_to_task_map[ticket.id].append(task.id)
    #     self.save_state()

    # def _serialize_state(self) -> Dict[str, Any]:
    #     agents = []
    #     for agent in self.agents.values():
    #         agents.append(
    #             {
    #                 "id": agent.id,
    #                 "name": agent.name,
    #                 "language_skills": list(agent.language_skills),
    #                 "assigned_tasks": [
    #                     {"id": task.id, "platform": task.platform} for task in agent.assigned_tasks
    #                 ],
    #             }
    #         )
    #     queue_state = self._serialize_queue()
    #     return {
    #         "agents": agents,
    #         "ticket_queue": queue_state,
    #         "completed_tasks": list(self.completed_tasks),
    #         "assigned_ticket_ids": list(self.assigned_ticket_ids),
    #         "ticket_to_task_map": self.ticket_to_task_map,
    #     }

    # def _serialize_queue(self) -> Dict[str, Any]:
    #     def snapshot_queue(priority_queue: queue.PriorityQueue) -> List[Dict[str, Any]]:
    #         queue_copy = queue.PriorityQueue()
    #         items = []
    #         while not priority_queue.empty():
    #             priority, counter, ticket = priority_queue.get()
    #             items.append(
    #                 {
    #                     "priority": priority,
    #                     "counter": counter,
    #                     "ticket": {
    #                         "id": ticket.id,
    #                         "restrictions": list(ticket.restrictions),
    #                         "platform": ticket.platform,
    #                         "is_voice": ticket.is_voice,
    #                         "created_at": ticket.created_at,
    #                     },
    #                 }
    #             )
    #             queue_copy.put((priority, counter, ticket))
    #         while not queue_copy.empty():
    #             priority_queue.put(queue_copy.get())
    #         return items

    #     return {
    #         "counter": self.ticket_queue.counter,
    #         "voice_items": snapshot_queue(self.ticket_queue.voice_queue),
    #         "text_items": snapshot_queue(self.ticket_queue.text_queue),
    #     }

    # def _restore_state(self, state: Dict[str, Any]) -> None:
    #     agents = {}
    #     agent_names = {}
    #     for data in state.get("agents", []):
    #         agent = Agent(
    #             id=data.get("id"),
    #             name=data.get("name"),
    #             language_skills=data.get("language_skills", []),
    #         )
    #         for task_data in data.get("assigned_tasks", []):
    #             agent.assigned_tasks.append(
    #                 Task(platform=task_data.get("platform"), id=task_data.get("id"))
    #             )
    #         agents[agent.id] = agent
    #         agent_names[agent.name] = agent.id
    #     self.agents = agents
    #     self.agent_names = agent_names
    #     self.completed_tasks = set(state.get("completed_tasks", []))
    #     self.assigned_ticket_ids = set(state.get("assigned_ticket_ids", []))
    #     self.ticket_to_task_map = state.get("ticket_to_task_map", {})
    #     self.ticket_queue = TicketQueue()
    #     queue_state = state.get("ticket_queue", {})
    #     self.ticket_queue.counter = queue_state.get("counter", 0)
    #     for item in queue_state.get("voice_items", []):
    #         ticket_data = item.get("ticket", {})
    #         ticket = Ticket(
    #             id=ticket_data.get("id"),
    #             restrictions=ticket_data.get("restrictions", []),
    #             platform=ticket_data.get("platform"),
    #             created_at=ticket_data.get("created_at"),
    #         )
    #         self.ticket_queue.voice_queue.put(
    #             (item.get("priority", 0), item.get("counter", 0), ticket)
    #         )
    #         self.ticket_queue.queued_ticket_ids.add(ticket.id)
    #     for item in queue_state.get("text_items", []):
    #         ticket_data = item.get("ticket", {})
    #         ticket = Ticket(
    #             id=ticket_data.get("id"),
    #             restrictions=ticket_data.get("restrictions", []),
    #             platform=ticket_data.get("platform"),
    #             created_at=ticket_data.get("created_at"),
    #         )
    #         self.ticket_queue.text_queue.put(
    #             (item.get("priority", 0), item.get("counter", 0), ticket)
    #         )
    #         self.ticket_queue.queued_ticket_ids.add(ticket.id)
