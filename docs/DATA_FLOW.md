# Data Flow

This document describes how data flows through the AARNote application for various user actions.

## Authentication Flow

### Sign Up Sequence

\`\`\`mermaid
sequenceDiagram
actor User
participant SignUpScreen
participant authStore
participant MMKV
participant crypto

    User->>SignUpScreen: Enter credentials
    SignUpScreen->>SignUpScreen: Validate input
    SignUpScreen->>authStore: signUp(username, password)
    authStore->>MMKV: Check if username exists
    alt Username exists
        MMKV-->>authStore: User found
        authStore-->>SignUpScreen: Error: Username taken
        SignUpScreen-->>User: Show error message
    else Username available
        authStore->>crypto: digest(password)
        crypto-->>authStore: hashedPassword
        authStore->>MMKV: Save user data
        authStore->>authStore: Set session
        authStore-->>SignUpScreen: Success
        SignUpScreen-->>User: Navigate to app
    end

\`\`\`

### Sign In Sequence

\`\`\`mermaid
sequenceDiagram
actor User
participant SignInScreen
participant authStore
participant MMKV
participant crypto

    User->>SignInScreen: Enter credentials
    SignInScreen->>authStore: signIn(username, password)
    authStore->>MMKV: Get user by username
    alt User not found
        MMKV-->>authStore: null
        authStore-->>SignInScreen: Error: Invalid credentials
        SignInScreen-->>User: Show error
    else User found
        MMKV-->>authStore: User data
        authStore->>crypto: digest(password)
        crypto-->>authStore: hashedPassword
        authStore->>authStore: Compare hashes
        alt Password match
            authStore->>authStore: Set session
            authStore->>MMKV: Save session
            authStore-->>SignInScreen: Success
            SignInScreen-->>User: Navigate to app
        else Password mismatch
            authStore-->>SignInScreen: Error: Invalid credentials
            SignInScreen-->>User: Show error
        end
    end

\`\`\`

### Session Initialization

\`\`\`mermaid
sequenceDiagram
participant App
participant authStore
participant MMKV
participant Router

    App->>authStore: initializeSession()
    authStore->>MMKV: Get saved session
    alt Session exists
        MMKV-->>authStore: username
        authStore->>authStore: Set session state
        authStore-->>App: Session restored
        App->>Router: Navigate to /(app)
    else No session
        MMKV-->>authStore: null
        authStore-->>App: No session
        App->>Router: Navigate to /(auth)
    end

\`\`\`

## Notes Management Flow

### Create Note Sequence

\`\`\`mermaid
sequenceDiagram
actor User
participant CreateNoteScreen
participant ImagePicker
participant notesStore
participant MMKV
participant Router

    User->>CreateNoteScreen: Enter title & content
    opt Add image
        User->>CreateNoteScreen: Tap add image
        CreateNoteScreen->>ImagePicker: Request image
        ImagePicker-->>CreateNoteScreen: Image URI
    end
    User->>CreateNoteScreen: Tap save
    CreateNoteScreen->>CreateNoteScreen: Validate input
    CreateNoteScreen->>notesStore: createNote(session, data)
    notesStore->>notesStore: Generate UUID
    notesStore->>notesStore: Create note object
    notesStore->>MMKV: Get existing notes
    MMKV-->>notesStore: notes[]
    notesStore->>notesStore: Add new note
    notesStore->>MMKV: Save updated notes
    notesStore->>notesStore: Update state
    notesStore-->>CreateNoteScreen: Success
    CreateNoteScreen->>Router: Navigate back
    Router->>notesStore: loadNotes()
    notesStore->>MMKV: Get notes
    MMKV-->>notesStore: notes[]
    notesStore->>notesStore: Update state

\`\`\`

### Update Note Sequence

\`\`\`mermaid
sequenceDiagram
actor User
participant NoteDetailScreen
participant notesStore
participant MMKV

    User->>NoteDetailScreen: View note
    NoteDetailScreen->>notesStore: Get note by ID
    notesStore-->>NoteDetailScreen: Note data
    User->>NoteDetailScreen: Tap edit
    NoteDetailScreen->>NoteDetailScreen: Enable editing
    User->>NoteDetailScreen: Modify content
    User->>NoteDetailScreen: Tap save
    NoteDetailScreen->>notesStore: updateNote(data)
    notesStore->>MMKV: Get all notes
    MMKV-->>notesStore: notes[]
    notesStore->>notesStore: Find & update note
    notesStore->>notesStore: Update timestamp
    notesStore->>MMKV: Save updated notes
    notesStore->>notesStore: Update state
    notesStore-->>NoteDetailScreen: Success
    NoteDetailScreen->>NoteDetailScreen: Disable editing

\`\`\`

### Delete Note Sequence

\`\`\`mermaid
sequenceDiagram
actor User
participant NoteDetailScreen
participant Alert
participant notesStore
participant MMKV
participant Router

    User->>NoteDetailScreen: Tap delete
    NoteDetailScreen->>Alert: Show confirmation
    User->>Alert: Confirm delete
    Alert->>notesStore: deleteNote(id)
    notesStore->>MMKV: Get all notes
    MMKV-->>notesStore: notes[]
    notesStore->>notesStore: Filter out note
    notesStore->>MMKV: Save updated notes
    notesStore->>notesStore: Update state
    notesStore-->>NoteDetailScreen: Success
    NoteDetailScreen->>Router: Navigate back

\`\`\`

### Load Notes Sequence

\`\`\`mermaid
sequenceDiagram
participant HomeScreen
participant notesStore
participant MMKV

    HomeScreen->>notesStore: loadNotes(session)
    notesStore->>MMKV: Get notes for user
    MMKV-->>notesStore: notes[] or null
    alt Notes exist
        notesStore->>notesStore: Parse JSON
        notesStore->>notesStore: Sort by sortBy
        notesStore->>notesStore: Update state
    else No notes
        notesStore->>notesStore: Set empty array
    end
    notesStore-->>HomeScreen: Notes loaded
    HomeScreen->>HomeScreen: Render notes list

\`\`\`

## State Updates

### Zustand State Flow

\`\`\`
┌─────────────┐
│ Action │ (User interaction)
└──────┬──────┘
│
▼
┌─────────────┐
│ Store │ (Zustand)
│ Method │ - Updates state
└──────┬──────┘ - Persists to MMKV
│
▼
┌─────────────┐
│ MMKV │ (Persistence)
│ Storage │
└──────┬──────┘
│
▼
┌─────────────┐
│ State │ (Zustand notifies)
│ Update │
└──────┬──────┘
│
▼
┌─────────────┐
│ UI │ (React re-renders)
│ Re-render │
└─────────────┘
\`\`\`

## Data Persistence

### MMKV Storage Keys

\`\`\`typescript
// Authentication
'users' // JSON: User[]
'currentSession' // string: username

// Notes (per user)
'notes\_${username}' // JSON: Note[]
\`\`\`

### Data Structures

#### User Object

\`\`\`typescript
{
username: string;
passwordHash: string; // SHA-256 hash
createdAt: string; // ISO 8601 timestamp
}
\`\`\`

#### Note Object

\`\`\`typescript
{
id: string; // UUID v4
title: string;
content: string;
imageUri?: string; // Optional image path
createdAt: string; // ISO 8601 timestamp
updatedAt: string; // ISO 8601 timestamp
}
\`\`\`

## Error Handling Flow

\`\`\`mermaid
sequenceDiagram
participant Component
participant Store
participant MMKV
participant User

    Component->>Store: Call action
    Store->>Store: Try operation
    alt Success
        Store->>MMKV: Persist data
        MMKV-->>Store: Success
        Store-->>Component: Return success
        Component-->>User: Show success feedback
    else Error
        Store-->>Component: Return error
        Component->>Component: Log error
        Component-->>User: Show user-friendly message
    end

\`\`\`

## Navigation Flow

\`\`\`
App Start
│
▼
Initialize Session
│
├─── Session exists ──────► /(app)/index
│ │
│ ├─► Create Note ──► /(app)/create-note
│ │
│ └─► View Note ────► /(app)/note/[id]
│
└─── No session ─────────► /(auth)/sign-in
│
└─► Sign Up ───────► /(auth)/sign-up
\`\`\`

## Image Handling Flow

\`\`\`mermaid
sequenceDiagram
actor User
participant Screen
participant ImagePicker
participant Permissions
participant FileSystem

    User->>Screen: Tap add image
    Screen->>Screen: Show options (Camera/Gallery)
    User->>Screen: Select option
    Screen->>Permissions: Request permission
    alt Permission granted
        Permissions-->>Screen: Granted
        Screen->>ImagePicker: Launch picker
        User->>ImagePicker: Select/capture image
        ImagePicker->>ImagePicker: Compress (quality: 0.8)
        ImagePicker->>FileSystem: Save to cache
        FileSystem-->>ImagePicker: File URI
        ImagePicker-->>Screen: Image URI
        Screen->>Screen: Display preview
    else Permission denied
        Permissions-->>Screen: Denied
        Screen-->>User: Show permission error
    end

\`\`\`

## Sorting Flow

\`\`\`mermaid
sequenceDiagram
actor User
participant HomeScreen
participant notesStore

    User->>HomeScreen: Select sort option
    HomeScreen->>notesStore: setSortBy(option)
    notesStore->>notesStore: Update sortBy state
    notesStore->>notesStore: Re-sort notes array
    alt Sort by Last Update
        notesStore->>notesStore: Sort by updatedAt DESC
    else Sort by Title
        notesStore->>notesStore: Sort by title ASC
    end
    notesStore-->>HomeScreen: State updated
    HomeScreen->>HomeScreen: Re-render with sorted notes

\`\`\`

## Performance Considerations

1. **Synchronous Storage**: MMKV operations are synchronous, avoiding async complexity
2. **In-Memory State**: Zustand keeps data in memory for instant access
3. **Selective Updates**: Only modified notes trigger re-renders
4. **Lazy Loading**: Routes are loaded on-demand
5. **Image Caching**: ImagePicker caches compressed images

## Data Validation

### Input Validation Points

1. **Sign Up**:
   - Username: Non-empty, unique
   - Password: Non-empty, matches confirmation

2. **Sign In**:
   - Username: Non-empty
   - Password: Non-empty

3. **Create/Update Note**:
   - Title: Non-empty after trim
   - Content: Non-empty after trim
   - Image: Valid URI (optional)

### Error Messages

All error messages are user-friendly and actionable:

- ❌ "Username already exists" → Try different username
- ❌ "Invalid credentials" → Check username/password
- ❌ "Please enter a title" → Fill required field
- ❌ "Permission denied" → Enable in settings
