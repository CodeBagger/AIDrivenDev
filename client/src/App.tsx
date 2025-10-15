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
      setError('Failed to load events. Please check if the server is running.');
      console.error('Error loading events:', err);
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

  // Pre-fill form with selected slot data
  const getInitialFormData = (): CreateEventRequest | UpdateEventRequest => {
    if (selectedEvent) {
      return {
        id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description,
        start_date: new Date(selectedEvent.start_date).toISOString(),
        end_date: new Date(selectedEvent.end_date).toISOString(),
      };
    } else if (selectedSlot) {
      return {
        title: '',
        description: '',
        start_date: selectedSlot.start.toISOString(),
        end_date: selectedSlot.end.toISOString(),
      };
    }
    return {
      title: '',
      description: '',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    };
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
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
      />
    </div>
  );
}

export default App;
