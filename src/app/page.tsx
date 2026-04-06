"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Zap, Lock, Copy, Check, LockKeyhole, 
  TerminalSquare, Link as LinkIcon, Network, Clock, 
  FolderGit2, ChevronDown, ChevronRight, Mail, 
  MessageSquare, 
  Send, Sparkles, Globe, Fingerprint, BookOpen, AlertCircle
} from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const elegantEase = [0.16, 1, 0.3, 1] as const;

  return (
    <main className={styles.main}>
      
      {/* GLOW BACKGROUND PULSE */}
      <div className={styles.glowBg} />

      {/* NAVBAR: PRECISION RECONSTRUCTION */}
      <header style={{ 
        width: '100%', 
        borderBottom: '1px solid var(--border-color)', 
        background: 'var(--nav-bg)', 
        backdropFilter: 'blur(10px)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}>
        <nav className={styles.nav} style={{ 
          justifyContent: 'space-between',
          padding: isMobile ? '1rem 1.25rem' : '1.25rem 2.5rem'
        }}>
          {/* LEFT: LOGO */}
          <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" className={styles.logo} style={{ textDecoration: 'none', color: 'white', fontWeight: 800 }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="white" />
              </div>
              {!isMobile && "envdrop"}
            </Link>
          </div>

          {/* CENTER: LINKS */}
          <div className={styles.navLinks} style={{ display: 'flex', gap: '2rem' }}>
            <a href="#how-it-works">How it Works</a>
            <a href="#security">Security</a>
            <Link href="/blogs">Blogs</Link>
            {user && (
              <Link href="/dashboard" style={{ color: 'var(--brand-primary)' }}>Dashboard</Link>
            )}
          </div>

          {/* RIGHT: ACTIONS */}
          <div className={styles.navActions} style={{ flex: isMobile ? 'none' : 1, display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            {user ? (
              <Link href="/dashboard" className={styles.btnPrimary} style={{ textDecoration: 'none', padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                Vault
              </Link>
            ) : (
              <>
                {!isMobile && <Link href="/login" className={styles.btnOutline} style={{ textDecoration: 'none' }}>Sign In</Link>}
                <Link href="/login" className={styles.btnPrimary} style={{ textDecoration: 'none', padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                  {isMobile ? "Join" : "Get Started"}
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* HERO SECTION: ORIGINAL DESIGN */}
      <section className={styles.section} style={{ padding: isMobile ? '4rem 1.25rem' : '8rem 2rem' }}>


        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.heroTitle}>
          Handshake your secrets<br /><span>without the risk.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.heroSubtitle}>
          End-to-end encrypted sharing. Encrypted in your browser, decrypted by your team. Even we can&apos;t see your data.
        </motion.p>

        {/* STATIC DEMO SCREENSHOT (No backend calls) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className={styles.terminal}>
           <div className={styles.terminalHeader}>
             <div className={styles.terminalDots}>
               <div className={`${styles.dot} ${styles.dotRed}`} />
               <div className={`${styles.dot} ${styles.dotYellow}`} />
               <div className={`${styles.dot} ${styles.dotGreen}`} />
             </div>
             <div className={styles.terminalTitle}>demo — live preview</div>
           </div>
           
           <div className={styles.terminalBody}>
             <div className={styles.textarea} style={{ overflowY: 'hidden', minHeight: '150px', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--foreground)', userSelect: 'none' }}>
                <span style={{ color: 'var(--muted)' }}># Paste your secure .env variables here...</span><br/><br/>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>STRIPE_SECRET_KEY</span>=<span style={{ color: '#10b981' }}>sk_live_51Mabc...</span><br/>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>DATABASE_URL</span>=<span style={{ color: '#10b981' }}>"postgresql://admin:***@db/prod"</span><br/>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>OPENAI_API_KEY</span>=<span style={{ color: '#10b981' }}>sk-xxx...</span><br/>
             </div>
           </div>

           <div className={styles.terminalFooter} style={{ filter: 'grayscale(100%)', opacity: 0.6, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', gap: '0.75rem', width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
                 <select className={styles.select} disabled style={{ width: '100%' }}>
                   <option>Expires in 24 Hours</option>
                 </select>
                 <input 
                   type="text" 
                   value="Production Secrets"
                   readOnly
                   className={styles.select}
                   style={{ width: '100%' }}
                 />
              </div>
              <button 
               className={styles.btnPrimary} 
               disabled
               style={{ width: isMobile ? '100%' : 'auto' }}
              >
                Buffer Ready
              </button>
           </div>

           <div className={styles.successPanel} style={{ borderTop: '1px solid var(--border-color)', marginTop: 0, borderRadius: '0 0 16px 16px', background: 'var(--glass-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                 <Check size={16} /> Encryption Key Handshake Complete
              </div>
              <div className={styles.linkRow}>
                 <div className={styles.linkUrl} style={{ userSelect: 'none', color: 'var(--muted)' }}>https://envdrop.com/share/demo-id#fragment</div>
                 <button className={styles.copyAreaBtn} disabled>
                   <Copy size={16} />
                 </button>
              </div>
           </div>
        </motion.div>
      </section>

      {/* ORIGINAL FULL SECTIONS */}
      {/* 1. HOW IT WORKS */}
      <section id="how-it-works" className={styles.section}>
         <div className={styles.sectionPretitle}>Protocol</div>
         <h2 className={styles.sectionTitle}>Built for <span>High-Stakes Sharing.</span></h2>
         <div className={styles.stepsGrid}>
            <StepCard number="01" title="Local Encryption" desc="Secrets are encrypted in your browser using AES-256-GCM before they leave your machine." icon={Shield} />
            <StepCard number="02" title="Zero-Knowledge Storage" desc="We store the ciphertext in our Redis buffers. We never see your decryption key." icon={Zap} />
            <StepCard number="03" title="Permanent Purge" desc="Upon expiry or manual burn, the data is physically wiped from our infrastructure." icon={Clock} />
         </div>
      </section>

      {/* 2. SECURITY */}
      <section id="security" className={styles.section}>
         <div className={styles.sectionPretitle}>Security</div>
         <h2 className={styles.sectionTitle}>Enterprise-Grade <span>Protection.</span></h2>
         <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
         </div>
      </section>

      {/* 3. PRICING */}
      <section id="pricing" className={styles.section}>
         <div className={styles.sectionPretitle}>Pricing</div>
         <h2 className={styles.sectionTitle}>Simple, <span>Transparent Pricing.</span></h2>
         <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <PricingCard
              tier="Studio"
              price="5"
              desc="Everything you need to share secrets securely — for your team or solo."
              popular
              features={[
                "Unlimited secret sharing",
                "7-day persistence per share",
                "Security audit logs & access history",
                "API tokens for CLI & VS Code",
                "Team vault collaboration",
                "Burn-after-reading links",
                "End-to-End AES-256 Encryption",
                "Dashboard access with analytics",
                "Token management & revocation",
                "Priority support",
              ]}
            />
         </div>
      </section>

      {/* 4. FAQ */}
      <section className={styles.section} id="faq">
        <h2 className={styles.sectionTitle}>Frequently Asked <span>Questions.</span></h2>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          {faqData.map((faq, idx) => (
            <FaqItem key={idx} {...faq} isOpen={activeFaq === idx} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} />
          ))}
        </div>
      </section>

      {/* JSON-LD FOR AEO/GEO (AI READINESS) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "envdrop",
              "operatingSystem": "Web, Windows, macOS, Linux",
              "applicationCategory": "SecurityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Secure zero-knowledge environment variable sharing for modern engineering teams."
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqData.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            }
          ])
        }}
      />
    </main>
  );
}

// SUB-COMPONENTS
function StepCard({ number, title, desc, icon: Icon }: any) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepNumber}>{number}</div>
      <div className={styles.stepIcon}><Icon size={24} /></div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDesc}>{desc}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className={styles.featureCard}>
      <Icon className={styles.featureIconSmall} size={24} />
      <h4 className={styles.featureTitle}>{title}</h4>
      <p className={styles.featureDesc}>{desc}</p>
    </div>
  );
}

function PricingCard({ tier, price, desc, features, popular }: any) {
  const { user } = useAuth();

  const handleClick = () => {
    // Always redirect to Dodo checkout for the paid plan
    const productId = process.env.NEXT_PUBLIC_DODO_PRODUCT_ID || "pdt_0Nc6gTBbIA4G9pjyM1wXf";
    const origin = window.location.origin;
    const redirectUrl = user
      ? `${origin}/payment/success?userId=${user.uid}`
      : `${origin}/payment/success`;

    const checkoutUrl = new URL(`https://checkout.dodopayments.com/buy/${productId}`);
    checkoutUrl.searchParams.set("quantity", "1");
    checkoutUrl.searchParams.set("redirect_url", redirectUrl);
    if (user?.email) {
      checkoutUrl.searchParams.set("customer[email]", user.email);
    }

    window.location.href = checkoutUrl.toString();
  };

  return (
    <div className={`${styles.pricingCard} ${popular ? styles.popular : ''}`}>
      {popular && <div className={styles.popularBadge}>POPULAR</div>}
      <h3 className={styles.pricingTitle}>{tier}</h3>
      <p className={styles.pricingDesc}>{desc}</p>
      <div className={styles.price}>${price}<span>/mo</span></div>
      <button
        onClick={handleClick}
        className={`${styles.btnPrimary} ${styles.pricingBtn}`}
        style={{ textDecoration: 'none' }}
      >
        Get {tier} — ${price}/mo
      </button>
      <ul className={styles.featureList}>
        {features.map((f: string, i: number) => (
          <li key={i} className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> {f}</li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ question, answer, isOpen, onClick }: any) {
  return (
     <div style={{ borderBottom: '1px solid var(--border-color)' }}>
        <button onClick={onClick} style={{ width: '100%', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer', textAlign: 'left' }}>
           <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{question}</span>
           {isOpen ? <ChevronDown size={20} color="var(--brand-primary)" /> : <ChevronRight size={20} color="var(--muted)" />}
        </button>
       <AnimatePresence>
         {isOpen && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <p style={{ color: 'var(--muted)', paddingBottom: '1.5rem', lineHeight: 1.6 }}>{answer}</p>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

function SocialIcon({ type, url }: { type: string, url: string }) {
  const icons: Record<string, any> = {
    linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    twitter: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
    instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    discord: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>,
    substack: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.079v2.836zm0 4.381H1.46V15.46h21.079v-2.837zm0 6.418H1.46V24l10.54-6.112L22.539 24v-4.959zM22.539 0H1.46v2.836h21.079V0z"/></svg>
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', cursor: 'pointer' }}>
      {icons[type] || <MessageSquare size={16} />}
    </a>
  );
}

const features = [
  { icon: Shield, title: "Web Crypto AES-256", desc: "Encryption happens locally in your browser. Raw secrets never touch the wire." },
  { icon: LockKeyhole, title: "Zero-Knowledge Storage", desc: "We only store encrypted ciphertext. Even we cannot read your data." },
  { icon: Zap, title: "Ephemeral Buffers", desc: "Secrets are kept in memory and purged automatically after reading or expiry." },
  { icon: Network, title: "Team RBAC", desc: "Define granular access control for your entire engineering organization." },
  { icon: Fingerprint, title: "Security Audit Logs", desc: "Complete transparency onto who accessed what secret and from where." },
  { icon: Globe, title: "Global Compliance", desc: "SOC2 and GDPR compliant storage across globally distributed safety buffers." }
];

const faqData = [
  { question: "How does the handshake work?", answer: "We use E2E encryption. You encrypt locally, share a unique link + fragment key. The recipient's browser uses the fragment to decrypt. No server ever sees the key." },
  { question: "What is Zero-Knowledge?", answer: "It means we have zero knowledge of your data contents. Your privacy is guaranteed by mathematics, not just our word." },
  { question: "Does this replace Hashicorp Vault?", answer: "We focus on the handshake (sharing) part. We are the perfect companion for temporary, secure secret distribution between developers." }
];
