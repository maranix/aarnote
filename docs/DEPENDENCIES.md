# Dependencies

This document explains all third-party dependencies used in AARNote and the rationale behind each choice.

## Production Dependencies

### Core Framework

| Package        | Version  | Purpose              | Rationale                                                             |
| -------------- | -------- | -------------------- | --------------------------------------------------------------------- |
| `expo`         | ~54.0.25 | Development platform | Industry standard for React Native development, provides excellent DX |
| `react`        | 19.1.0   | UI library           | Latest stable React with concurrent features                          |
| `react-native` | 0.81.5   | Mobile framework     | Cross-platform mobile development                                     |

### Navigation

| Package                          | Version | Purpose            | Rationale                                                                |
| -------------------------------- | ------- | ------------------ | ------------------------------------------------------------------------ |
| `expo-router`                    | ~6.0.15 | File-based routing | Type-safe navigation, automatic deep linking, familiar to web developers |
| `@react-navigation/native`       | ^7.1.8  | Navigation core    | Required by Expo Router, provides navigation primitives                  |
| `react-native-screens`           | ~4.16.0 | Native screens     | Performance optimization for navigation                                  |
| `react-native-safe-area-context` | ~5.6.0  | Safe area handling | Proper handling of notches, status bars, gesture areas                   |

### State Management

| Package   | Version | Purpose          | Rationale                                                    |
| --------- | ------- | ---------------- | ------------------------------------------------------------ |
| `zustand` | ^5.0.8  | State management | Minimal boilerplate, TypeScript-first, easy MMKV integration |

### Storage

| Package                      | Version | Purpose           | Rationale                                                                    |
| ---------------------------- | ------- | ----------------- | ---------------------------------------------------------------------------- |
| `react-native-mmkv`          | ^4.0.1  | Key-value storage | Fastest storage solution for React Native, synchronous API, encrypted on iOS |
| `react-native-nitro-modules` | ^0.31.9 | MMKV dependency   | Required for MMKV to work                                                    |
| `react-native-worklets`      | 0.5.1   | MMKV dependency   | Required for MMKV to work                                                    |

### Security

| Package       | Version | Purpose          | Rationale                                   |
| ------------- | ------- | ---------------- | ------------------------------------------- |
| `expo-crypto` | ~15.0.7 | Password hashing | SHA-256 hashing for secure password storage |

### UI & Animations

| Package                        | Version | Purpose      | Rationale                                         |
| ------------------------------ | ------- | ------------ | ------------------------------------------------- |
| `react-native-reanimated`      | ~4.1.1  | Animations   | 60fps animations on UI thread, smooth transitions |
| `expo-blur`                    | ~15.0.7 | Blur effects | Glassmorphism UI design                           |
| `@expo/vector-icons`           | ^15.0.3 | Icons        | Comprehensive icon library (Ionicons)             |
| `react-native-gesture-handler` | ~2.28.0 | Gestures     | Required by Reanimated, better touch handling     |

### Media

| Package             | Version | Purpose         | Rationale                                         |
| ------------------- | ------- | --------------- | ------------------------------------------------- |
| `expo-image-picker` | ^17.0.8 | Image selection | Camera and gallery access with compression        |
| `expo-camera`       | ^17.0.9 | Camera access   | Required by image picker for camera functionality |

### Expo Modules

| Package              | Version  | Purpose       | Rationale                                  |
| -------------------- | -------- | ------------- | ------------------------------------------ |
| `expo-constants`     | ~18.0.10 | App constants | Access to app.json config                  |
| `expo-font`          | ~14.0.9  | Custom fonts  | Font loading (currently using System font) |
| `expo-linking`       | ~8.0.9   | Deep linking  | Required by Expo Router                    |
| `expo-splash-screen` | ~31.0.11 | Splash screen | App launch screen                          |
| `expo-status-bar`    | ~3.0.8   | Status bar    | Status bar styling                         |
| `expo-system-ui`     | ~6.0.8   | System UI     | System UI customization                    |

### Web Support

| Package            | Version | Purpose           | Rationale                 |
| ------------------ | ------- | ----------------- | ------------------------- |
| `react-dom`        | 19.1.0  | Web rendering     | Required for web platform |
| `react-native-web` | ~0.21.0 | Web compatibility | Run React Native on web   |
| `expo-web-browser` | ~15.0.9 | Web browser       | Open URLs in-app browser  |

## Development Dependencies

### TypeScript

| Package        | Version | Purpose       | Rationale                        |
| -------------- | ------- | ------------- | -------------------------------- |
| `typescript`   | ~5.9.2  | Type checking | Type safety and better DX        |
| `@types/react` | ~19.1.0 | React types   | TypeScript definitions for React |

### Code Quality

