const { connectDB, getSupabase } = require('../server/database');

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

  try {
    const supabase = getSupabase();

    switch (req.method) {
      case 'GET':
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true });
        
        if (error) throw error;
        res.status(200).json(data);
        break;

      case 'POST':
        const { title, description, start_date, end_date } = req.body;
        
        if (!title || !start_date || !end_date) {
          return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
        }
        
        const { data: newEvent, error: createError } = await supabase
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
        
        if (createError) throw createError;
        res.status(201).json(newEvent);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
