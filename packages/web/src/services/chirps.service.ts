import { API_URL } from '@/constants';
import { PaginationMeta } from '@/common/models/base.model';
import { getHeaders } from '@/services/auth.service';

export type PaginationParams = Pick<PaginationMeta, 'page' | 'pageSize'>;

export const ChirpService = new (class {
  public async getAll({ page = 1, pageSize = 5 }: PaginationParams) {
    const response = await fetch(`${API_URL}/chirps?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || 'Unknown error';
      throw new Error(message);
    }

    return response.json();
  }
  public async create(payload: { title: string; content: string }) {
    const response = await fetch(`${API_URL}/chirps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || 'Failed to create chirp';
      throw new Error(message);
    }

    return response.json();
  }
  public async update(id: number, payload: { title: string; content: string }) {
    const response = await fetch(`${API_URL}/chirps/${id}`, {
      method: 'PUTCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || 'Failed to update chirp';
      throw new Error(message);
    }

    return response.json();
  }

  public async delete(id: number) {
    const response = await fetch(`${API_URL}/chirps/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || 'Failed to delete chirp';
      throw new Error(message);
    }

    return response.json();
  }
})();
