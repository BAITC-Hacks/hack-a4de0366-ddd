import { useMemo, useState } from 'react';
import { generateMaterials } from './services/api';
import type { LectureData } from './types';

const sampleLecture = `В современном мире информация постоянно меняется, поэтому человеку важно уметь быстро выделять главное из длинных текстов. Структурирование знаний помогает не просто запоминать факты, но и понимать связи между идеями, событиями и понятиями. В лекции рассматриваются практические способы анализа текста, выделения ключевых мыслей и создания понятного конспекта для дальнейшего повторения. Такой подход особенно полезен в обучении, когда нужно быстро восстанавливать основные тезисы, проверять понимание и закреплять материал с помощью вопросов и карточек.`;

function App() {
  const [text, setText] = useState(sampleLecture);
  const [result, setResult] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charsCount = useMemo(() => text.trim().length, [text]);
  const isValidText = charsCount >= 150;

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
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">First stage</p>
        <h1>Hello World</h1>
        <p className="subtitle">Lecture AI Assistant</p>
      </section>

      <section className="content-grid">
        <div className="panel input-panel">
          <label htmlFor="lecture-input" className="panel-title">
            Вставьте лекцию
          </label>

          <textarea
            id="lecture-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={12}
            placeholder="Введите текст лекции..."
          />

          <div className="meta-row">
            <span className={isValidText ? 'meta ok' : 'meta'}>{charsCount} символов</span>
            <button onClick={handleGenerate} disabled={loading || !isValidText}>
              {loading ? 'Генерация...' : 'Сгенерировать'}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="panel output-panel">
          {!result && !loading && (
            <div className="empty-state">
              <h2>Материалы появятся здесь</h2>
              <p>Сгенерируем резюме, ключевые пункты, квиз и карточки.</p>
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
                <div className="stack-list">
                  {result.quiz.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="question-card">
                      <p className="small-label">Вопрос {index + 1}</p>
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
        </div>
      </section>
    </main>
  );
}

export default App;
