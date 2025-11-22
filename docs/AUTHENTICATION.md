# Authentication & Security

This document explains the authentication system and security measures in AARNote.

## Authentication Flow

AARNote uses a local authentication system with password hashing and persistent sessions.

### Sign Up Process

1. User enters username and password
2. Client validates input (non-empty, password confirmation)
3. Check if username already exists in MMKV
4. Hash password using SHA-256 (expo-crypto)
5. Store user object in MMKV
6. Create session
7. Navigate to app

### Sign In Process

1. User enters credentials
2. Retrieve user from MMKV by username
3. Hash entered password
4. Compare hashes
5. If match, create session and navigate
6. If no match, show error

### Session Management

- Session stored as username string
- Persisted to MMKV on login
- Restored on app restart
- Cleared on logout

## Security Measures

### Password Hashing

```typescript
import * as Crypto from 'expo-crypto';

const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
};
```

**Why SHA-256?**

- Fast and secure for client-side hashing
- Available in expo-crypto
- Better than plain text
- Note: In production with backend, use bcrypt/argon2

### Data Storage

**MMKV Security:**

- iOS: Encrypted by default using iOS Keychain
- Android: Stored in app-specific directory
- Not accessible by other apps
- Cleared on app uninstall

### Input Validation

All user inputs are validated:

```typescript
// Username validation
if (!username.trim()) {
  return 'Username is required';
}

// Password validation
if (!password.trim()) {
  return 'Password is required';
}

if (password !== confirmPassword) {
  return 'Passwords do not match';
}
```

## Limitations & Considerations

### Current Limitations

1. **No Password Reset**: Users cannot reset forgotten passwords
2. **No Email Verification**: Usernames are not verified
3. **Local Only**: No cloud backup or sync
4. **Single Device**: Sessions don't sync across devices
5. **SHA-256**: Not as secure as bcrypt for passwords

### Production Recommendations

For a production app, consider:

1. **Backend Authentication**
   - Use Firebase Auth, Supabase, or custom backend
   - Implement OAuth (Google, Apple Sign In)
   - Add email verification

2. **Stronger Password Hashing**
   - Use bcrypt or argon2 on backend
   - Add salt to hashes
   - Implement password strength requirements

3. **Session Management**
   - Use JWT tokens
   - Implement refresh tokens
   - Add session expiration

4. **Additional Security**
   - Biometric authentication (Face ID, Touch ID)
   - Two-factor authentication
   - Rate limiting on login attempts
   - Account lockout after failed attempts

## Code Examples

### Sign Up Implementation

```typescript
signUp: async (username: string, password: string) => {
  try {
    set({ isLoading: true, error: null });

    // Validate
    if (!username.trim() || !password.trim()) {
      set({ error: 'All fields are required', isLoading: false });
      return false;
    }

    // Check if user exists
    const users = getAllUsers();
    if (users.some(u => u.username === username)) {
      set({ error: 'Username already exists', isLoading: false });
      return false;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser: User = {
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // Save
    users.push(newUser);
    storage.set('users', JSON.stringify(users));

    // Create session
    set({ session: username, isLoading: false });
    storage.set('currentSession', username);

    return true;
  } catch (error) {
    set({
      error: 'Failed to create account',
      isLoading: false
    });
    return false;
  }
},
```

### Sign In Implementation

```typescript
signIn: async (username: string, password: string) => {
  try {
    set({ isLoading: true, error: null });

    // Validate
    if (!username.trim() || !password.trim()) {
      set({ error: 'All fields are required', isLoading: false });
      return false;
    }

    // Find user
    const users = getAllUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      set({ error: 'Invalid credentials', isLoading: false });
      return false;
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      set({ error: 'Invalid credentials', isLoading: false });
      return false;
    }

    // Create session
    set({ session: username, isLoading: false });
    storage.set('currentSession', username);

    return true;
  } catch (error) {
    set({
      error: 'Failed to sign in',
      isLoading: false
    });
    return false;
  }
},
```

## Security Best Practices

### 1. Never Log Sensitive Data

```typescript
// ❌ Bad
console.log('Password:', password);

// ✅ Good
console.log('Login attempt for user:', username);
```

### 2. Clear Sensitive Data

```typescript
// Clear password from memory after use
let password = userInput;
const hash = await hashPassword(password);
password = '';
```

### 3. Validate on Both Sides

```typescript
// Client-side validation
if (!isValidUsername(username)) {
  return 'Invalid username';
}

// Server-side validation (if using backend)
// Always validate again on server
```

### 4. Use Secure Communication

```typescript
// Always use HTTPS for API calls
const API_URL = 'https://api.example.com';
```

### 5. Handle Errors Securely

```typescript
// ❌ Bad - reveals too much
set({ error: 'User john@example.com not found' });

// ✅ Good - generic message
set({ error: 'Invalid credentials' });
```

## Future Enhancements

1. **Biometric Authentication**

   ```typescript
   import * as LocalAuthentication from 'expo-local-authentication';

   const authenticate = async () => {
     const result = await LocalAuthentication.authenticateAsync();
     return result.success;
   };
   ```

2. **Password Strength Meter**

   ```typescript
   const checkPasswordStrength = (password: string) => {
     // Check length, complexity, etc.
     return strength;
   };
   ```

3. **Account Recovery**
   - Security questions
   - Email-based reset
   - SMS verification

4. **Session Timeout**

   ```typescript
   const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

   const checkSessionExpiry = () => {
     const lastActivity = storage.getNumber('lastActivity');
     if (Date.now() - lastActivity > SESSION_TIMEOUT) {
       signOut();
     }
   };
   ```

## Compliance Considerations

For production apps, consider:

1. **GDPR**: Right to delete account and data
2. **CCPA**: Data privacy requirements
3. **COPPA**: Age verification for users under 13
4. **Data Retention**: Policies for storing user data

## Testing Security

### Manual Testing Checklist

- [ ] Cannot sign up with existing username
- [ ] Cannot sign in with wrong password
- [ ] Session persists after app restart
- [ ] Session cleared after logout
- [ ] Passwords not visible in logs
- [ ] Data cleared after uninstall

### Security Audit

Regular security audits should check:

- Dependency vulnerabilities
- Code injection risks
- Data exposure risks
- Authentication bypass attempts
