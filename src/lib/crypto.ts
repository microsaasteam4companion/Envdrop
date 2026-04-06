export async function encryptData(text: string): Promise<{ encrypted: string; key: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Generate a random 256-bit key
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  
  // Generate a random 12-byte IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  
  // Export the key to raw format
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  
  // Combine IV and Encrypted Data for storage
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Encode as Base64 for transit
  return {
    encrypted: arrayBufferToBase64(combined),
    key: arrayBufferToBase64(exportedKey as ArrayBuffer)
  };
}

export async function decryptData(encryptedBase64: string, keyBase64: string): Promise<string> {
  const combined = base64ToArrayBuffer(encryptedBase64);
  const keyData = base64ToArrayBuffer(keyBase64);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  // Import the key
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );
  
  // Decrypt the data
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}

// Helpers for Base64 <-> ArrayBuffer
function arrayBufferToBase64(buffer: Uint8Array | ArrayBuffer): string {
  let binary = "";
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Restore standard base64 if it was URL-safe
  let b64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
