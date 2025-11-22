# Authentication System

## Overview

This app implements a multi-user authentication system with persistent storage using MMKV and password hashing.

## Features

- **Sign Up**: Create a new account with username and password
- **Sign In**: Log in with existing credentials
- **Persistent Sessions**: Sessions are stored locally and persist across app restarts
- **Password Security**: Passwords are hashed using SHA-256 before storage
- **Unique Usernames**: Each username must be unique
- **Form Validation**:
  - Username: minimum 3 characters
  - Password: minimum 6 characters
- **Error Handling**: Clear error messages for validation and authentication failures

## Technical Stack

- **State Management**: Zustand
- **Storage**: react-native-mmkv (fast, synchronous key-value storage)
- **Password Hashing**: expo-crypto (SHA-256)
- **Navigation**: expo-router with protected routes

## File Structure

```
src/
├── services/
│   ├── storage.ts          # MMKV storage instance
│   └── authService.ts      # Authentication logic
├── store/
│   └── authStore.ts        # Zustand auth state
├── types/
│   └── auth.ts             # TypeScript types
└── utils/
    └── crypto.ts           # Password hashing utilities
```

## How It Works

### Sign Up Flow

1. User enters username and password
2. Validation checks are performed
3. Username uniqueness is verified
4. Password is hashed using SHA-256
5. User data is stored in MMKV
6. Session is created and user is redirected to home

### Sign In Flow

1. User enters credentials
2. Username is looked up in storage
3. Password is hashed and compared with stored hash
4. If valid, session is created and user is redirected to home

### Session Persistence

- On app launch, the current user is loaded from MMKV
- If a valid session exists, user is automatically logged in
- Sessions persist until explicit sign out

## Storage Format

Users are stored as a JSON array in MMKV:

```json
[
  {
    "username": "john",
    "passwordHash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "createdAt": 1700000000000
  }
]
```

## Security Notes

- Passwords are hashed using SHA-256 (not suitable for production - use bcrypt/argon2)
- This is a local-only authentication system (no backend)
- Data is stored unencrypted on device (MMKV supports encryption if needed)
