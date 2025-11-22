# Architecture

## Overview

AARNote is a React Native note-taking application built with Expo, featuring a modern, premium dark theme UI with glassmorphism effects. The application follows a file-based routing pattern using Expo Router and implements local-first data persistence.

## Tech Stack

- **Framework**: React Native (0.81.5) with Expo (~54.0)
- **Navigation**: Expo Router (~6.0) - File-based routing
- **State Management**: Zustand (^5.0.8) - Lightweight state management
- **Storage**: react-native-mmkv (^4.0.1) - High-performance key-value storage
- **Animations**: react-native-reanimated (~4.1.1) - Smooth 60fps animations
- **UI Effects**: expo-blur (~15.0.7) - Glassmorphism effects
- **Security**: expo-crypto (~15.0.7) - Password hashing

## Project Structure

\`\`\`
aarnote/
├── app/ # Expo Router app directory
│ ├── (app)/ # Authenticated app routes
│ │ ├── index.tsx # Home screen (notes list)
│ │ ├── create-note.tsx # Create new note
│ │ ├── note/
│ │ │ └── [id].tsx # Note detail/edit screen
│ │ └── \_layout.tsx # App layout with auth guard
│ ├── (auth)/ # Authentication routes
│ │ ├── sign-in.tsx # Sign in screen
│ │ ├── sign-up.tsx # Sign up screen
│ │ └── \_layout.tsx # Auth layout
│ └── \_layout.tsx # Root layout
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Button.tsx # Premium button component
│ │ ├── GlassView.tsx # Glassmorphism container
│ │ ├── Input.tsx # Styled text input
│ │ └── ThemedText.tsx # Typography component
│ ├── constants/ # App constants
│ │ ├── Colors.ts # Color palette
│ │ └── Layout.ts # Spacing, sizes, radii
│ ├── store/ # Zustand stores
│ │ ├── authStore.ts # Authentication state
│ │ └── notesStore.ts # Notes management
│ └── types/ # TypeScript types
│ ├── note.ts # Note type definitions
│ └── user.ts # User type definitions
├── assets/ # Static assets
│ └── images/ # App icons and images
└── docs/ # Documentation
\`\`\`

## Design Patterns

### 1. File-Based Routing

Expo Router provides automatic routing based on file structure:

- `(app)` and `(auth)` are route groups (parentheses hide them from URL)
- `_layout.tsx` files define nested layouts
- `[id].tsx` creates dynamic routes

### 2. Compound Component Pattern

Components like `GlassView` and `ThemedText` wrap native components with consistent styling:
\`\`\`tsx
<GlassView intensity={80} tint="dark">
<ThemedText type="largeTitle">My Notes</ThemedText>
</GlassView>
\`\`\`

### 3. Container/Presentational Pattern

Screens handle data fetching and business logic, while components focus on presentation.

### 4. Custom Hooks Pattern

Zustand stores expose custom hooks for state management:
\`\`\`tsx
const { notes, loadNotes } = useNotesStore();
const { session, signIn } = useAuthStore();
\`\`\`

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ App Layer │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Screens │ │ Components │ │ Layouts │ │
│ │ (Routes) │ │ (UI Kit) │ │ (Structure) │ │
│ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
│ │ │ │ │
└─────────┼──────────────────┼──────────────────┼──────────────┘
│ │ │
┌─────────┼──────────────────┼──────────────────┼──────────────┐
│ ▼ ▼ ▼ │
│ State Layer │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Zustand Stores │ │
│ │ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │ authStore │ │ notesStore │ │ │
│ │ │ - session │ │ - notes[] │ │ │
│ │ │ - signIn() │ │ - create() │ │ │
│ │ │ - signOut() │ │ - update() │ │ │
│ │ └──────┬───────┘ └──────┬───────┘ │ │
│ └─────────┼────────────────────────┼──────────────────┘ │
└────────────┼────────────────────────┼──────────────────────┘
│ │
┌────────────┼────────────────────────┼──────────────────────┐
│ ▼ ▼ │
│ Persistence Layer │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ MMKV Storage │ │
│ │ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │ users │ │ notes │ │ │
│ │ │ (hashed) │ │ (per user) │ │ │
│ │ └──────────────┘ └──────────────┘ │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Architectural Decisions

### 1. Local-First Architecture

**Decision**: Use MMKV for local storage instead of a backend API.

**Rationale**:

- Instant data access (no network latency)
- Works offline by default
- Simpler architecture for MVP
- High performance (MMKV is faster than AsyncStorage)

**Trade-offs**:

- No cross-device sync
- Data limited to device
- No cloud backup

### 2. Zustand for State Management

**Decision**: Use Zustand instead of Redux or Context API.

**Rationale**:

- Minimal boilerplate
- TypeScript-first design
- No providers needed
- Easy to integrate with MMKV persistence

**Trade-offs**:

- Less ecosystem/middleware compared to Redux
- Simpler devtools

### 3. Expo Router for Navigation

**Decision**: Use Expo Router instead of React Navigation directly.

**Rationale**:

- File-based routing (familiar to web developers)
- Automatic deep linking
- Type-safe navigation
- Built-in layouts and route groups

**Trade-offs**:

- Newer library (less mature)
- Opinionated structure

### 4. Glassmorphism UI Design

**Decision**: Implement premium dark theme with glassmorphism effects.

**Rationale**:

- Modern, premium aesthetic
- OLED-friendly (pure black backgrounds)
- Consistent design system
- Smooth animations enhance UX

**Trade-offs**:

- BlurView performance on Android
- More complex styling

## Security Considerations

1. **Password Hashing**: Uses SHA-256 via expo-crypto
2. **Local Storage**: MMKV stores data encrypted on iOS
3. **Session Management**: In-memory session with persistent username
4. **Input Validation**: Client-side validation for all user inputs

## Performance Optimizations

1. **Reanimated**: 60fps animations running on UI thread
2. **MMKV**: Fast synchronous storage
3. **Memoization**: React.memo for expensive components
4. **Lazy Loading**: Dynamic imports for routes
5. **Image Optimization**: Compressed images with quality settings

## Scalability Considerations

### Current Limitations

- Single-device storage
- No pagination (all notes loaded at once)
- No search functionality
- No note categories/tags

### Future Enhancements

- Backend API integration
- Cloud sync
- Search and filtering
- Rich text editing
- Note sharing
- Attachments support
