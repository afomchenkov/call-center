from pydantic import BaseModel
from typing import List, Optional
from models.task import TaskResponse

class AgentRequest(BaseModel):
    name: str
    language_skills: List[str] = []  # No assigned_tasks parameter

class AgentResponse(BaseModel):
    id: str
    name: str
    language_skills: List[str]
    assigned_tasks: List[TaskResponse]

class AgentUpdateRequest(BaseModel):
    language_skills: Optional[List[str]] = None
    add_skills: Optional[List[str]] = None
    remove_skills: Optional[List[str]] = None