| Package                  | Version | Purpose              | Rationale                        |
| ------------------------ | ------- | -------------------- | -------------------------------- |
| `eslint`                 | ^9.25.0 | Linting              | Code quality and consistency     |
| `eslint-config-expo`     | ~10.0.0 | Expo ESLint config   | Expo-specific linting rules      |
| `eslint-config-prettier` | ^10.1.8 | Prettier integration | Disable conflicting ESLint rules |
| `eslint-plugin-prettier` | ^5.5.4  | Prettier as ESLint   | Run Prettier as ESLint rule      |
| `prettier`               | ^3.6.2  | Code formatting      | Consistent code formatting       |

### Git Hooks

| Package       | Version | Purpose              | Rationale                |
| ------------- | ------- | -------------------- | ------------------------ |
| `husky`       | ^9.1.7  | Git hooks            | Run checks before commit |
| `lint-staged` | ^16.2.7 | Staged files linting | Only lint changed files  |

## Removed/Unused Dependencies

The following dependencies were removed as they were not being used:

### Removed

- `@react-navigation/bottom-tabs` - Not using tab navigation
- `@react-navigation/elements` - Not using navigation elements
- `expo-haptics` - No haptic feedback implemented
- `expo-symbols` - Not using SF Symbols
- `expo-image` - Using standard Image component

## Dependency Decision Matrix

### Why Zustand over Redux?

| Aspect         | Zustand   | Redux          |
| -------------- | --------- | -------------- |
| Boilerplate    | Minimal   | Heavy          |
| TypeScript     | Built-in  | Requires setup |
| Bundle size    | ~1KB      | ~20KB          |
| Learning curve | Easy      | Steep          |
| DevTools       | Basic     | Advanced       |
| **Decision**   | ✅ Chosen | ❌             |

### Why MMKV over AsyncStorage?

| Aspect       | MMKV          | AsyncStorage |
| ------------ | ------------- | ------------ |
| Performance  | 10-30x faster | Baseline     |
| Synchronous  | Yes           | No           |
| Encryption   | iOS native    | No           |
| Type safety  | Yes           | No           |
| **Decision** | ✅ Chosen     | ❌           |

### Why Expo Router over React Navigation?

| Aspect         | Expo Router        | React Navigation      |
| -------------- | ------------------ | --------------------- |
| Routing style  | File-based         | Code-based            |
| Type safety    | Automatic          | Manual                |
| Deep linking   | Automatic          | Manual setup          |
| Learning curve | Familiar (Next.js) | React Native specific |
| **Decision**   | ✅ Chosen          | ❌                    |

### Why Reanimated over Animated?

| Aspect       | Reanimated | Animated  |
| ------------ | ---------- | --------- |
| Performance  | UI thread  | JS thread |
| FPS          | 60+        | 30-60     |
| Gestures     | Excellent  | Limited   |
| API          | Modern     | Legacy    |
| **Decision** | ✅ Chosen  | ❌        |

## Version Pinning Strategy

- **Exact versions** (~): Expo packages to ensure compatibility
- **Caret versions** (^): Third-party packages for bug fixes
- **No version range**: Critical dependencies (React, React Native)

## Security Considerations

1. **expo-crypto**: Uses SHA-256 for password hashing (not bcrypt due to React Native limitations)
2. **react-native-mmkv**: Encrypted storage on iOS by default
3. **Regular updates**: Dependencies updated quarterly for security patches

## Bundle Size Impact

| Category     | Size Impact | Justification                           |
| ------------ | ----------- | --------------------------------------- |
| Expo SDK     | Large       | Required for cross-platform development |
| Reanimated   | Medium      | Essential for premium UX                |
| Zustand      | Tiny        | Minimal overhead for state management   |
| MMKV         | Small       | Native module, highly optimized         |
| Blur effects | Medium      | Core to design system                   |

## Future Dependency Considerations

### Potential Additions

- `react-native-gesture-handler` gestures for swipe actions
- `react-native-svg` for custom icons
- `date-fns` for better date formatting
- Backend SDK (Firebase, Supabase) for cloud sync

### Potential Removals

- `expo-camera` if removing camera functionality
- `expo-blur` if simplifying design
- `expo-font` if not using custom fonts

## Dependency Update Policy

1. **Expo SDK**: Update when new stable version released
2. **React/React Native**: Update with Expo SDK
3. **Third-party**: Update monthly, test thoroughly
4. **Security patches**: Update immediately

## License Compatibility

All dependencies use MIT or similar permissive licenses, compatible with commercial use.

## Performance Benchmarks

### MMKV vs AsyncStorage

- Read: 30x faster
- Write: 10x faster
- Synchronous: No async overhead

### Reanimated vs Animated

- FPS: 60 vs 30-45
- Jank: Minimal vs Noticeable
- CPU usage: Lower (UI thread)

## Troubleshooting Common Issues

### MMKV Setup

```bash
# iOS
cd ios && pod install

# Android
# Auto-linked, no action needed
```

### Reanimated Setup

Already configured in `babel.config.js`:

```javascript
plugins: ['react-native-reanimated/plugin'];
```

### Expo Router Setup

Configured in `app.json`:

```json
{
  "expo": {
    "scheme": "aarnote"
  }
}
```
