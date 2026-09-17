import os

from .schemas import Flashcard, LectureResponse, QuizQuestion

SYSTEM_PROMPT = """Ты помощник по подготовке к учебе. Проанализируй текст лекции и верни:
- краткое, точное резюме;
- ключевые пункты без повторов;
- проверочный тест с одним правильным вариантом;
- полезные карточки для повторения.
Не добавляй факты, которых нет в лекции. Пиши на языке исходного текста.
"""


def _mock_response(text: str) -> LectureResponse:
    first_sentence = text.strip().replace("\n", " ").split(".")[0].strip()
    summary = first_sentence or "Материал лекции подготовлен для повторения."
    return LectureResponse(
        summary=summary,
        key_points=[
            "Основные понятия выделены из текста лекции.",
            "Материал организован для быстрого повторения.",
            "Проверьте понимание с помощью вопросов ниже.",
        ],
        quiz=[
            QuizQuestion(
                question="Какова главная тема предоставленного материала?",
                options=[summary[:120], "Тема не связана с лекцией"],
                correct_index=0,
                explanation="Первый вариант отражает содержание исходного текста.",
            )
        ],
        flashcards=[
            Flashcard(front="Что нужно повторить?", back=summary),
            Flashcard(
                front="Как проверить понимание?",
                back="Ответьте на вопросы и объясните ключевые пункты своими словами.",
            ),
        ],
    )


async def process_lecture(text: str) -> LectureResponse:
    if os.getenv("USE_MOCK", "true").lower() == "true":
        return _mock_response(text)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY не задан. Для локального запуска включите USE_MOCK=true.")

    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=api_key)
    completion = await client.beta.chat.completions.parse(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        response_format=LectureResponse,
    )

    message = completion.choices[0].message
    if message.refusal:
        raise RuntimeError(f"Модель отказалась обработать запрос: {message.refusal}")
    if message.parsed is None:
        raise RuntimeError("Модель не вернула структурированный ответ")
    return message.parsed
