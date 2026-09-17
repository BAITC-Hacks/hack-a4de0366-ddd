import { useMemo, useState } from 'react';
import { generateMaterials } from './services/api';
import { LectureData } from './types';

const sampleLecture = `В современном мире информация быстро меняется, поэтому человеку важно уметь извлекать главное из больших текстов. Структурирование знаний помогает не просто запоминать факты, но и понимать, как они связаны между собой. В лекции рассматриваются методы анализа текста, выделения ключевых идей и создания понятной схемы для дальнейшего обучения. Основной акцент делается на практической пользе таких инструментов при подготовке к экзаменам, работе с материалами и формировании устойчивых навыков мышления. При правильном подходе структурированные заметки позволяют лучше удерживать информацию, быстрее возвращаться к важным моментам и глубже понимать сложные темы.`;

function App() {
  const [text, setText] = useState(sampleLecture);
  const [result, setResult] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidText = useMemo(() => text.trim().length >= 150, [text]);

  const handleGenerate = async () => {
    if (!isValidText) {
      setError('Текст лекции слишком короткий. Введите не менее 150 символов для анализа.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateMaterials(text);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сгенерировать материалы.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Hackathon prototype</p>
          <h1>Lecture AI Assistant</h1>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel input-panel">
          <label htmlFor="lecture-input" className="panel-title">
            Вставьте лекцию
          </label>
          <textarea
            id="lecture-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Введите текст лекции..."
            rows={14}
          />

          <div className="meta-row">
            <span className={isValidText ? 'meta ok' : 'meta'}>
              {text.trim().length} символов
            </span>
            <button onClick={handleGenerate} disabled={loading || !isValidText}>
              {loading ? 'Генерация...' : 'Сгенерировать материалы'}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}
        </section>

        <section className="panel output-panel">
          {!result && !loading && (
            <div className="empty-state">
              <h2>Материалы появятся здесь</h2>
              <p>Загрузите текст и получите краткое резюме, список ключевых пунктов, квиз и карточки.</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Генерируем материалы...</p>
            </div>
          )}

          {result && (
            <>
              <div className="section-block">
                <h2>Краткое резюме</h2>
                <p>{result.summary}</p>
              </div>

              <div className="section-block">
                <h2>Ключевые пункты</h2>
                <ul>
                  {result.key_points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="section-block">
                <h2>Квиз</h2>
                <div className="quiz-list">
                  {result.quiz.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="quiz-card">
                      <p className="question-number">Вопрос {index + 1}</p>
                      <h3>{item.question}</h3>
                      <ol>
                        {item.options.map((option, optionIndex) => (
                          <li
                            key={`${option}-${optionIndex}`}
                            className={optionIndex === item.correct_index ? 'correct-option' : ''}
                          >
                            {option}
                          </li>
                        ))}
                      </ol>
                      <p className="explanation">Объяснение: {item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-block">
                <h2>Флэшкарточки</h2>
                <div className="flashcard-grid">
                  {result.flashcards.map((card, index) => (
                    <div key={`${card.front}-${index}`} className="flashcard">
                      <span>Front</span>
                      <p>{card.front}</p>
                      <span>Back</span>
                      <p>{card.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
