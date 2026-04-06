"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ChevronRight, Mail, Globe, Sparkles, Fingerprint, LucideIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/BrandLogo";
import styles from "@/app/page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading && !user) {
    return (
      <main style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <BrandLogo size={40} />
        </motion.div>
      </main>
    );
  }

  const handleLogin = async () => {
    setIsMobile(true); // Temporary visual lock
    await loginWithGoogle();
    setIsMobile(window.innerWidth < 1024);
  };

  return (
    <main style={{ 
      background: '#020617', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* RADIANT ORBS FOR AESTHETIC DEPTH */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* NAVBAR */}
      <nav style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        zIndex: 10
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>
          <BrandLogo size={32} showText={!isMobile} />
        </Link>
        <Link href="/" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
           Back to home
        </Link>
      </nav>

      <section style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: '1000px', gap: '4rem', alignItems: 'center' }}>
           
           {/* LEFT SIDE: BRANDING & SALES PITCH */}
           <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, display: 'none' }} // Hidden on mobile, show on desktop later if needed
           >
              <div className="desktop-only" style={{ display: 'block' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Sparkles size={14} /> New Enterprise Standard
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                  The most secure way to <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>handshake</span> your secrets.
                </h2>
                <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '440px' }}>
                  Professional environment variable sharing with zero-knowledge architecture. Encrypted locally, synchronized globally.
                </p>

                <div style={{ marginTop: '3rem', display: 'grid', gap: '1.5rem' }}>
                   <FeatureLine icon={Fingerprint} text="Biometric-grade Encryption" />
                   <FeatureLine icon={Globe} text="Regional Edge Persistence" />
                   <FeatureLine icon={Lock} text="End-to-End Vault Integrity" />
                </div>
              </div>
           </motion.div>

           {/* RIGHT SIDE: THE LOGIN CARD */}
            <motion.div 
             initial={{ opacity: 0, y: 40, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             style={{ 
               width: '100%', 
               maxWidth: '460px', 
               background: 'rgba(15, 23, 42, 0.6)',
               backdropFilter: 'blur(20px)',
               borderRadius: isMobile ? '20px' : '28px',
               border: '1px solid rgba(255,255,255,0.08)',
               padding: isMobile ? '2rem 1.5rem' : '3.5rem',
               margin: '0 auto',
               boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
             }}
            >
             <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  style={{ 
                    width: '60px', height: '60px', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  <Lock size={28} color="white" strokeWidth={2.5} />
                </motion.div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  Access Your Vault
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Connect through identity to unlock transmissions</p>
             </div>

             <div style={{ display: 'grid', gap: '1.25rem' }}>
                <button 
                  onClick={handleLogin}
                  disabled={loading}
                  style={{ 
                    background: 'white', color: '#020617', border: 'none', 
                    padding: '0.9rem', borderRadius: '14px', width: '100%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    gap: '1rem', fontSize: '1rem', fontWeight: 700, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.8 : 1,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0px)')}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Loader2 size={20} color="#020617" />
                    </motion.div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {loading ? "Connecting..." : "Sign in with Google"}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                   <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                   <span style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>or</span>
                   <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                </div>

                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input 
                        type="email" placeholder="name@company.com" disabled
                        style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '12px', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                    <button 
                      disabled
                      style={{ 
                        width: '100%', padding: '0.9rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                        borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)', fontWeight: 700,
                        cursor: 'not-allowed', opacity: 0.6
                      }}
                    >
                      Continue with Email
                    </button>
                </div>
             </div>

             <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                By connecting, you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>. No sensitive data is stored on our servers in plain text.
             </div>
           </motion.div>
        </div>
      </section>

      <footer style={{ 
        padding: isMobile ? '1.5rem' : '2.5rem', 
        textAlign: 'center', 
        color: '#334155', 
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(255,255,255,0.03)' 
      }}>
        &copy; {new Date().getFullYear()} Dotenv Share. Secure Identity Layer.
      </footer>

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-only { display: block !important; }
        }
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </main>
  );
}

function FeatureLine({ icon: Icon, text }: { icon: LucideIcon, text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
      <div style={{ color: '#818cf8' }}><Icon size={20} /></div>
      <span style={{ fontWeight: 500 }}>{text}</span>
    </div>
  );
}
