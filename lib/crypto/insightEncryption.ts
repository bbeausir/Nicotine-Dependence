import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ENCRYPTION_KEY_PREFIX = 'insight_key_';

function generateRandomKey(length: number): Uint8Array {
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    key[i] = Math.floor(Math.random() * 256);
  }
  return key;
}

function uint8ToHex(uint8: Uint8Array): string {
  return Array.from(uint8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}

function encodeBase64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function decodeBase64(b64: string): string {
  return Buffer.from(b64, 'base64').toString('utf-8');
}

function xorEncrypt(text: string, key: Uint8Array): string {
  const textBytes = Buffer.from(text, 'utf-8');
  const encrypted = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ key[i % key.length];
  }
  return encodeBase64(Buffer.from(encrypted).toString('binary'));
}

function xorDecrypt(encrypted: string, key: Uint8Array): string {
  try {
    const encryptedBytes = Buffer.from(decodeBase64(encrypted), 'binary');
    const decrypted = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ key[i % key.length];
    }
    return Buffer.from(decrypted).toString('utf-8');
  } catch {
    return encrypted;
  }
}

export async function encryptInsightText(text: string): Promise<{
  encrypted: string;
  keyId: string;
}> {
  const keyId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Generate random encryption key
    const key = generateRandomKey(32);
    const keyHex = uint8ToHex(key);

    // Store key in secure store (works on all platforms)
    await SecureStore.setItemAsync(`${ENCRYPTION_KEY_PREFIX}${keyId}`, keyHex);

    // Encrypt the text using XOR
    const encrypted = xorEncrypt(text, key);
    return { encrypted, keyId };
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback: return plaintext if encryption fails
    return { encrypted: text, keyId };
  }
}

export async function decryptInsightText(
  encrypted: string,
  keyId: string
): Promise<string> {
  try {
    // Retrieve key from secure store
    const keyHex = await SecureStore.getItemAsync(`${ENCRYPTION_KEY_PREFIX}${keyId}`);
    if (!keyHex) {
      console.warn(`Encryption key not found for keyId: ${keyId}`);
      return encrypted; // Return as-is if key is missing
    }

    const key = hexToUint8(keyHex);
    return xorDecrypt(encrypted, key);
  } catch (error) {
    console.error('Decryption error:', error);
    return encrypted; // Fallback: return as-is if decryption fails
  }
}

export async function deleteEncryptionKey(keyId: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(`${ENCRYPTION_KEY_PREFIX}${keyId}`);
  } catch (error) {
    console.error('Error deleting encryption key:', error);
  }
}
