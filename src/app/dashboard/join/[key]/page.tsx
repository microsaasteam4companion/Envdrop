"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, RefreshCcw, CheckCircle } from "lucide-react";
import { setVaultKey } from "@/lib/vault";

export default function JoinDashboard() {
  const params = useParams();
  const router = useRouter();
  const key = params?.key as string;

  useEffect(() => {
    if (!key) return;

    // Simulate a secure sync process
    const syncVault = async () => {
      // 1. Save the key locally (Syncing with Admin)
      setVaultKey(key);
      
      // 2. Clear caches to ensure fresh data
      localStorage.removeItem("dotenv_local_keys"); 

      // 3. Short delay for visual Polish
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    };

    syncVault();
  }, [key, router]);

  return (
    <main style={{ 
      height: '100vh', background: '#0f172a', color: 'white',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2rem'
    }}>
      <div style={{ position: 'relative' }}>
         <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '120px', height: '120px', background: '#6366f1', borderRadius: '50%',
            filter: 'blur(40px)', zIndex: -1
          }}
         />
         <Shield size={64} color="#6366f1" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Initializing <span style={{ color: '#6366f1' }}>Team Vault</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Securely syncing your dashboard with the admin transmissions...</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <RefreshCcw size={20} className="spin" color="#6366f1" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>VIRTUAL_KEY_EXCHANGE_ACTIVE</span>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </main>
  );
}
