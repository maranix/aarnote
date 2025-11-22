import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'aarnote-storage',
});

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'current_user',
} as const;
