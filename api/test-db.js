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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

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
    
    res.status(200).json({ 
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
}
