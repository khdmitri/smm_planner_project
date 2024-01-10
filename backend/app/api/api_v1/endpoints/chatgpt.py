import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import JSONResponse

from app import models
from app.api import deps
from app.common.logger import get_logger
from app.core.chatGpt.conversation import build_messages
from app.core.chatGpt.utils import GptStateSingleton
from app.schemas import ChatRequest

router = APIRouter()
logger = get_logger(logging.INFO)
gptSingleton = GptStateSingleton()


@router.get("/providers")
async def get_providers(
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    result = gptSingleton.get_providers()
    return JSONResponse(result)


@router.post("/conversation")
async def conversation(
        *,
        chat_in: ChatRequest,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    conversation_id = chat_in.conversation_id
    try:
        messages = build_messages(chat_in)

        # Generate response
        response = await gptSingleton.get_answer(chat_in.provider, chat_in.model, conversation_id, messages)

        # return StreamingResponse(generate_stream(response, chat_in.jailbreak), media_type='text/event-stream')
        return JSONResponse(response)
    except Exception as e:
        print(e)
        print(e.__traceback__.tb_next)
        raise HTTPException(
            status_code=400, detail=f"Temporary unavailable: {str(e)}"
        )
