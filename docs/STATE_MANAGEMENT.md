# State Management

This document explains how state is managed in AARNote using Zustand.

## Overview

AARNote uses [Zustand](https://github.com/pmndrs/zustand) for state management, a lightweight alternative to Redux that provides:

- Minimal boilerplate
- TypeScript-first design
- No providers needed
- Easy persistence integration

## Store Architecture

```
┌──────────────────────────────────────┐
│           Application State           │
├──────────────────────────────────────┤
│                                       │
│  ┌────────────┐    ┌──────────────┐ │
│  │ authStore  │    │ notesStore   │ │
│  │            │    │              │ │
│  │ - session  │    │ - notes[]    │ │
│  │ - loading  │    │ - sortBy     │ │
│  │ - error    │    │ - methods    │ │
│  │ - methods  │    │              │ │
│  └─────┬──────┘    └──────┬───────┘ │
│        │                  │          │
│        ▼                  ▼          │
│  ┌──────────────────────────────┐   │
│  │         MMKV Storage         │   │
│  │  - users                     │   │
│  │  - currentSession            │   │
│  │  - notes_${username}         │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

## Auth Store

### State Shape

```typescript
interface AuthState {
  session: string | null; // Current username
  isLoading: boolean; // Loading state
  error: string | null; // Error message

  // Actions
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  initializeSession: () => void;
  clearError: () => void;
}
```

### Usage

```tsx
import { useAuthStore } from '@/store/authStore';

function SignInScreen() {
  const { signIn, isLoading, error } = useAuthStore();

  const handleSignIn = async () => {
    const success = await signIn(username, password);
    if (success) {
      // Navigation handled by layout
    }
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      <Button onPress={handleSignIn} disabled={isLoading} />
    </View>
  );
}
```

### Methods

#### `signIn(username, password)`

1. Validates input
2. Retrieves user from MMKV
3. Hashes password and compares
4. Sets session if successful
5. Persists session to MMKV
6. Returns boolean success

#### `signUp(username, password)`

1. Validates input
2. Checks if username exists
3. Hashes password
4. Creates user object
5. Saves to MMKV
6. Sets session
7. Returns boolean success

#### `signOut()`

1. Clears session state
2. Removes session from MMKV
3. Triggers navigation to auth

#### `initializeSession()`

1. Reads session from MMKV
2. Sets session state if found
3. Called on app start

---

## Notes Store

### State Shape

```typescript
interface NotesState {
  notes: Note[];
  sortBy: 'lastUpdate' | 'title';

  // Actions
  loadNotes: (username: string) => void;
  createNote: (username: string, data: CreateNoteData) => void;
  updateNote: (data: UpdateNoteData) => boolean;
  deleteNote: (id: string) => boolean;
  setSortBy: (sortBy: 'lastUpdate' | 'title') => void;
}
```

### Usage

```tsx
import { useNotesStore } from '@/store/notesStore';

function HomeScreen() {
  const { notes, loadNotes, sortBy, setSortBy } = useNotesStore();
  const { session } = useAuthStore();

  useEffect(() => {
    if (session) {
      loadNotes(session);
    }
  }, [session]);

  return <FlatList data={notes} renderItem={renderNote} />;
}
```

### Methods

#### `loadNotes(username)`

1. Reads notes from MMKV for user
2. Parses JSON
3. Sorts based on `sortBy`
4. Updates state

#### `createNote(username, data)`

1. Generates UUID for note
2. Creates note object with timestamps
3. Loads existing notes
4. Appends new note
5. Saves to MMKV
6. Updates state

#### `updateNote(data)`

1. Loads all notes
2. Finds note by ID
3. Updates fields
4. Updates `updatedAt` timestamp
5. Saves to MMKV
6. Updates state
7. Returns boolean success

#### `deleteNote(id)`

1. Loads all notes
2. Filters out note with ID
3. Saves to MMKV
4. Updates state
5. Returns boolean success

#### `setSortBy(sortBy)`

1. Updates `sortBy` state
2. Re-sorts notes array
3. Triggers re-render

---

## Persistence Strategy

### MMKV Integration

Zustand doesn't have built-in MMKV persistence, so we handle it manually:

```typescript
// In store methods
const saveToMMKV = (key: string, data: any) => {
  storage.set(key, JSON.stringify(data));
};

const loadFromMMKV = (key: string) => {
  const data = storage.getString(key);
  return data ? JSON.parse(data) : null;
};
```

### Storage Keys

```typescript
const STORAGE_KEYS = {
  USERS: 'users',
  SESSION: 'currentSession',
  NOTES: (username: string) => `notes_${username}`,
};
```

### Data Flow

```
User Action
    ↓
Store Method
    ↓
Update State (Zustand)
    ↓
Persist to MMKV
    ↓
UI Re-render
```

---

## Selectors

### Basic Selector

```tsx
// Get specific state
const session = useAuthStore((state) => state.session);
const notes = useNotesStore((state) => state.notes);
```

### Multiple Values

```tsx
// Get multiple values
const { session, isLoading } = useAuthStore();
const { notes, sortBy } = useNotesStore();
```

### Computed Values

```tsx
// Derive values
const noteCount = useNotesStore((state) => state.notes.length);
const hasNotes = useNotesStore((state) => state.notes.length > 0);
```

---

## Best Practices

### 1. Keep Stores Focused

Each store handles a specific domain:

- `authStore`: Authentication only
- `notesStore`: Notes management only

### 2. Avoid Nested State

Keep state flat for easier updates:

```typescript
// ❌ Bad
{ user: { profile: { name: 'John' } } }

// ✅ Good
{ username: 'John', email: 'john@example.com' }
```

### 3. Use Actions for Updates

Never mutate state directly:

```typescript
// ❌ Bad
useNotesStore.setState({ notes: [...notes, newNote] });

// ✅ Good
createNote(username, noteData);
```

### 4. Handle Errors Gracefully

Always provide user-friendly error messages:

```typescript
try {
  // Operation
} catch (error) {
  set({ error: 'Failed to save note. Please try again.' });
}
```

### 5. Validate Input

Validate before persisting:

```typescript
if (!title.trim()) {
  set({ error: 'Title is required' });
  return false;
}
```

---

## Performance Optimization

### 1. Selective Subscriptions

Only subscribe to needed state:

```tsx
// ❌ Subscribes to all state changes
const store = useNotesStore();

// ✅ Only subscribes to notes changes
const notes = useNotesStore((state) => state.notes);
```

### 2. Memoization

Use React.memo for expensive components:

```tsx
const NoteCard = React.memo(({ note }) => {
  return <View>...</View>;
});
```

### 3. Batch Updates

Update multiple state values together:

```typescript
set({
  notes: updatedNotes,
  sortBy: newSortBy,
});
```

---

## Testing Stores

### Unit Testing

```typescript
import { useNotesStore } from '@/store/notesStore';

describe('notesStore', () => {
  it('should create a note', () => {
    const { createNote, notes } = useNotesStore.getState();

    createNote('testuser', {
      title: 'Test Note',
      content: 'Content',
    });

    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Test Note');
  });
});
```

### Integration Testing

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotesStore } from '@/store/notesStore';

test('should load and sort notes', () => {
  const { result } = renderHook(() => useNotesStore());

  act(() => {
    result.current.loadNotes('testuser');
  });

  expect(result.current.notes).toBeDefined();
});
```

---

## Debugging

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    { name: 'NotesStore' },
  ),
);
```

### Logging

```typescript
const createNote = (username: string, data: CreateNoteData) => {
  console.log('[NotesStore] Creating note:', data);

  try {
    // ... implementation
    console.log('[NotesStore] Note created successfully');
  } catch (error) {
    console.error('[NotesStore] Failed to create note:', error);
  }
};
```

---

## Migration Guide

### From Redux

```typescript
// Redux
const mapStateToProps = (state) => ({
  notes: state.notes.items,
});

// Zustand
const notes = useNotesStore((state) => state.notes);
```

### From Context API

```typescript
// Context
const { notes } = useContext(NotesContext);

// Zustand
const notes = useNotesStore((state) => state.notes);
```

---

## Future Enhancements

1. **Middleware**: Add logging, persistence middleware
2. **Computed Values**: Add derived state
3. **Optimistic Updates**: Update UI before API response
4. **Undo/Redo**: Implement history tracking
5. **Real-time Sync**: WebSocket integration
