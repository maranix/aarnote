# Notes Feature Implementation

## Overview

This implementation adds a complete notes feature to the AarNote app with the following capabilities:

- Create, read, update, and delete notes
- Attach images via camera or gallery
- User-specific note storage
- Sorting by last update or title
- Persistent storage using MMKV

## Features Implemented

### 1. Data Models (`src/types/note.ts`)

- **Note**: Core note interface with id, userId, title, content, imageUri, createdAt, updatedAt
- **CreateNoteInput**: Input for creating new notes
- **UpdateNoteInput**: Input for updating existing notes
- **SortOption**: Type for sorting options ('lastUpdate' | 'title')

### 2. Notes Service (`src/services/notesService.ts`)

Handles all note-related business logic:

- `getUserNotes(userId)`: Get all notes for a specific user
- `createNote(userId, input)`: Create a new note
- `updateNote(input)`: Update an existing note
- `deleteNote(noteId)`: Delete a note
- `getNoteById(noteId)`: Get a single note
- `sortNotes(notes, sortBy)`: Sort notes by specified option
- `clearUserNotes(userId)`: Clear all notes for a user

**Key Features:**

- User-specific filtering (notes are isolated per user)
- Persistent storage using MMKV
- Automatic timestamp management
- Unique ID generation per note

### 3. Notes Store (`src/store/notesStore.ts`)

Zustand store for state management:

- `notes`: Array of current user's notes
- `sortBy`: Current sort option
- `isLoading`: Loading state
- `error`: Error messages
- Actions: loadNotes, createNote, updateNote, deleteNote, setSortBy, clearNotes

### 4. UI Screens

#### Home Screen (`app/(app)/index.tsx`)

- Displays list of notes with images
- Sort controls (Last Update / Title)
- Long press to delete notes
- Tap to view/edit notes
- Floating action button to create new notes
- Empty state when no notes exist

#### Create Note Screen (`app/(app)/create-note.tsx`)

- Title and content input fields
- Image picker with options:
  - Take photo with camera
  - Choose from gallery
- Image preview with remove option
- Validation for required fields
- Save functionality

#### Note Detail/Edit Screen (`app/(app)/note/[id].tsx`)

- View mode: Display note with metadata (created/updated timestamps)
- Edit mode: Modify title, content, and image
- Delete functionality with confirmation
- Toggle between view and edit modes

## Image Handling

### Permissions

Added to `app.json`:

- Camera permission
- Photo library permission

### Features

- Camera capture with editing
- Gallery image selection
- Image preview
- Image removal
- Aspect ratio: 16:9
- Quality: 0.8 (optimized for storage)

## Data Persistence

### Storage Structure

All notes are stored in MMKV under the key `notes` as a JSON array:

```json
[
  {
    "id": "user1_1234567890_abc123",
    "userId": "user1",
    "title": "My Note",
    "content": "Note content here",
    "imageUri": "file:///path/to/image.jpg",
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
]
```

### User Isolation

- Notes are filtered by `userId` field
- Each user only sees their own notes
- Switching users automatically loads that user's notes
- No cross-user data leakage

## Sorting

### Sort Options

1. **Last Update** (default): Sorts by `updatedAt` timestamp (newest first)
2. **Title**: Alphabetical sorting by title (A-Z)

### Implementation

- Sort state persists during session
- Re-sorts automatically when notes are added/updated
- Toggle buttons in UI for easy switching

## Dependencies Added

- `expo-image-picker`: For selecting images from gallery
- `expo-camera`: For camera permissions and functionality

## Usage Flow

1. **Creating a Note:**
   - Tap the + button
   - Enter title and content
   - Optionally add an image (camera or gallery)
   - Tap Save

2. **Viewing a Note:**
   - Tap any note card from the list
   - View full content with metadata

3. **Editing a Note:**
   - Open a note
   - Tap Edit button
   - Modify fields
   - Tap Save

4. **Deleting a Note:**
   - Long press on note card in list, OR
   - Open note and tap Delete button
   - Confirm deletion

5. **Sorting Notes:**
   - Use sort buttons at top of list
   - Choose between Last Update or Title

## Technical Notes

- All timestamps are stored as Unix timestamps (milliseconds)
- Image URIs are stored as local file paths
- Notes are loaded on app start if user is authenticated
- Store is cleared on sign out
- Type-safe implementation with TypeScript
- Error handling for all operations
- Validation for required fields

## Future Enhancements (Not Implemented)

- Rich text editing
- Multiple images per note
- Categories/tags
- Search functionality
- Cloud sync
- Note sharing
- Markdown support
