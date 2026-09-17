import { LectureData, ApiErrorResponse } from '../types';
import { mockData } from '../mockData';

const API_BASE_URL = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK = true;

export async function generateMaterials(lectureText: string): Promise<LectureData> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return mockData as LectureData;
  }

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: lectureText })
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Не удалось сгенерировать материалы. Попробуйте еще раз.');
  }

  return response.json();
}
