import * as Crypto from 'expo-crypto';

// Hash a password using SHA-256
export async function hashPassword(password: string): Promise<string> {
  // expo-crypto returns a hex string
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  return hash;
}

// Verify password by comparing SHA-256 hashes
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  return hash === hashedPassword;
}
