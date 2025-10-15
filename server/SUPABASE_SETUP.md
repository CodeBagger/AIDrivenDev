# Supabase Migration Setup

This document explains how to set up your application with Supabase instead of SQL Server.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=5000
```

### 3. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key
4. Add them to your `.env` file

### 4. Create Database Table

Run the SQL migration script in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Execute the script

### 5. Start the Server

```bash
npm start
# or for development
npm run dev
```

## Database Schema

The events table has the following structure:

- `id` - SERIAL PRIMARY KEY (auto-incrementing integer)
- `title` - VARCHAR(255) NOT NULL
- `description` - TEXT (optional)
- `start_date` - TIMESTAMP WITH TIME ZONE NOT NULL
- `end_date` - TIMESTAMP WITH TIME ZONE NOT NULL
- `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()

## Key Changes from SQL Server

1. **Database Driver**: Replaced `mssql` with `@supabase/supabase-js`
2. **Query Syntax**: Converted from T-SQL to PostgreSQL/Supabase syntax
3. **Connection**: Using Supabase client instead of connection pool
4. **Data Types**: 
   - `INT IDENTITY` → `SERIAL`
   - `NVARCHAR` → `VARCHAR`
   - `DATETIME2` → `TIMESTAMP WITH TIME ZONE`
5. **Auto-increment**: Using PostgreSQL SERIAL instead of IDENTITY
6. **Timestamps**: Using `NOW()` instead of `GETDATE()`

## API Endpoints

All existing API endpoints remain the same:

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/health` - Health check

## Troubleshooting

1. **Connection Issues**: Verify your Supabase URL and API key
2. **Table Not Found**: Make sure you've run the migration SQL script
3. **Permission Errors**: Check your Row Level Security policies in Supabase
4. **Date Format Issues**: Ensure dates are sent in ISO format from the client
