import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event } from '../types/Event';
import './Calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onSelectEvent, onSelectSlot }) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Transform events for react-big-calendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_date),
    end: new Date(event.end_date),
    resource: event,
  }));

  const handleSelectEvent = useCallback((event: any) => {
    onSelectEvent(event.resource);
  }, [onSelectEvent]);

  const handleSelectSlot = useCallback((slotInfo: any) => {
    onSelectSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  }, [onSelectSlot]);

  const eventStyleGetter = (event: any) => {
    const backgroundColor = '#007bff';
    const borderColor = '#0056b3';
    const color = 'white';
    
    return {
      style: {
        backgroundColor,
        borderColor,
        color,
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Schedule Calendar</h2>
        <div className="view-controls">
          <button
            className={`view-btn ${view === Views.MONTH ? 'active' : ''}`}
            onClick={() => setView(Views.MONTH)}
          >
            Month
          </button>
          <button
            className={`view-btn ${view === Views.WEEK ? 'active' : ''}`}
            onClick={() => setView(Views.WEEK)}
          >
            Week
          </button>
          <button
            className={`view-btn ${view === Views.DAY ? 'active' : ''}`}
            onClick={() => setView(Views.DAY)}
          >
            Day
          </button>
        </div>
      </div>
      
      <div className="calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          step={30}
          timeslots={2}
          showMultiDayTimes
          popup
        />
      </div>
    </div>
  );
};

export default Calendar;
