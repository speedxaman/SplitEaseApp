# SplitEase Authentication Integration Guide

## Overview
SplitEase now includes a premium login page with Google OAuth integration and authentication flow management.

## Features Implemented

### 1. **Authentication Context** (`src/utils/AuthContext.js`)
- **AuthProvider**: Wraps the entire app and manages authentication state
- **useAuth Hook**: Provides access to authentication functions and user data
- **Persistent Login**: User session persists across app restarts via AsyncStorage
- **Functions**:
  - `login(userData)`: Authenticate user and save session
  - `logout()`: Clear user session
  - `isLoggedIn`: Boolean to check authentication status

### 2. **Premium Login Screen** (`src/screens/LoginScreen.js`)
- **Professional Design**: Features app logo, feature cards, and branding
- **Google OAuth Integration**: One-click Google Sign-in button
- **Demo Login**: Quick login option for testing without Google credentials
- **Feature Cards**: Displays app benefits (Split Bills, Track Spending, Settle Up)
- **Premium Styling**:
  - Gold accent borders and highlights
  - Deep purple primary color (#5B21B6)
  - Professional shadow effects
  - Responsive layout

### 3. **App Integration** (`App.js`)
- **Conditional Navigation**:
  - Unauthenticated users → LoginScreen
  - Authenticated users → Main app tabs
- **Loading State**: Shows spinner while checking authentication
- **AuthProvider Wrapper**: Ensures auth context available throughout app
- **Automatic Persistence**: User session restored on app start

### 4. **User Profile Display** (`src/screens/HomeScreen.js`)
- **User Name Display**: Shows logged-in user name in header
- **Logout Button**: Red logout button in header with icon
- **Premium Header**: Updated header layout with user info and actions
- **Icon Styling**: Logout button has premium styling with top border accent

## How to Setup Google OAuth

### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web/Mobile)
5. Copy your Client ID

### Step 2: Configure LoginScreen
In `src/screens/LoginScreen.js`, replace:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

With your actual Google Client ID.

### Step 3: Verify JWT Token
For production, implement proper JWT verification on your backend:
```javascript
// In handleGoogleSignIn function, verify token properly:
// 1. Send token to backend
// 2. Backend verifies with Google
// 3. Receive user data from backend
```

## Current Implementation

### Demo Login
For immediate testing, the app includes a **Demo Login** button that:
- Logs in with mock user data
- No Google credentials required
- Perfect for testing the app flow

### User Data Stored
The app stores:
- User ID
- Name
- Email
- Profile Picture URL
- Login timestamp

## Authentication Flow

```
App Starts
    ↓
Check AsyncStorage for saved user
    ↓
If user exists → Show Main App
If no user → Show LoginScreen
    ↓
User clicks "Sign in with Google" or "Try Demo"
    ↓
OAuth flow (or Demo login)
    ↓
User data saved to AsyncStorage
    ↓
Show Main App
    ↓
User clicks Logout
    ↓
Clear AsyncStorage
    ↓
Back to LoginScreen
```

## File Structure
```
src/
├── utils/
│   └── AuthContext.js          (Authentication state & functions)
├── screens/
│   ├── LoginScreen.js          (Premium login page)
│   └── HomeScreen.js           (Updated with logout & user info)
└── App.js                      (Updated with auth integration)
```

## Security Considerations

### For Production:
1. **Backend Verification**: Always verify JWT tokens on your backend
2. **Secure Storage**: Consider using Secure Store instead of AsyncStorage for sensitive data
3. **Token Refresh**: Implement token refresh logic
4. **HTTPS Only**: Ensure all OAuth communication uses HTTPS
5. **Environment Variables**: Store Client ID in .env file, not in code

### Current Setup:
- User data stored in AsyncStorage (suitable for demo/testing)
- Mock user data for demo login
- JWT token validation (basic parsing only)

## Testing

### Test Demo Login
1. Open the app
2. Click "Try Demo" button
3. App should navigate to main screens
4. User name appears in HomeScreen header
5. Click logout button to return to login

### Test Persistence
1. Login with demo
2. Close and reopen app
3. Should remain logged in
4. Check AsyncStorage in DevTools to see stored data

## Next Steps

1. **Backend Integration**: Create API endpoints for:
   - Google OAuth token verification
   - User registration/login
   - User data persistence

2. **Enhanced Features**:
   - Profile picture in header/menu
   - User settings page
   - Account management

3. **Security Hardening**:
   - Implement secure token storage
   - Add biometric login option
   - Session timeout management

## Troubleshooting

### Google Sign-in Not Working
- Verify Client ID is correct
- Check redirect URL is configured in Google Cloud Console
- Ensure expo-web-browser is installed

### User Data Not Persisting
- Check AsyncStorage permissions
- Verify AuthContext is wrapping entire app
- Check browser console for storage errors

### Login State Not Restored
- Clear app cache/storage
- Verify useAuth is called in correct component
- Check console for AuthContext initialization errors
