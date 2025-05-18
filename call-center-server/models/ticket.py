from pydantic import BaseModel
from typing import List

class TicketRequest(BaseModel):
    id: str
    restrictions: List[str]
    platform: str

# Add these new models for the queue endpoint
class QueuedTicketResponse(BaseModel):
    priority: int
    position: int
    ticket_id: str
    platform: str
    restrictions: List[str]
    is_voice: bool
    created_at: float