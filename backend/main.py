import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .ai_service import process_lecture
from .schemas import LectureRequest, LectureResponse

load_dotenv()

app = FastAPI(
    title="Lecture AI Assistant API",
    version="1.0.0",
    description="Генерирует учебные материалы по тексту лекции.",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate", response_model=LectureResponse)
async def generate_materials(payload: LectureRequest) -> LectureResponse:
    cleaned_text = payload.text.strip()
    if len(cleaned_text) < 150:
        raise HTTPException(
            status_code=400,
            detail="Текст лекции слишком короткий. Введите не менее 150 символов для анализа.",
        )

    try:
        return await process_lecture(cleaned_text)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Не удалось сгенерировать материалы: {error}",
        ) from error
