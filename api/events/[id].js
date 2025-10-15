const { connectDB, getSupabase } = require('../../server/database');

// Connect to database
connectDB().catch((error) => {
  console.error('Database connection failed:', error);
  console.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly');
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const supabase = getSupabase();

    switch (req.method) {
      case 'GET':
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Event not found' });
          }
          throw error;
        }
        
        res.status(200).json(data);
        break;

      case 'PUT':
        const { title, description, start_date, end_date } = req.body;
        
        if (!title || !start_date || !end_date) {
          return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
        }
        
        const { data: updatedEvent, error: updateError } = await supabase
          .from('events')
          .update({
            title,
            description: description || '',
            start_date: new Date(start_date).toISOString(),
            end_date: new Date(end_date).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (updateError) {
          if (updateError.code === 'PGRST116') {
            return res.status(404).json({ error: 'Event not found' });
          }
          throw updateError;
        }
        
        res.status(200).json(updatedEvent);
        break;

      case 'DELETE':
        const { data: deletedEvent, error: deleteError } = await supabase
          .from('events')
          .delete()
          .eq('id', id)
          .select();
        
        if (deleteError) throw deleteError;
        
        if (!deletedEvent || deletedEvent.length === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json({ message: 'Event deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
