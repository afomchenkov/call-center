from typing import List, Optional
from domain.task import TaskPlatform
import uuid
import time

# class Ticket:
#     def __init__(
#         self,
#         id: Optional[str] = None,
#         restrictions: List[str] = None,
#         platform: str = None,
#         created_at: Optional[float] = None,
#     ):
#         # Generate UUID if not provided
#         self.id = id if id else str(uuid.uuid4())
#         self.restrictions = restrictions or []
#         self.platform = platform
#         self.is_voice = TaskPlatform.is_voice(platform) if platform else False
#         self.created_at = created_at if created_at is not None else time.time()

class Ticket:
    def __init__(self, id: Optional[str] = None, restrictions: List[str] = [], platform: str = ""):
        # Generate UUID if not provided
        self.id = id if id else str(uuid.uuid4())
        self.restrictions = restrictions or []
        self.platform = platform
        self.is_voice = TaskPlatform.is_voice(platform) if platform else False
        self.created_at = time.time()
