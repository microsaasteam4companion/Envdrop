"use client";

import { motion } from "framer-motion";
import { Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={{ background: '#020617', color: 'white', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '3rem', fontSize: '0.9rem' }}>
          <ChevronLeft size={18} /> Back to envdrop
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#818cf8' }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <p style={{ color: '#64748b', marginBottom: '4rem' }}>Last Updated: April 04, 2026</p>

          <section style={{ display: 'grid', gap: '2.5rem' }}>
            <LegalSection title="1. Our Commitment to Zero-Knowledge">
              envdrop is built on a zero-knowledge architecture. This means we never receive, store, or transmit your decryption keys. Your environment variables are encrypted locally in your browser before being sent to our servers. Even with a subpoena, we cannot read your data.
            </LegalSection>

            <LegalSection title="2. Information We Collect">
              We collect minimal information required to provide our service:
              <ul>
                <li><strong>Identity Data:</strong> Email address and profile information provided via Google Authentication.</li>
                <li><strong>Metadata:</strong> IP addresses (for security auditing logs), timestamps, and hit counters for shared links.</li>
                <li><strong>Encrypted Data:</strong> The encrypted ciphertext of your environment variables.</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. How We Use Data">
              Your data is used solely to:
              <ul>
                <li>Facilitate the secure transmission of secrets to your intended recipients.</li>
                <li>Provide you with security audit logs (IP tracking) in your dashboard.</li>
                <li>Maintain and improve the envdrop infrastructure.</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Data Retention & Purging">
              Secrets are stored with a strict Time To Live (TTL). Once a link expires or is manually revoked, it is purged from our Redis memory buffers and cannot be recovered.
            </LegalSection>

            <LegalSection title="5. Security Measures">
              We employ AES-256-GCM encryption for all data at rest and TLS 1.3 for all data in transit. Our infrastructure is hosted in SOC2 compliant data centers.
            </LegalSection>
          </section>
        </motion.div>
      </div>
    </main>
  );
}

function LegalSection({ title, children }: any) {
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#e2e8f0' }}>{title}</h3>
      <div style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1rem' }}>{children}</div>
    </div>
  );
}
