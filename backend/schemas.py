from pydantic import BaseModel, Field, field_validator


class SourceEvidence(BaseModel):
    source_quote: str = Field(min_length=1, description="Точная цитата из исходной лекции")


class KeyPoint(SourceEvidence):
    text: str = Field(min_length=1)


class QuizQuestion(BaseModel):
    question: str = Field(min_length=1)
    options: list[str] = Field(min_length=2, max_length=6)
    correct_index: int = Field(ge=0)
    explanation: str = Field(min_length=1)
    source_quote: str = Field(min_length=1, description="Цитата, на которой основан вопрос")

    @field_validator("correct_index")
    @classmethod
    def correct_index_is_valid(cls, value: int, info):
        options = info.data.get("options")
        if options is not None and value >= len(options):
            raise ValueError("correct_index must point to an option")
        return value


class Flashcard(BaseModel):
    front: str = Field(min_length=1)
    back: str = Field(min_length=1)
    source_quote: str = Field(min_length=1, description="Цитата, на которой основана карточка")


class LectureResponse(BaseModel):
    summary: str = Field(min_length=1)
    summary_source_quote: str = Field(min_length=1)
    key_points: list[KeyPoint] = Field(min_length=1, max_length=12)
    quiz: list[QuizQuestion] = Field(min_length=1, max_length=10)
    flashcards: list[Flashcard] = Field(min_length=1, max_length=20)
    confidence_score: int = Field(ge=0, le=100)
    original_reading_minutes: int = Field(ge=1)
    summary_reading_minutes: int = Field(ge=1)
    flashcard_study_minutes: int = Field(ge=1)


class LectureRequest(BaseModel):
    text: str = Field(..., min_length=100, description="Текст лекции")

    @field_validator("text")
    @classmethod
    def text_is_not_only_whitespace(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Текст лекции не может быть пустым")
        return cleaned
