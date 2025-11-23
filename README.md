# AARNote 📝

A modern, premium note-taking application built with React Native and Expo, featuring a sleek dark theme with glassmorphism effects.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)

## 📥 Download

Try the app on your Android device!

**Note**: This is a universal apk binary, the size will be huge. Approx: 100 megabytes.
[**Download APK**](https://github.com/maranix/aarnote/releases/download/v1.0/app-release.apk)

## ✨ Features

- 📱 **Cross-Platform**: Runs on iOS and Android
- 🎨 **Premium UI**: Dark theme with glassmorphism effects
- ⚡ **Fast & Smooth**: 60fps animations with Reanimated
- 🔒 **Secure**: Password hashing with SHA-256
- 💾 **Local-First**: MMKV storage for instant access
- 📸 **Image Support**: Add images from camera or gallery
- 🔍 **Search & Sort**: Filter notes by text and sort by date/title
- ✏️ **Rich Editing**: Create, edit, and delete notes
- 🎭 **Animations**: Smooth transitions and micro-interactions

## 📸 Demo

**Note:** For some reason the demo seems to indicate that the application gets stuck on sign-in/sign-up screen, this however only impacts the recording. In the actual testing and usage there is no such issue.

https://github.com/user-attachments/assets/db3a6cf1-54ef-4080-9bdf-b0a49aa5fa79

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- iOS: Xcode 15+ and CocoaPods
- Android: Android Studio and JDK 17+
- Expo CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maranix/aarnote.git
   cd aarnote
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **iOS Setup** (Mac only)

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start the development server**

   ```bash
   pnpm start
   ```

5. **Run on your device**

   ```bash
   # iOS
   pnpm ios

   # Android
   pnpm android
   ```

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Architecture](./docs/ARCHITECTURE.md) - System design and patterns
- [Data Flow](./docs/DATA_FLOW.md) - Sequence diagrams and data flow
- [Components](./docs/COMPONENTS.md) - UI component library
- [Dependencies](./docs/DEPENDENCIES.md) - Third-party packages
- [State Management](./docs/STATE_MANAGEMENT.md) - Zustand stores
- [Authentication](./docs/AUTHENTICATION.md) - Auth flow and security
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow

## 🏗️ Project Structure

```
aarnote/
├── app/                    # Expo Router app directory
│   ├── (app)/             # Authenticated routes
│   │   ├── index.tsx      # Home screen
│   │   ├── create-note.tsx
│   │   └── note/[id].tsx
│   ├── (auth)/            # Auth routes
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── constants/         # Colors, Layout
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── assets/               # Images and fonts
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.5
- **Platform**: Expo ~54.0
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0
- **State**: Zustand 5.0.8
- **Storage**: react-native-mmkv 4.0.1
- **Animations**: react-native-reanimated 4.1.1
- **UI Effects**: expo-blur 15.0.7

See [Dependencies](./docs/DEPENDENCIES.md) for full list and rationale.

## 📱 Features in Detail

### Authentication

- User registration with unique usernames
- Secure password hashing (SHA-256)
- Persistent sessions
- Auto-login on app restart

### Notes Management

- Create notes with title, content, and optional image
- Edit existing notes
- Delete notes with confirmation
- Search notes by title or content
- Sort by last update or title (ascending/descending)
- Image compression for optimal storage

### UI/UX

- Premium dark theme (OLED-friendly)
- Glassmorphism effects
- Smooth animations (60fps)
- Safe area handling
- Responsive design

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run linting
pnpm lint

# Type checking
pnpm tsc --noEmit
```

### Code Quality

- **ESLint**: Code linting with Expo config
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Pre-commit hooks
- **lint-staged**: Lint only changed files

### Git Workflow

```bash
# Make changes
git add .

# Commit (runs linting automatically)
git commit -m "feat: add new feature"

# Push
git push
```

## 🎨 Design System

### Colors

- Background: `#000000` (Pure black for OLED)
- Surface: `#1C1C1E`, `#2C2C2E`
- Primary: `#0A84FF` (iOS blue)
- Text: `#ECEDEE`

### Spacing

- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, xxl: 32px

### Typography

- Large Title: 34px bold
- Title: 28px bold
- Subtitle: 20px semibold
- Body: 16px regular
- Caption: 12px regular

See [Components](./docs/COMPONENTS.md) for full design system.

## 🔐 Security

- Passwords hashed with SHA-256
- MMKV encrypted storage on iOS
- No plain text password storage
- Session management with secure storage

## 📊 Performance

- **Storage**: MMKV (10-30x faster than AsyncStorage)
- **Animations**: Reanimated (UI thread, 60fps)
- **Bundle Size**: Optimized with Expo
- **Startup Time**: < 2 seconds

## 🤝 Contributing

Contributions are welcome! Please read the [Development Guide](./docs/DEVELOPMENT.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Maranix**

- GitHub: [@maranix](https://github.com/maranix)

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All open-source contributors

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check the [Documentation](./docs/)

---

Made with ❤️ using React Native and Expo
