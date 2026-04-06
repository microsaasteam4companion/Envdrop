import { webcrypto } from 'node:crypto';

export async function encryptData(text: string): Promise<{ encrypted: string; key: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Generate a random 256-bit key (matching browser)
  const key = await webcrypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  
  // Generate a random 12-byte IV
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  
  // Export the key to raw format
  const exportedKey = await webcrypto.subtle.exportKey("raw", key);
  
  // Combine IV and Encrypted Data for storage
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Encode as URL-safe Base64 (matching browser helpers)
  return {
    encrypted: arrayBufferToBase64(combined),
    key: arrayBufferToBase64(exportedKey as ArrayBuffer)
  };
}

function arrayBufferToBase64(buffer: Uint8Array | ArrayBuffer): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
