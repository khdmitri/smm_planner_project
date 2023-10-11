from typing import List

from pydantic import BaseModel


class Conversation(BaseModel):
    history: List[str] = []


class Content(BaseModel):
    conversation: Conversation
    internet_access: bool = False
    prompt: str


class ChatRequest(BaseModel):
    conversation_id: str
    jailbreak: str
    model: str
    content: Content

