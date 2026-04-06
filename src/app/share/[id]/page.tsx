"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, Copy, Check, 
  LockKeyhole, TerminalSquare, Eye, EyeOff,
  RefreshCcw, ArrowLeft, Shield
} from "lucide-react";
import { decryptData } from "@/lib/crypto";
import styles from "@/app/page.module.css";
import Link from "next/link";

import { useRef } from "react";
// ... (imports)

export default function SharePage() {
  const params = useParams();
  const id = params?.id as string;
  const hasFetched = useRef(false);
  
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!id || hasFetched.current) return;
    
    const retrieveAndDecrypt = async () => {
      hasFetched.current = true;
      try {
        // 1. Get the key from the hash (#key)
        const hash = window.location.hash.substring(1);
        if (!hash) {
          setError("Decryption key missing in link. We cannot decrypt your data without it.");
          setLoading(false);
          return;
        }

        // 2. Fetch from API
        const response = await fetch(`/api/retrieve/${id}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Secret not found or expired.");
          setLoading(false);
          return;
        }

        const { encrypted } = await response.json();
        
        // 3. Decrypt
        const decrypted = await decryptData(encrypted, hash);
        setDecryptedContent(decrypted);
      } catch (err: any) {
        console.error("Retrieval error:", err);
        setError("Failed to decrypt the secret. The link might be corrupted or the key is no longer valid.");
      } finally {
        setLoading(false);
      }
    };

    retrieveAndDecrypt();
  }, [id]);

  const copyToClipboard = () => {
    if (decryptedContent) {
      navigator.clipboard.writeText(decryptedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const elegantEase = [0.16, 1, 0.3, 1] as const;

  return (
    <main className={styles.main} style={{ background: '#0f172a' }}>
      <header style={{ 
        width: '100%', padding: isMobile ? '1rem' : '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center'
      }}>
        <Shield size={24} color="#6366f1" />
        <span style={{ fontWeight: 800, fontSize: isMobile ? '0.9rem' : '1.1rem', color: 'white' }}>SECURE TRANSMISSION</span>
      </header>

      <section className={styles.section} style={{ paddingTop: '8rem', minHeight: '80vh' }}>
        <div className={styles.glowBg}></div>

        <div className={styles.heroBadge}>
          {loading ? <RefreshCcw size={14} className={styles.spin} /> : <ShieldCheck size={14} />}
          {loading ? "Decrypting..." : "One-time Access Link"}
        </div>

        <motion.h1 
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: elegantEase }}
          style={{ fontSize: isMobile ? '2rem' : '3.5rem', marginBottom: '1rem' }}
        >
          {error ? "Link Expired" : "Secure Secret"}
        </motion.h1>
 Broadway
        {error ? (
          <motion.div 
            className={styles.errorCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{error}</p>
            <Link href="/" className={styles.btnPrimary}>
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className={styles.terminal}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: elegantEase, delay: 0.2 }}
          >
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDots}>
                <div className={`${styles.dot} ${styles.dotRed}`} />
                <div className={`${styles.dot} ${styles.dotYellow}`} />
                <div className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <div className={styles.terminalTitle}>bash - retrieve_env</div>
              <div className={styles.terminalActions}>
                <button 
                  className={styles.copyAreaBtn} 
                  onClick={() => setShowContent(!showContent)}
                  title={showContent ? "Hide" : "Reveal"}
                >
                  {showContent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className={styles.terminalBody}>
              {loading ? (
                <div className={styles.loadingArea}>
                  <RefreshCcw size={32} className={styles.spin} />
                  <p>Decrypting payload...</p>
                </div>
              ) : (
                <div className={styles.contentArea}>
                  <pre className={styles.preContent} style={{ filter: showContent ? 'none' : 'blur(8px)', transition: 'filter 0.3s ease' }}>
                    {decryptedContent || "# No content found"}
                  </pre>
                  {!showContent && (
                    <div className={styles.revealOverlay} onClick={() => setShowContent(true)}>
                      <button className={styles.btnSecondary} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Click to Reveal Content
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.terminalFooter} style={{ flexDirection: isMobile ? 'column' : 'row', gap: '1.25rem', padding: isMobile ? '1.25rem' : '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
                <TerminalSquare size={16} style={{ flexShrink: 0 }} />
                <span>Burn after reading is enabled. This content will disappear after closing.</span>
              </div>
              <button 
                className={styles.btnPrimary} 
                style={{ padding: '0.6rem 1rem', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                onClick={copyToClipboard}
                disabled={loading || !decryptedContent}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
              </button>
            </div>
          </motion.div>
        )}
      </section>

      <footer className={styles.footer} style={{ marginTop: 'auto' }}>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} dotenv.share. Secure by design.</p>
        </div>
      </footer>

      <style jsx>{`
        .loadingArea {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          gap: 1rem;
          color: #a1a1aa;
        }
        .contentArea {
          position: relative;
          min-height: 200px;
        }
        .preContent {
          margin: 0;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #e4e4e7;
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .revealOverlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(0,0,0,0.2);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
        .errorCard {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.5rem;
          padding: 4rem;
          text-align: center;
          max-width: 600px;
          margin: 2rem auto;
          backdrop-filter: blur(12px);
        }
      `}</style>
    </main>
  );
}
