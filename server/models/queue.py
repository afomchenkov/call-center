from pydantic import BaseModel
from typing import List
from models.ticket import QueuedTicketResponse

class QueueStatusResponse(BaseModel):
    voice_queue: List[QueuedTicketResponse]
    text_queue: List[QueuedTicketResponse]
    total_queued: int  # Changed from List to int
