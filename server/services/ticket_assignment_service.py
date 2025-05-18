from typing import List, Optional, Dict, Any, Set
from domain.task import TaskType, TaskPlatform, Task
from domain.ticket import Ticket
from domain.agent import Agent
from domain.ticket_assignment import TicketAssignment
from utils.ticket_queue import TicketQueue

class TicketAssignmentService:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}  # Map agent IDs to Agent objects
        self.agent_names: Dict[str, str] = {}  # Map agent names to agent IDs
        self.ticket_queue = TicketQueue()
        self.completed_tasks: Set[str] = set()  # Track completed task IDs
        self.assigned_ticket_ids: Set[str] = set()  # Track assigned ticket IDs
        self.ticket_to_task_map: Dict[str, List[str]] = {}  # Map ticket IDs to task IDs
    
    def register_agent(self, agent: Agent) -> bool:
        """Register an agent if not already exists"""
        # Check if agent name is already taken
        if agent.name in self.agent_names:
            return False
        
        # Add agent to maps
        self.agents[agent.id] = agent
        self.agent_names[agent.name] = agent.id
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
                assignment = TicketAssignment(best_agent, ticket, task)
            
            if not assignment:
                # If we couldn't assign this ticket, put it back and stop
                self.ticket_queue.add_ticket(ticket)
                break
                
            # Try the next ticket
            ticket = self.ticket_queue.get_next_ticket()
    
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
        return True