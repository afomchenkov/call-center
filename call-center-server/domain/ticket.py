from typing import List, Optional, Dict, Any, Set

class Ticket:
    def __init__(self, id: Optional[str] = None, restrictions: List[str] = None, platform: str = None):
        # Generate UUID if not provided
        self.id = id if id else str(uuid.uuid4())
        self.restrictions = restrictions or []
        self.platform = platform
        self.is_voice = TaskPlatform.is_voice(platform) if platform else False
        self.created_at = time.time()
