const supabase = require('./supabase-config');

let isConnected = false;

const connectDB = async () => {
  try {
    if (!isConnected) {
      // Test the connection
      const { data, error } = await supabase.from('events').select('count').limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, create it
        await createEventsTable();
      } else if (error) {
        throw error;
      }
      
      isConnected = true;
      console.log('Connected to Supabase');
    }
    return supabase;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

const createEventsTable = async () => {
  try {
    // Note: In Supabase, you typically create tables through the dashboard or SQL editor
    // This is a fallback that tries to create the table if it doesn't exist
    const { error } = await supabase.rpc('create_events_table_if_not_exists');
    
    if (error) {
      console.log('Table creation via RPC failed, this is normal if using Supabase dashboard');
      console.log('Please create the events table manually in your Supabase dashboard with the following SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date TIMESTAMP WITH TIME ZONE NOT NULL,
          end_date TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    } else {
      console.log('Events table created or already exists');
    }
  } catch (err) {
    console.error('Error creating events table:', err);
    console.log('Please create the events table manually in your Supabase dashboard');
  }
};

const getSupabase = () => {
  if (!isConnected) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return supabase;
};

module.exports = { connectDB, getSupabase };

