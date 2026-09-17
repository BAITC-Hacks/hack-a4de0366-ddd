export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface LectureData {
  summary: string;
  key_points: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface LectureRequest {
  text: string;
}

export interface ApiErrorResponse {
  detail?: string;
}
