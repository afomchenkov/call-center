from enum import Enum
import uuid

class TaskType(Enum):
    VOICE = "voice"
    TEXT = "text"

class TaskPlatform:
    CALL = "call"
    EMAIL = "email"
    FACEBOOK_CHAT = "facebook_chat"
    WEBSITE_CHAT = "website_chat"
    
    @staticmethod
    def is_voice(platform: str) -> bool:
        return platform == TaskPlatform.CALL

class Task:
    def __init__(self, platform: str):
        self.id = str(uuid.uuid4())  # Generate unique ID for each task
        self.platform = platform
        self.is_voice = TaskPlatform.is_voice(platform)