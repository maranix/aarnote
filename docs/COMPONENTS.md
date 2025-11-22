# Components Library

This document describes all reusable UI components in AARNote.

## Design System Components

### GlassView

A container component that applies glassmorphism effects using blur.

**Props:**

```typescript
interface GlassViewProps extends ViewProps {
  intensity?: number; // Blur intensity (default: 20)
  tint?: 'light' | 'dark' | 'default'; // Blur tint (default: 'dark')
}
```

**Usage:**

```tsx
<GlassView intensity={80} tint="dark" style={styles.header}>
  <Text>Content with glassmorphism effect</Text>
</GlassView>
```

**Platform Differences:**

- **iOS/Web**: Uses `expo-blur` for native blur
- **Android**: Falls back to semi-transparent background (BlurView support varies)

**Styling:**

- Automatically applies border and background from `Colors.dark.glass`
- Respects all standard `View` props

---

### ThemedText

Typography component with predefined text styles.

**Props:**

```typescript
interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'largeTitle' | 'caption';
}
```

**Text Types:**

| Type              | Font Size | Weight   | Use Case               |
| ----------------- | --------- | -------- | ---------------------- |
| `largeTitle`      | 34px      | Bold     | Screen titles          |
| `title`           | 28px      | Bold     | Section headers        |
| `subtitle`        | 20px      | Semibold | Subsections            |
| `defaultSemiBold` | 16px      | Semibold | Emphasized text        |
| `default`         | 16px      | Normal   | Body text              |
| `link`            | 16px      | Normal   | Clickable links (blue) |
| `caption`         | 12px      | Normal   | Small text, metadata   |

**Usage:**

```tsx
<ThemedText type="largeTitle">My Notes</ThemedText>
<ThemedText type="subtitle">Create a new note</ThemedText>
<ThemedText>Regular body text</ThemedText>
```

**Styling:**

- Uses `Colors.dark.text` by default
- `link` type uses `Colors.dark.primary`
- Supports all standard `Text` props

---

### Button

Premium button component with animations and variants.

**Props:**

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}
```

**Variants:**

| Variant     | Background    | Text Color | Border  | Use Case          |
| ----------- | ------------- | ---------- | ------- | ----------------- |
| `primary`   | Primary color | White      | None    | Main actions      |
| `secondary` | Surface       | Text       | None    | Secondary actions |
| `outline`   | Transparent   | Primary    | Primary | Tertiary actions  |
| `ghost`     | Transparent   | Text       | None    | Minimal actions   |

**Sizes:**

| Size | Height | Padding | Font Size |
| ---- | ------ | ------- | --------- |
| `sm` | 36px   | 12px    | 14px      |
| `md` | 48px   | 16px    | 16px      |
| `lg` | 56px   | 20px    | 18px      |

**Usage:**

```tsx
<Button
  title="Sign In"
  onPress={handleSignIn}
  variant="primary"
  size="lg"
/>

<Button
  title="Cancel"
  onPress={handleCancel}
  variant="ghost"
  size="sm"
/>
```

**Features:**

- Press animation using `react-native-reanimated`
- Disabled state with reduced opacity
- Loading state (future enhancement)
- Icon support (future enhancement)

---

### Input

Styled text input with focus animations and error states.

**Props:**

```typescript
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}
```

**Usage:**

```tsx
<Input
  label="Username"
  value={username}
  onChangeText={setUsername}
  placeholder="Enter username"
  error={usernameError}
/>

<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
/>
```

**Features:**

- Animated border color on focus (using Reanimated)
- Error state with red border and message
- Consistent styling with design system
- Supports all `TextInput` props

**States:**

- **Default**: Gray border
- **Focused**: Primary color border
- **Error**: Red border with error message below

---

## Constants

### Colors

Centralized color palette for the app.

**Structure:**

```typescript
export const Colors = {
  dark: {
    // Base colors
    text: '#ECEDEE',
    background: '#000000',

    // Surface colors
    surface: '#1C1C1E',
    surfaceHighlight: '#2C2C2E',

    // Semantic colors
    primary: '#0A84FF',
    error: '#FF453A',
    success: '#32D74B',

    // UI colors
    border: 'rgba(255, 255, 255, 0.1)',
    icon: '#8E8E93',
    textSecondary: 'rgba(235, 235, 245, 0.6)',

    // Glassmorphism
    glass: 'rgba(28, 28, 30, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
  },
};
```

**Usage:**

```tsx
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
  },
  text: {
    color: Colors.dark.text,
  },
});
```

---

### Layout

Spacing, sizing, and border radius constants.

**Structure:**

```typescript
export const Layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 34,
  },
};
```

**Usage:**

```tsx
import { Layout } from '@/constants/Layout';

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
  },
  title: {
    fontSize: Layout.fontSize.xxl,
    marginBottom: Layout.spacing.md,
  },
});
```

---

## Component Patterns

### Composition Pattern

Components are designed to be composable:

```tsx
<GlassView style={styles.card}>
  <ThemedText type="title">Note Title</ThemedText>
  <ThemedText type="caption">Last updated 2 hours ago</ThemedText>
  <Button title="Edit" onPress={handleEdit} variant="outline" />
</GlassView>
```

### Prop Spreading

All components accept and spread additional props:

```tsx
<ThemedText type="title" numberOfLines={1} ellipsizeMode="tail">
  Long title that will be truncated
</ThemedText>
```

### Style Merging

Custom styles are merged with component defaults:

```tsx
<GlassView style={[styles.header, { paddingTop: insets.top }]}>{/* Content */}</GlassView>
```

---

## Accessibility

### Screen Reader Support

All components support accessibility props:

```tsx
<Button
  title="Delete Note"
  onPress={handleDelete}
  accessibilityLabel="Delete this note"
  accessibilityHint="This action cannot be undone"
/>
```

### Touch Targets

All interactive components meet minimum touch target size (44x44):

- Buttons: 48px minimum height
- Touch areas: Padding added where needed

---

## Animation Guidelines

### Reanimated Usage

Components use `react-native-reanimated` for smooth animations:

```tsx
// Button press animation
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

### Animation Timing

- **Entry animations**: 300-500ms with spring
- **Press feedback**: 100ms
- **State transitions**: 200ms

---

## Theming

### Current Theme

The app currently uses a single dark theme. All components reference `Colors.dark`.

### Future: Multiple Themes

To add light theme support:

1. Add `Colors.light` to `Colors.ts`
2. Create theme context
3. Update components to use theme context
4. Add theme toggle

---

## Component Checklist

When creating new components:

- [ ] TypeScript props interface
- [ ] Prop spreading for flexibility
- [ ] Style merging support
- [ ] Accessibility props
- [ ] Documentation with examples
- [ ] Consistent with design system
- [ ] Reanimated for animations
- [ ] Platform-specific handling if needed

---

## Future Components

Planned components for future development:

1. **Card** - Reusable card container
2. **Badge** - Small status indicators
3. **Avatar** - User profile images
4. **Chip** - Tag/category chips
5. **Modal** - Bottom sheet modals
6. **Toast** - Notification toasts
7. **SearchBar** - Search input with icon
8. **EmptyState** - Consistent empty states
9. **LoadingSpinner** - Loading indicators
10. **Skeleton** - Loading placeholders

---

## Component Testing

### Manual Testing Checklist

For each component:

- [ ] Renders correctly
- [ ] Props work as expected
- [ ] Animations are smooth
- [ ] Accessibility labels present
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Responsive to different screen sizes

### Future: Automated Testing

Consider adding:

- Jest for unit tests
- React Native Testing Library
- Detox for E2E tests
