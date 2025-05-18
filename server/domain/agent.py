from typing import List, Optional, Dict, Any, Set
from domain.ticket import Ticket

class Agent:
    def __init__(self, name: str, language_skills: List[str], id: Optional[str] = None):
        self.id = id if id else str(uuid.uuid4())
        self.name = name
        self.language_skills = language_skills
        self.assigned_tasks: List[Task] = []  # Start with no tasks
    
    def has_voice_call(self) -> bool:
        return any(task.is_voice for task in self.assigned_tasks)
    
    def can_handle_language(self, language: str) -> bool:
        return language in self.language_skills
    
    def can_accept_task(self, ticket: Ticket) -> bool:
        # Check language compatibility
        if not any(self.can_handle_language(lang) for lang in ticket.restrictions):
            return False
            
        # Check capacity constraints
        if ticket.is_voice:
            # Cannot handle two voice calls
            if self.has_voice_call():
                return False
            # Max 3 tasks if one is a voice call
            return len(self.assigned_tasks) < 3
        else:
            # Text-based task
            if self.has_voice_call():
                # Max 3 tasks if one is a voice call
                return len(self.assigned_tasks) < 3
            else:
                # Max 4 text-based tasks
                return len(self.assigned_tasks) < 4
    
    def get_task_platforms(self) -> List[str]:
        """Get list of task platforms for API responses"""
        return [task.platform for task in self.assigned_tasks]