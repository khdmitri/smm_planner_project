from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class PromptInput(BaseModel):
    role: str
    content: str
    timestamp: datetime = None


class Content(BaseModel):
    conversation: List[PromptInput]
    internet_access: bool = False
    prompt: PromptInput


class ChatRequest(BaseModel):
    conversation_id: str
    jailbreak: str
    model: Optional[str] = None
    provider: Optional[str] = None
    content: Content

