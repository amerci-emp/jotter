# Jotter - Activity Note Taking Application

A real-time note-taking application designed for caregivers and professionals to track user activities, progress, and behavioral changes over time. Features version control for maintaining accurate historical records.

## Tech Stack

- **Frontend**
  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- **Backend & API**
  - tRPC for type-safe API
  - JSON Server (lightweight database)

- **Development Tools**
  - Node.js
  - npm/yarn
  - Git

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git

## Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd note-taking
   npm install
   ```

2. **Configure JSON Server**
   - Create a `db.json` file in the root directory
   - Add initial data structure:
   ```json
   {
     "members": [],
     "notes": []
   }
   ```

3. **Start the Application**
   ```bash
   # Terminal 1: Start JSON Server (Database)
   npm run json-server

   # Terminal 2: Start Next.js Development Server
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Use Cases

### 1. Care Facility Management
- Track resident activities and behaviors
- Monitor daily progress
- Document medication responses
- Share updates between shift changes
- Maintain historical records of care

### 2. Educational Progress Tracking
- Record student achievements
- Document behavioral observations
- Track intervention effectiveness
- Maintain communication logs
- Monitor development milestones

### 3. Behavioral Therapy
- Document session notes
- Track intervention strategies
- Record client progress
- Maintain treatment history
- Share updates with care team

## Core Features

### User Management
- Create profiles for residents/clients
- Edit user information
- Remove inactive users
- Quick user switching
- Auto-select active users

### Note Taking
- Real-time note creation
- Chronological organization
- Date-based grouping
- Multi-line support
- Auto-scroll to recent notes

### Version Control
- Edit history tracking
- Timestamp preservation
- Version comparison
- Change indicators
- Audit trail maintenance

## Data Management

### User Object Structure
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
}
```

### Note Object Structure
```typescript
interface Note {
  id: string;
  member: string;
  text: string;
  timestamp: string;
  versions?: {
    text: string;
    timestamp: string;
  }[];
}
```

## API Reference

### User Endpoints
- `GET /members` - Retrieve all users
- `POST /members` - Create user
- `PUT /members/:id` - Update user
- `DELETE /members/:id` - Remove user

### Note Endpoints
- `GET /notes?member=:id` - Get user notes
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

[MIT License](LICENSE) 