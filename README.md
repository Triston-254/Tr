# Feedback Management App

A web application for collecting and managing public feedback. Users can submit feedback through a public form, while administrators can log in to view, search, and update the status of submissions.

## Features

- **Public Feedback Form**: Anyone can submit feedback/complaints without authentication
- **Admin Dashboard**: Secure area for managing submissions
- **Status Tracking**: Submissions progress through statuses (In Progress → Done/Postponed/Refined)
- **Search & Filter**: Admin can search submissions by ID, name, location, organization, or feedback content
- **Password Reset**: Admins can reset passwords via email

## How It Works

### Architecture

```
src/
├── App.js              # Main app with routing and auth state
├── firebase.js         # Firebase configuration (Auth + Firestore)
├── components/
│   └── Toast.js        # Notification component
├── pages/
│   ├── PublicFeedbackForm.js   # Public submission form
│   ├── AdminLogin.js           # Admin authentication
│   ├── AdminSubmissions.js     # Submission management table
│   ├── PasswordResetRequest.js # Password reset request
│   └── SetNewPassword.js       # Password reset confirmation
```

### Data Flow

1. **Public Form Submission**:
   - User fills form with optional name, phone, location, organization, and required feedback
   - Form validates required fields before submission
   - Firestore transaction creates sequential ID and stores submission with "In Progress" status

2. **Admin Authentication**:
   - Firebase Authentication handles admin login/logout
   - Auth state persists across page reloads
   - Protected routes redirect unauthenticated users

3. **Submission Management**:
   - Admin views submissions in a searchable table
   - Can update status via dropdown (Done, In Progress, Postponed, Refined)
   - Real-time sync with Firestore

### Firebase Collections

- `submissions/{id}` - Feedback documents with fields: name, phone, location, organization, feedback, status, createdAt
- `counters/submissions` - Tracks sequential ID counter

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
Removes the build dependency and exposes all configuration files.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Update `src/firebase.js` with your project credentials
   - Create an admin user in Firebase Authentication

3. Run the development server:
```bash
npm start
```

## Deployment

The app builds to static files and can be deployed to any hosting service (Firebase Hosting, Netlify, Vercel, etc.).
