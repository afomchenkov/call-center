from pydantic import BaseModel
from typing import Optional

class AssignmentResponse(BaseModel):
    ticket_id: str
    agent_id: Optional[str] = None
    agent_name: Optional[str] = None
    task_id: Optional[str] = None
    queued: bool
