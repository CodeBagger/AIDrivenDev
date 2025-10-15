export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: number;
}
