import React, { useState, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import { eventService } from './services/api';
import { Event, CreateEventRequest, UpdateEventRequest } from './types/Event';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventService.getEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 404) {
          setError('API endpoint not found. Please check the deployment configuration.');
        } else if (axiosError.response?.status >= 500) {
          setError('Server error. Please check the backend logs and database connection.');
        } else {
          setError(`Failed to load events: ${axiosError.message || 'Unknown error'}`);
        }
      } else if (err && typeof err === 'object' && 'code' in err) {
        const networkError = err as any;
        if (networkError.code === 'NETWORK_ERROR' || networkError.message?.includes('Network Error')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(`Failed to load events: ${networkError.message || 'Unknown error'}`);
        }
      } else {
        setError(`Failed to load events: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: CreateEventRequest) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      setIsFormOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  const handleUpdateEvent = async (eventData: UpdateEventRequest) => {
    try {
      const updatedEvent = await eventService.updateEvent(eventData);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  }, []);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleSaveEvent = (eventData: CreateEventRequest | UpdateEventRequest) => {
    if ('id' in eventData) {
      handleUpdateEvent(eventData);
    } else {
      handleCreateEvent(eventData);
    }
  };


  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Schedule Manager</h1>
        <p>Manage your events and appointments</p>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadEvents} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <main className="app-main">
        <Calendar
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </main>

      <EventForm
        event={selectedEvent}
        selectedSlot={selectedSlot}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
      />
    </div>
  );
}

export default App;
