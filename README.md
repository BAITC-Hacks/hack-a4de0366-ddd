# Lecture AI Assistant

FastAPI backend для генерации конспекта, ключевых пунктов, теста и flashcards по тексту лекции.

## Запуск

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Для запуска без API-ключа в `.env` установите `USE_MOCK=true`. Для реальной генерации укажите `OPENAI_API_KEY` и оставьте `USE_MOCK=false`.

```powershell
python -m uvicorn backend.main:app --reload --port 8000
```

После запуска:

- Swagger UI: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health
- Generate endpoint: `POST http://127.0.0.1:8000/api/generate`

Пример тела запроса:

```json
{
	"text": "Текст лекции длиной не менее 150 символов. Добавьте сюда полный учебный материал, который нужно проанализировать и превратить в краткое резюме, ключевые пункты, вопросы теста и карточки для повторения."
}
```

Контракт ответа находится в `backend/schemas.py`. Переменная `CORS_ORIGINS` принимает адреса frontend через запятую.
