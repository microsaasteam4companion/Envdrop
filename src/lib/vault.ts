const VAULT_KEY_NAME = "dotenv_vault_id";
const PERSONAL_SYMBOLS_PATH = "dotenv_local_keys"; // Local ShareID -> Key map

export function getOrCreateVaultKey(): string {
  if (typeof window === "undefined") return "";
  
  let key = localStorage.getItem(VAULT_KEY_NAME);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VAULT_KEY_NAME, key);
  }
  return key;
}

/**
 * Team Collaboration: Set a specific vault key to join a team
 */
export function setVaultKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(VAULT_KEY_NAME, key);
  }
}

/**
 * Local Vault: Store decryption keys for shares created on this machine.
 * This ensures the dashboard can re-generate the full link with #key.
 */
export function saveLocalKey(shareId: string, decryptionKey: string): void {
  if (typeof window === "undefined") return;
  const vault = JSON.parse(localStorage.getItem(PERSONAL_SYMBOLS_PATH) || "{}");
  vault[shareId] = decryptionKey;
  localStorage.setItem(PERSONAL_SYMBOLS_PATH, JSON.stringify(vault));
}

export function getLocalKey(shareId: string): string | null {
  if (typeof window === "undefined") return null;
  const vault = JSON.parse(localStorage.getItem(PERSONAL_SYMBOLS_PATH) || "{}");
  return vault[shareId] || null;
}

export function resetVaultKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(VAULT_KEY_NAME);
    localStorage.removeItem(PERSONAL_SYMBOLS_PATH);
  }
}
