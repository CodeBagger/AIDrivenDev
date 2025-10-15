# Schedule Manager

A modern scheduling application built with React frontend and Node.js backend with SQL Server Express database.

## Features

- 📅 **Calendar View**: Interactive calendar with month, week, and day views
- ➕ **Event Management**: Create, edit, and delete events
- 🎨 **Modern UI**: Responsive design with beautiful styling
- 💾 **Data Persistence**: SQL Server Express database for reliable data storage
- 🔄 **Real-time Updates**: Instant updates when events are modified

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **SQL Server Express** (2019 or higher)
- **npm** (comes with Node.js)

## Database Setup

1. **Install SQL Server Express**:
   - Download from [Microsoft's official website](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - During installation, set a strong password for the `sa` account
   - Note down the server name (usually `localhost` or `localhost\SQLEXPRESS`)

2. **Configure Database Connection**:
   - Open `server/config.js`
   - Update the database configuration with your SQL Server details:
   ```javascript
   const config = {
     server: 'localhost', // or 'localhost\\SQLEXPRESS'
     database: 'SchedulingApp',
     port: 1433,
     options: {
       encrypt: true,
       trustServerCertificate: true,
       // Uses Windows Authentication automatically
       integratedSecurity: true
     }
   };
   ```
   
   **Note**: The application uses Windows Authentication, so no username/password is required. Make sure your Windows user account has access to SQL Server.

## Installation

1. **Clone or download the project**:
   ```bash
   cd scheduling-app
   ```

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

   This will install dependencies for:
   - Root project (concurrently for running both servers)
   - Backend server (Express, SQL Server driver, etc.)
   - Frontend client (React, calendar components, etc.)

## Running the Application

1. **Start both frontend and backend servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

2. **Access the application**:
   - Open your browser and go to `http://localhost:3000`
   - The calendar will automatically load and display any existing events

## Manual Server Management

If you prefer to run servers separately:

**Backend only**:
```bash
npm run server
```

**Frontend only**:
```bash
npm run client
```

## Usage

### Creating Events
1. Click on any empty time slot in the calendar
2. Fill in the event details (title, description, start/end times)
3. Click "Create Event"

### Editing Events
1. Click on any existing event in the calendar
2. Modify the event details
3. Click "Update Event"

### Deleting Events
1. Click on an existing event to open the edit form
2. Click the "Delete" button
3. Confirm the deletion

### Calendar Views
- **Month View**: See all events for the month
- **Week View**: Detailed week schedule
- **Day View**: Hourly view for a specific day

## Project Structure

```
scheduling-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Calendar.tsx
│   │   │   ├── Calendar.css
│   │   │   ├── EventForm.tsx
│   │   │   └── EventForm.css
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript interfaces
│   │   │   └── Event.ts
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── database.js        # Database connection
│   ├── config.js          # Database configuration
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/health` - Health check

## Troubleshooting

### Database Connection Issues
- Ensure SQL Server Express is running
- Check that the server name in `config.js` is correct
- Verify that SQL Server is configured to accept TCP/IP connections
- **Windows Authentication**: Make sure your Windows user account has access to SQL Server
  - Open SQL Server Management Studio (SSMS)
  - Connect using Windows Authentication
  - If you can't connect, you may need to add your Windows user as a SQL Server login
- Make sure the `SchedulingApp` database exists (it will be created automatically on first run)

### Port Already in Use
- If port 3000 or 5000 is already in use, you can change them:
  - Backend: Set `PORT` environment variable or modify `server/index.js`
  - Frontend: Set `PORT` environment variable before running `npm start`

### CORS Issues
- The backend is configured to allow CORS from `http://localhost:3000`
- If you change the frontend port, update the CORS configuration in `server/index.js`

## Technologies Used

### Frontend
- **React** with TypeScript
- **react-big-calendar** for calendar functionality
- **moment.js** for date handling
- **axios** for API calls
- **CSS3** for styling

### Backend
- **Node.js** with Express
- **mssql** for SQL Server connectivity
- **cors** for cross-origin requests
- **body-parser** for request parsing

### Database
- **SQL Server Express** for data persistence

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
