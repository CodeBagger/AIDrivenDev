const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB, getSupabase } = require('../server/database');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
connectDB().catch((error) => {
  console.error('Database connection failed:', error);
  console.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly');
});

// Routes
app.get('/api/events', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    
    if (!title || !start_date || !end_date) {
      return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description: description || '',
          start_date: new Date(start_date).toISOString(),
          end_date: new Date(end_date).toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    
    if (!title || !start_date || !end_date) {
      return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        description: description || '',
        start_date: new Date(start_date).toISOString(),
        end_date: new Date(end_date).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint to verify database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('events').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Database connection failed',
        error: error.message 
      });
    }
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      data: data 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database test failed',
      error: err.message 
    });
  }
});

// Export the app for Vercel
module.exports = app;
