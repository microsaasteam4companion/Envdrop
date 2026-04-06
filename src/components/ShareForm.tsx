"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Lock, Copy, Check, 
  Link as LinkIcon, TerminalSquare 
} from "lucide-react";
import { encryptData } from "@/lib/crypto";
import { getOrCreateVaultKey, saveLocalKey } from "@/lib/vault";
import styles from "@/app/page.module.css";
import { useAuth } from "@/context/AuthContext";

interface ShareFormProps {
  onSuccess?: () => void;
}

export default function ShareForm({ onSuccess }: ShareFormProps) {
  const { user } = useAuth();
  const [envContent, setEnvContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureLink, setSecureLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState("24h");
  const [label, setLabel] = useState("");

  const handleSubmit = async () => {
    if (!envContent.trim()) return;
    setIsSubmitting(true);
    
    try {
      // 1. Encrypt locally
      const { encrypted, key } = await encryptData(envContent);
      
      // 2. Secret Key (Vault Identity)
      const vaultKey = getOrCreateVaultKey();
      
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          encrypted, 
          ttl: expiry,
          burn: expiry === "once",
          label: label || "Untitled Secret",
          vaultKey: user?.uid || getOrCreateVaultKey()
        })
      });

      if (!response.ok) throw new Error("Failed to upload secret");
      
      const { id } = await response.json();
      
      // Save key locally for dashboard access
      saveLocalKey(id, key);
      
      // 3. Generate Link (fragment contains the key)
      const baseUrl = window.location.origin;
      setSecureLink(`${baseUrl}/share/${id}#${key}`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secureLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const elegantEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className={styles.shareFormContainer} style={{ background: 'var(--card-bg)', color: 'var(--foreground)', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--foreground)' }}>Create New Share</h2>
          <p style={{ color: 'var(--muted)' }}>Secrets are encrypted locally in your browser before upload.</p>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="field-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
              Reference Label
            </label>
            <input 
              type="text" 
              placeholder="e.g. Production Database Keys"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)',
                outline: 'none', background: 'var(--background)', color: 'var(--foreground)', fontSize: '0.95rem'
              }}
            />
          </div>

          <div className="field-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
              Environment Variables (Full .env support)
            </label>
            <textarea 
              placeholder="PASTE_YOUR_ENV=here
SUPPORT_FOR_MULTIPLE_KEYS=true
# Comments are also preserved"
              value={envContent}
              onChange={(e) => setEnvContent(e.target.value)}
              style={{ 
                width: '100%', flex: 1, padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)',
                outline: 'none', background: 'var(--background)', color: 'var(--foreground)', fontSize: '0.9rem', fontFamily: 'monospace',
                resize: 'none'
              }}
            />
          </div>

          <div className="field-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
              Access Policy
            </label>
            <select 
              value={expiry} 
              onChange={(e) => setExpiry(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)',
                outline: 'none', background: 'var(--background)', color: 'var(--foreground)', fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              <option value="10m">Expire in 10 Minutes</option>
              <option value="1h">Expire in 1 Hour</option>
              <option value="24h">Expire in 24 Hours</option>
              <option value="7d">Expire in 7 Days</option>
              <option value="30d">Expire in 30 Days</option>
              <option value="once">One-time View (Burn after reading)</option>
            </select>
          </div>
        </div>

        <footer style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {secureLink ? (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <Check size={16} /> Successfully Encrypted & Transmitted
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #dcfce7' }}>
                    <span style={{ flex: 1, fontSize: '0.8rem', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{secureLink}</span>
                    <button onClick={copyToClipboard} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--background)', color: 'var(--foreground)' }}>
                      {copied ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
             </motion.div>
          ) : (
            <button 
              className={styles.btnPrimary}
              style={{ width: '100%', padding: '1rem', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
              onClick={handleSubmit}
              disabled={isSubmitting || !envContent.trim()}
            >
              {isSubmitting ? "Generating vault share..." : <><Lock size={18} /> Create Secure Share</>}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
