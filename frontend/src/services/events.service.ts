import api from './api';
import { ActivityEvent, EventStats } from '@/src/types';

export const eventsService = {
  async getAll(): Promise<ActivityEvent[]> {
    const response = await api.get<ActivityEvent[]>('/events');
    return response.data;
  },

  async create(data: { message: string }): Promise<ActivityEvent> {
    const response = await api.post<ActivityEvent>('/events', data);
    return response.data;
  },

  async getStats(): Promise<EventStats> {
    const response = await api.get<EventStats>('/events/stats');
    return response.data;
  },
};