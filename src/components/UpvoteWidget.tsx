'use client';
import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function UpvoteWidget() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [remountKey, setRemountKey] = useState(0);

  // Removed early return from here to obey Rules of Hooks

  // Fallback for fetchSession as required by widget
  const fetchSession = useCallback(async () => {
    try {
        const res = await fetch(`/api/auth/session?t=${Date.now()}`);
        const data = await res.json();
        // Priority to useAuth() but fetchSession provides a secondary sync
        if (user) {
            setUserData(user);
        } else if (data.user?.email) {
            setUserData(data.user);
        } else {
            setUserData(null);
        }
    } catch {
        setUserData(user || null);
    }
  }, [user]);

  useEffect(() => {
    fetchSession();
    
    const handleLogin = (e: any) => { 
        setUserData(e.detail); 
        setRemountKey(k => k + 1); 
    };
    
    const handleLogout = () => { 
        setUserData(null); 
        setRemountKey(k => k + 1); 
        // @ts-ignore
        if(window.__upvote_cleanup) window.__upvote_cleanup(); 
    };
    
    window.addEventListener('upvote:login', handleLogin);
    window.addEventListener('upvote:logout', handleLogout);
    window.addEventListener('focus', fetchSession);
    
    return () => {
      window.removeEventListener('upvote:login', handleLogin);
      window.removeEventListener('upvote:logout', handleLogout);
      window.removeEventListener('focus', fetchSession);
    };
  }, [fetchSession]);

  // AEO/GEO FAQ Data
  const faqs = JSON.stringify([
    {
      "question": "Is envdrop really Zero-Knowledge?",
      "answer": "Yes. We use client-side AES-256-GCM encryption. The decryption key is stored in the URL fragment (#), which is never sent to our servers."
    },
    {
      "question": "Is there a CLI tool?",
      "answer": "Yes. We provide a universal CLI for Windows, Mac, and Linux that supports secure pushing for power users and CI/CD pipelines."
    }
  ]);

  // Hide on dashboard - moved here to obey Rules of Hooks
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <div key={remountKey}>
      <div className="upvote-widget"
           data-application-id="69d113e2907ca65231e55ae8"
           data-user-id={userData?.uid || userData?.id || ''}
           data-email={userData?.email || ''}
           data-position="right"
           data-theme="light"
           data-logo-url="https://envdrop.entrext.com/favicon.svg"
           data-product-overview="envdrop is a premium, zero-knowledge secret sharing platform designed for modern developers."
           data-about-text="Secure your environment variables with AES-256-GCM encryption. Built for security-first teams."
           data-faqs={faqs}>
      </div>
      <Script src="https://upvote.entrext.com/widget.js" strategy="afterInteractive" />
    </div>
  );
}
