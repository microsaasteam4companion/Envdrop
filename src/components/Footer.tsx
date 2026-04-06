'use client';
import { Shield, Send, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/page.module.css";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <Shield size={24} color="#6366f1" /> envdrop
          </div>
          <p className={styles.footerDesc}>The industry standard for secure zero-knowledge environment transmission. Trusted by engineering teams globally.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <SocialIcon type="linkedin" url="https://www.linkedin.com/company/entrext/" />
            <SocialIcon type="twitter" url="https://twitter.com" />
            <SocialIcon type="instagram" url="https://www.instagram.com/entrext.labs/" />
            <SocialIcon type="discord" url="https://discord.com/invite/ZZx3cBrx2" />
            <SocialIcon type="substack" url="https://entrextlabs.substack.com/subscribe" />
          </div>
        </div>
        <div>
          <h4 className={styles.footerColTitle}>Resource</h4>
          <div className={styles.footerLinks}>
            <Link href="/blogs">Latest Updates</Link>
            <a href="#how-it-works">How it Works</a>
            <a href="#security">Security Protocol</a>
          </div>
        </div>
        <div>
          <h4 className={styles.footerColTitle}>Company</h4>
          <div className={styles.footerLinks}>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/terms">Terms of Service</Link>
          </div>
        </div>
        <div>
          <h4 className={styles.footerColTitle}>Security</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Stay informed on our zero-knowledge audit logs.</p>
          <div style={{ display: 'flex', background: '#000', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem' }}>
            <input type="email" placeholder="Email" style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.5rem', outline: 'none', flex: 1, fontSize: '0.8rem' }} />
            <button style={{ background: 'var(--brand-primary)', border: 'none', borderRadius: '4px', padding: '0.5rem', color: 'white', cursor: 'pointer' }}><Send size={14} /></button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '0.8rem' }}>
        <div>&copy; {new Date().getFullYear()} envdrop Systems Inc. &ndash; High Performance Security.</div>
      </div>
    </footer>
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
