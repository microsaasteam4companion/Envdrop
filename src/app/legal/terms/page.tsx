"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function TermsPage() {
  return (
    <main style={{ background: '#020617', color: 'white', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '3rem', fontSize: '0.9rem' }}>
          <ChevronLeft size={18} /> Back to envdrop
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <BrandLogo size={48} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Terms of Service</h1>
          <p style={{ color: '#64748b', marginBottom: '4rem' }}>Last Updated: April 04, 2026</p>

          <section style={{ display: 'grid', gap: '2.5rem' }}>
            <LegalSection title="1. Acceptance of Terms">
              By accessing or using envdrop, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our platform.
            </LegalSection>

            <LegalSection title="2. User Responsibility">
              As a zero-knowledge platform, we do not have access to your decryption keys. You are solely responsible for:
              <ul>
                <li>Maintaining the security of your decryption keys.</li>
                <li>Ensuring the accuracy of the email addresses you invite to collaborate.</li>
                <li>Complying with all applicable laws and regulations regarding data transmission.</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Prohibited Use">
              You may not use envdrop for any malicious activity, including:
              <ul>
                <li>Distributing malware, viruses, or other harmful code.</li>
                <li>Storing or transmitting data that infringes on third-party intellectual property rights.</li>
                <li>Attempting to circumvent our security protocols or encryption.</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Service Availability">
              While we strive for 99.9% uptime, envdrop is provided &quot;as is&quot; without warranties of any kind. We reserve the right to modify or terminate the service at any time with reasonable notice.
            </LegalSection>

            <LegalSection title="5. Pricing and Subscriptions">
              Free plans are subject to usage limits. Pro and Enterprise subscriptions provide additional features and higher limits. Payments are processed securely via third-party providers. Subscriptions can be canceled at any time from your dashboard.
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
