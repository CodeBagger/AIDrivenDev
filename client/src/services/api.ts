import axios from 'axios';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/Event';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

console.log('API_BASE_URL:', API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventService = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      console.log('Making request to:', API_BASE_URL + '/events');
      const response = await api.get('/events');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get event by ID
  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventData: UpdateEventRequest): Promise<Event> => {
    const response = await api.put(`/events/${eventData.id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

export default api;
