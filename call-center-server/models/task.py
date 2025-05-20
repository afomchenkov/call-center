from pydantic import BaseModel

class TaskResponse(BaseModel):
    id: str
    platform: str
    is_voice: bool
