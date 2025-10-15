import React, { useState, useEffect } from 'react';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/Event';
import './EventForm.css';

interface EventFormProps {
  event?: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: CreateEventRequest | UpdateEventRequest) => void;
  onDelete?: (id: number) => void;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start_date: new Date(event.start_date).toISOString().slice(0, 16),
        end_date: new Date(event.end_date).toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_date || !formData.end_date) {
      alert('Please fill in all required fields');
      return;
    }

    const eventData = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    if (event) {
      onSave({ ...eventData, id: event.id } as UpdateEventRequest);
    } else {
      onSave(eventData as CreateEventRequest);
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      if (window.confirm('Are you sure you want to delete this event?')) {
        onDelete(event.id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date & Time *</label>
              <input
                type="datetime-local"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date & Time *</label>
              <input
                type="datetime-local"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            {event && onDelete && (
              <button type="button" onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
