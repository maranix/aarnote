# Development Guide

This guide covers the development workflow, setup, and best practices for AARNote.

## Environment Setup

### Prerequisites

1. **Node.js** (18.x or higher)

   ```bash
   node --version  # Should be 18+
   ```

2. **pnpm** (Package manager)

   ```bash
   npm install -g pnpm
   ```

3. **iOS Development** (Mac only)
   - Xcode 15+
   - CocoaPods

   ```bash
   sudo gem install cocoapods
   ```

4. **Android Development**
   - Android Studio
   - JDK 17+
   - Android SDK

5. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

### Initial Setup

1. **Clone and Install**

   ```bash
   git clone https://github.com/maranix/aarnote.git
   cd aarnote
   pnpm install
   ```

2. **iOS Setup** (Mac only)

   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Environment Variables** (if needed)
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

## Development Workflow

### Starting Development

```bash
# Start Expo dev server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Run on web
pnpm web
```

### Development Server Options

```bash
# Clear cache and start
pnpm start --clear

# Start in production mode
pnpm start --no-dev

# Start on specific port
pnpm start --port 8081
```

## Project Commands

### Available Scripts

```json
{
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "prepare": "husky"
}
```

### Custom Commands

Add to `package.json`:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "clean": "rm -rf node_modules ios/Pods",
    "reset": "pnpm clean && pnpm install && cd ios && pod install"
  }
}
```

## Code Style

### ESLint Configuration

`.eslintrc.js`:

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
```

### Prettier Configuration

`.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### TypeScript Configuration

`tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Git Workflow

### Branch Strategy

```
main
  ├── feature/user-authentication
  ├── feature/note-creation
  ├── bugfix/image-upload
  └── hotfix/crash-on-startup
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add image compression
fix: resolve crash on note deletion
docs: update README
style: format code with prettier
refactor: simplify auth store
test: add unit tests for notes store
chore: update dependencies
```

### Pre-commit Hooks

Husky runs automatically:

1. ESLint on staged `.ts` and `.tsx` files
2. Prettier on all staged files
3. Type checking (optional)

## File Structure Guidelines

### Component Files

```typescript
// ComponentName.tsx
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ComponentNameProps {
  // Props
}

export function ComponentName({ }: ComponentNameProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
  },
});
```

### Screen Files

```typescript
// screen-name.tsx
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '@/store/store';

export default function ScreenName() {
  const { data, loadData } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {},
});
```

### Store Files

```typescript
// storeName.ts
import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface StoreState {
  // State
  // Actions
}

export const useStoreName = create<StoreState>((set, get) => ({
  // Implementation
}));
```

## Debugging

### React Native Debugger

1. Install React Native Debugger
2. Start app in debug mode
3. Open debugger: `Cmd+D` (iOS) or `Cmd+M` (Android)
4. Select "Debug"

### Flipper

1. Install Flipper
2. Run app
3. Flipper auto-connects
4. View logs, network, layout

### Console Logging

```typescript
// Development only
if (__DEV__) {
  console.log('Debug info:', data);
}

// Production-safe logging
import { logger } from '@/utils/logger';
logger.debug('Debug info:', data);
logger.error('Error:', error);
```

### Reactotron (Optional)

```bash
pnpm add -D reactotron-react-native
```

## Testing

### Unit Tests (Future)

```bash
# Install Jest
pnpm add -D jest @testing-library/react-native

# Run tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

### E2E Tests (Future)

```bash
# Install Detox
pnpm add -D detox

# Build for testing
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npx expo export --platform ios --output-dir dist
npx expo-bundle-visualizer dist/bundles/ios-*.js
```

### Performance Monitoring

```typescript
import { Performance } from 'react-native-performance';

// Measure render time
Performance.mark('component-render-start');
// ... component renders
Performance.mark('component-render-end');
Performance.measure('component-render', 'component-render-start', 'component-render-end');
```

## Building for Production

### iOS Build

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android Build

```bash
# Development build
eas build --platform android --profile development

# Production build (AAB)
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

### Build Profiles

`eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**

```bash
pnpm start --clear
```

**iOS build fails:**

```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android build fails:**

```bash
cd android
./gradlew clean
cd ..
```

**Type errors:**

```bash
rm -rf node_modules
pnpm install
```

### Reset Everything

```bash
# Nuclear option
rm -rf node_modules ios/Pods
pnpm install
cd ios && pod install && cd ..
pnpm start --clear
```

## Environment Variables

### Setup

Create `.env`:

```bash
API_URL=https://api.example.com
API_KEY=your_key_here
```

### Usage

```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
```

### Configuration

`app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
```

## Continuous Integration

### GitHub Actions Example

`.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm tsc --noEmit
```

## Best Practices

### 1. Component Organization

- One component per file
- Co-locate styles with components
- Use TypeScript interfaces for props

### 2. State Management

- Keep stores focused and small
- Use selectors for derived state
- Persist important state to MMKV

### 3. Performance

- Use React.memo for expensive components
- Implement FlatList for long lists
- Optimize images (compress, resize)

### 4. Accessibility

- Add accessibility labels
- Support screen readers
- Ensure touch targets are 44x44+

### 5. Error Handling

- Always handle errors gracefully
- Provide user-friendly messages
- Log errors for debugging

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [MMKV Documentation](https://github.com/mrousavy/react-native-mmkv)

## Getting Help

1. Check documentation
2. Search existing issues
3. Ask in discussions
4. Create new issue with reproduction

## Contributing

See [Contributing Guide](../CONTRIBUTING.md) for details on:

- Code of conduct
- Pull request process
- Development setup
- Testing requirements
