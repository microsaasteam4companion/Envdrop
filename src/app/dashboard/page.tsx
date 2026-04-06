"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Lock, Copy, Check, Trash2, 
  ExternalLink, Clock, BarChart3, Search,
  RefreshCcw, ShieldCheck, Inbox, X,  Plus, Calendar, Eye, Timer, History, Settings,
  Users, LayoutDashboard, Database, LogOut,
  AlertCircle, ShieldAlert, Globe, Server, CheckCircle,
  Key, Fingerprint, Activity, Terminal, HelpCircle, Menu
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { getOrCreateVaultKey, getLocalKey, setVaultKey, resetVaultKey } from "@/lib/vault";
import Link from "next/link";
import styles from "@/app/page.module.css";
import ShareForm from "@/components/ShareForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AccessLog {
  ip: string;
  userAgent: string;
  timestamp: string;
}

interface Share {
  id: string;
  label: string;
  createdAt: string;
  lastAccessedAt?: string;
  hits: number;
  burn: boolean;
  ttl: number;
  accessLogs: AccessLog[];
}

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [activeTab, setActiveTab] = useState("vault");
  const [teamKeyInput, setTeamKeyInput] = useState("");
  const [teamName, setTeamName] = useState("My Enterprise Team");
  const [tokens, setTokens] = useState<any[]>([]);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [isTokenGenerating, setIsTokenGenerating] = useState(false);
  const [tokenLabel, setTokenLabel] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Check payment status once user is loaded
  useEffect(() => {
    if (!user) return;
    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify?userId=${user.uid}&email=${encodeURIComponent(user.email || "")}`);
        const data = await res.json();
        setHasPaid(data.paid === true);
      } catch {
        setHasPaid(false);
      }
    };
    checkPayment();
  }, [user]);

  const fetchShares = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const response = await fetch("/api/shares", {
        headers: { "X-Vault-Key": user.uid }
      });
      if (!response.ok) return;
      const data = await response.json();
      setShares(data.shares || []);
    } catch (err: any) {
      if (err.name !== "TypeError") {
        console.error("Failed to fetch shares:", err);
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const fetchTokens = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setIsTokenGenerating(true); 
    try {
      const resp = await fetch(`/api/tokens?userId=${user.uid}`);
      if (!resp.ok) return;
      const data = await resp.json();
      setTokens(data.tokens || []);
    } catch (err: any) {
      if (err.name !== "TypeError") {
        console.error("Failed to fetch tokens:", err);
      }
    } finally {
      if (!isBackground) setIsTokenGenerating(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchShares();
      fetchTokens();
      const interval = setInterval(() => {
        fetchShares(true);
        fetchTokens(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (authLoading || hasPaid === null) {
    return (
      <div style={{ height: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCcw size={40} className={styles.spin} color="#6366f1" />
      </div>
    );
  }

  if (!user) return null;

  // PAYWALL — show if user hasn't paid
  if (!hasPaid) {
    const productId = process.env.NEXT_PUBLIC_DODO_PRODUCT_ID || "pdt_0Nc6gTBbIA4G9pjyM1wXf";
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectUrl = `${origin}/payment/success?userId=${user.uid}`;
    const checkoutUrl = new URL(`https://checkout.dodopayments.com/buy/${productId}`);
    checkoutUrl.searchParams.set("quantity", "1");
    checkoutUrl.searchParams.set("redirect_url", redirectUrl);
    if (user.email) checkoutUrl.searchParams.set("customer[email]", user.email);

    return (
      <div style={{
        minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif', padding: '2rem', position: 'relative'
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--card-bg)', border: '1px solid var(--border-color)',
            borderRadius: '32px', padding: '3.5rem', maxWidth: '520px', width: '100%',
            textAlign: 'center', position: 'relative', zIndex: 1,
            boxShadow: '0 40px 80px rgba(0,0,0,0.15)'
          }}
        >
          {/* Lock icon */}
          <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={40} color="#6366f1" />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
            Studio Plan Required
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            Unlock Your Vault
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>
            The dashboard requires an active Studio subscription. Get unlimited sharing, audit logs, and API tokens for just <strong style={{ color: 'var(--foreground)' }}>$5/mo</strong>.
          </p>

          {/* Feature list */}
          <div style={{ background: 'var(--background)', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left' }}>
            {[
              'Unlimited secret sharing',
              '7-day persistence per share',
              'Security audit logs & access history',
              'API tokens for CLI & VS Code',
              'Team vault collaboration',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                <ShieldCheck size={15} color="#6366f1" style={{ flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href={checkoutUrl.toString()}
            style={{
              display: 'block', width: '100%', padding: '1.1rem',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white', borderRadius: '16px', fontWeight: 800,
              textDecoration: 'none', fontSize: '1.05rem', marginBottom: '0.75rem',
              boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            Upgrade to Studio — $5/mo
          </a>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '0.85rem',
              background: 'transparent', color: 'var(--muted)',
              border: '1px solid var(--border-color)', borderRadius: '12px',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
            }}
          >
            Sign out ({user.email})
          </button>
        </motion.div>
      </div>
    );
  }

  const formatTTL = (seconds: number) => {
    if (seconds <= 0) return "Expired";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m remaining`;
    return `${m}m remaining`;
  };

  const handleRevoke = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to revoke this link? This action is permanent and deletes all data from our servers.")) return;
    
    try {
      if (!user) return;
      const response = await fetch(`/api/shares/${id}`, {
        method: "DELETE",
        headers: { "X-Vault-Key": user.uid }
      });
      
      if (response.ok) {
        setShares(shares.filter(s => s.id !== id));
        if (selectedShare?.id === id) setSelectedShare(null);
      } else {
        alert("Failed to revoke share. Please try again.");
      }
    } catch (err) {
      console.error("Failed to revoke share:", err);
    }
  };

  const copyFullLink = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const localKey = getLocalKey(id);
    const baseUrl = `${window.location.origin}/share/${id}`;
    const fullUrl = localKey ? `${baseUrl}#${localKey}` : baseUrl;
    
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJoinTeam = () => {
    if (!teamKeyInput.trim()) return;
    if (confirm("Joining a new team will switch your vault view. You can always switch back using your original key. Proceed?")) {
      setVaultKey(teamKeyInput.trim());
      setLoading(true);
      fetchShares();
      setTeamKeyInput("");
      alert("Successfully joined the vault!");
    }
  };

  const handleResetVault = () => {
    if (confirm("WARNING: This will wipe your local vault identity and generate a new key. You will lose access to your current shared links unless you saved their URLs. Proceed?")) {
      resetVaultKey();
      window.location.reload();
    }
  };

  const generateToken = async () => {
    if (!user?.uid) {
      alert("Session expired. Please sign in again.");
      return;
    }
    if (!tokenLabel.trim()) {
      alert("Please enter a label for your token (e.g., Personal CLI)");
      return;
    }
    console.log("Generating token for user:", user.uid);
    setIsTokenGenerating(true);
    try {
      const resp = await fetch("/api/tokens/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, label: tokenLabel })
      });
      const data = await resp.json();
      if (data.token) {
        setNewToken(data.token);
        fetchTokens();
        setTokenLabel("");
      } else {
        alert(`Error: ${data.error || "Failed to generate token"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Connection error while generating token. Please try again.");
    } finally {
      setIsTokenGenerating(false);
    }
  };

  const revokeToken = async (id: string) => {
    if (!confirm("Are you sure? Any app using this token will stop working immediately.")) return;
    try {
      const resp = await fetch(`/api/tokens/${id}`, { method: "DELETE" });
      if (resp.ok) fetchTokens();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredShares = shares.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Global activity audit
  const globalAuditLogs = shares.flatMap(s => s.accessLogs.map(l => ({ ...l, label: s.label, id: s.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--background)', color: 'var(--foreground)', overflow: 'hidden', position: 'relative' }}>
      
      {/* MOBILE HEADER */}
      {isMobile && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
          background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)', display: 'flex', 
          alignItems: 'center', justifyContent: 'flex-start', padding: '0 1.25rem',
          zIndex: 50, borderBottom: '1px solid var(--border-color)',
          gap: '1rem'
        }}>
          <button onClick={() => setIsSidebarOpen(true)} style={{ color: 'var(--sidebar-text)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Menu size={24} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--sidebar-text)' }}>envdrop</span>
          </div>
        </div>
      )}

      {/* PROFESSIONAL SIDEBAR */}
      <aside 
        className={isMobile && !isSidebarOpen ? 'sidebar-hidden' : ''}
        style={{ 
          width: '280px', background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)', 
          display: 'flex', flexDirection: 'column', padding: '1.5rem',
          borderRight: '1px solid var(--border-color)', zIndex: 100,
          position: isMobile ? 'fixed' : 'relative',
          top: 0, bottom: 0, left: 0,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', marginBottom: '2.5rem', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BrandLogo size={32} />
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: 900, 
                color: 'white', 
                letterSpacing: '-0.02em'
              }}>envdrop</span>
            </div>
          </Link>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} style={{ color: 'var(--sidebar-muted)', background: 'rgba(128,128,128,0.1)', border: 'none', padding: '0.4rem', borderRadius: '8px' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <button 
          onClick={() => { setIsCreateOpen(true); if(isMobile) setIsSidebarOpen(false); }}
          style={{ 
            background: 'var(--brand-primary)', color: 'white', border: 'none', 
            padding: '0.85rem', borderRadius: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.2s',
            boxShadow: '0 4px 12px var(--brand-glow)'
          }}
        >
          <Plus size={20} /> New Share
        </button>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem active={activeTab === 'vault'} icon={<LayoutDashboard size={18}/>} label="My Vault" onClick={() => { setActiveTab('vault'); if(isMobile) setIsSidebarOpen(false); }} />
          <SidebarItem active={activeTab === 'audit'} icon={<History size={18}/>} label="Security Audit" onClick={() => { setActiveTab('audit'); if(isMobile) setIsSidebarOpen(false); }} />
          <SidebarItem active={activeTab === 'tokens'} icon={<Key size={18}/>} label="API & Tokens" onClick={() => { setActiveTab('tokens'); if(isMobile) setIsSidebarOpen(false); }} />
          <SidebarItem active={activeTab === 'collaborators'} icon={<Users size={18}/>} label="Collaborators" onClick={() => { setActiveTab('collaborators'); if(isMobile) setIsSidebarOpen(false); }} />
          <SidebarItem active={activeTab === 'settings'} icon={<Settings size={18}/>} label="Settings" onClick={() => { setActiveTab('settings'); if(isMobile) setIsSidebarOpen(false); }} />
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* USER PROFILE SECTION */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '1rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #818cf8, #c084fc)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'uppercase'
            }}>
              {user?.email?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.displayName || 'Active User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sidebar-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, paddingLeft: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              Enterprise Plan Active
            </div>
            <button 
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', 
                background: 'rgba(239, 68, 68, 0.05)', border: 'none', cursor: 'pointer', 
                fontSize: '0.9rem', width: '100%', padding: '0.75rem', borderRadius: '10px',
                fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto',
        marginTop: isMobile ? '64px' : '0'
      }}>
        
        <header style={{ 
          background: 'var(--card-bg)', 
          padding: isMobile ? '1rem 1.25rem' : '1.25rem 2.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)' }}>
              {activeTab === 'vault' ? "Secure Transmissions" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.5rem', alignItems: 'center' }}>
            <ThemeToggle />
            {activeTab === 'vault' && !isMobile && (
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input 
                  type="text" placeholder="Filter transmissions..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--background)', color: 'var(--foreground)', width: '280px', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            )}
            <button onClick={() => { fetchShares(false); fetchTokens(false); }} style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <RefreshCcw size={18} className={loading || isTokenGenerating ? styles.spin : ''} />
            </button>
          </div>
        </header>

        <section style={{ padding: isMobile ? '1.25rem' : '2.5rem' }}>
          {activeTab === 'vault' ? (
            <>
              {isMobile && (
                <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" placeholder="Filter transmissions..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              )}
              {loading && shares.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem', gap: '1rem' }}>
                  <RefreshCcw size={40} className={styles.spin} color="var(--brand-primary)" />
                  <p style={{ color: 'var(--muted)', fontWeight: 500 }}>Decrypting Vault Identity...</p>
                </div>
              ) : (
                <>
                  {filteredShares.length === 0 ? (
                    <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '8rem', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                      <Inbox size={60} color="var(--muted)" style={{ marginBottom: '1.5rem', margin: '0 auto', opacity: 0.3 }} />
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>No transmissions yet</h3>
                      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Share your first secret to see it tracked here.</p>
                      <button onClick={() => setIsCreateOpen(true)} className={styles.btnPrimary} style={{ background: 'var(--brand-primary)', boxShadow: 'none', padding: '0.8rem 2rem', margin: '0 auto' }}>
                        Create Share
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                      <AnimatePresence>
                        {filteredShares.map((share) => (
                          <motion.div 
                            key={share.id} layoutId={share.id}
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -4, borderColor: 'var(--brand-primary)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                            onClick={() => setSelectedShare(share)}
                            style={{ 
                              background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '18px', 
                              border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s',
                              display: 'flex', flexDirection: 'column', gap: '1rem',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ 
                                width: '36px', height: '36px', borderRadius: '8px', 
                               background: share.burn ? 'rgba(225, 29, 72, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                                color: share.burn ? '#e11d48' : 'var(--brand-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                {share.burn ? <History size={18} /> : <ShieldCheck size={18} />}
                              </div>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', background: 'var(--background)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{share.id}</div>
                            </div>
                            <div>
                              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>{share.label}</h3>
                              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Created {new Date(share.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Eye size={14} /> {share.hits} views
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: share.ttl < 3600 ? '#e11d48' : '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Clock size={14} /> {formatTTL(share.ttl)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </>
          ) : activeTab === 'audit' ? (
            <div style={{ background: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--background)' }}>
                 <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--foreground)' }}>Global Security History</h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Tracking the last 50 access points across your vault.</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Transmission Label</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Access IP</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Device Type</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Timestamp</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalAuditLogs.map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--foreground)' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{log.label}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}><code style={{ background: 'var(--background)', color: 'var(--brand-primary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{log.ip}</code></td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--muted)', fontSize: '0.8rem' }}>{log.userAgent.split(')')[0].slice(0, 30)}...</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span style={{ padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#059669', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                            SECURE ACCESS
                          </span>
                        </td>
                      </tr>
                    ))}
                    {globalAuditLogs.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No activity logs recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'tokens' ? (
            <div style={{ maxWidth: '900px' }}>
               <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', gap: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>API Tokens</h3>
                        <button 
                          onClick={() => setIsHelpOpen(true)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                          title="What is an API Token?"
                        >
                          <HelpCircle size={20} />
                        </button>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px' }}>Generate secure keys to authenticate your personal CLI toolchain or CI/CD pipelines.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
                      <input 
                        type="text" placeholder="Key Label (e.g. Work Laptop)" value={tokenLabel}
                        onChange={(e) => setTokenLabel(e.target.value)}
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: isMobile ? '100%' : '240px', outline: 'none', background: 'var(--background)', color: 'var(--foreground)' }}
                      />
                      <button 
                        onClick={generateToken} 
                        disabled={!tokenLabel.trim()}
                        style={{ padding: '0.75rem 1.5rem', background: 'var(--sidebar-bg)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', minWidth: '140px', opacity: !tokenLabel.trim() ? 0.5 : 1 }}
                      >
                        {isTokenGenerating ? "Please wait..." : "Generate Key"}
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'var(--background)', borderRadius: '20px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Device/Label</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Key Mask</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Last Handshake</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Access Key</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tokens.map((token) => (
                          <tr key={token.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--foreground)' }}>
                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>{token.label}</td>
                            <td style={{ padding: '1.25rem 1.5rem' }}><code style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>{token.mask}</code></td>
                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--muted)' }}>{token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleString() : 'Never used'}</td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                              <button 
                                onClick={() => { navigator.clipboard.writeText(token.token); alert("Token copied to clipboard!"); }}
                                style={{ 
                                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                  background: 'var(--brand-glow)', color: 'var(--brand-primary)', border: 'none', 
                                  padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                                  fontSize: '0.75rem', fontWeight: 700
                                }}
                              >
                                <Copy size={14} /> Copy Key
                              </button>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                              <button onClick={() => revokeToken(token.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Revoke</button>
                            </td>
                          </tr>
                        ))}
                        {tokens.length === 0 && (
                          <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>No active API tokens found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>

               {/* DEVELOPER HUB SECTION */}
               <div style={{ background: '#1e1b4b', borderRadius: '24px', padding: '4rem', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <Terminal size={32} color="#818cf8" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Developer Hub</h3>
                      <p style={{ color: '#94a3b8' }}>Tools and guides to integrate envdrop into your local workflow.</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '3rem' }}>
                    
                    {/* CLI GUIDE */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px' }}>
                       <h4 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                         <div style={{ width: '24px', height: '24px', background: '#6366f1', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div> 
                         Universal CLI Setup
                       </h4>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                         <p>The envdrop CLI works on any terminal (PowerShell, Bash, Zsh).</p>
                         <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           <li>Open your project terminal in the <code style={{ color: '#818cf8' }}>envdrop-cli</code> folder.</li>
                           <li>Run <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>npm install && npm run build</code></li>
                           <li>Run <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>npm link</code> to register the command globally.</li>
                           <li>Try it! Use <code style={{ color: '#818cf8' }}>envdrop login</code> then <code style={{ color: '#818cf8' }}>envdrop push [path]</code></li>
                         </ol>
                         <button 
                           onClick={() => window.open('/envdrop-cli.zip', '_blank')}
                           style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                         >
                           <Database size={16} /> Download CLI Source
                         </button>
                       </div>
                    </div>

                  </div>
               </div>
            </div>
          ) : activeTab === 'collaborators' ? (
            <div style={{ maxWidth: '800px' }}>
               <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '1rem' }}>Vault Collaborators</h3>
                  <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>Bring your team into this vault securely. Anyone with the sync link below will have full admin permissions to track, see, and manage these transmissions.</p>
                  
                  <div style={{ padding: '2rem', background: 'var(--background)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Team Invitation Link</div>
                          <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>One-click secure dashboard access</div>
                       </div>
                       <div style={{ width: '40px', height: '40px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                          <CheckCircle size={20} />
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                       <code style={{ flex: 1, padding: '0.5rem', fontWeight: 600, color: 'var(--brand-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                         {typeof window !== 'undefined' ? `${window.location.origin}/dashboard/join/${localStorage.getItem('dotenv_vault_id')}` : 'LOCKED'}
                       </code>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                       <button onClick={() => {
                          const key = localStorage.getItem('dotenv_vault_id');
                          if (key) { 
                            navigator.clipboard.writeText(`${window.location.origin}/dashboard/join/${key}`); 
                            alert("Team Invitation Link Copied!"); 
                          }
                       }} style={{ padding: '1rem', background: 'var(--brand-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                         <Copy size={18} /> Copy Invite Link
                       </button>
                       <button onClick={() => {
                          const key = localStorage.getItem('dotenv_vault_id');
                          const link = `${window.location.origin}/dashboard/join/${key}`;
                          const subject = encodeURIComponent("Invite: Join our Secure Dotenv Sharing Vault");
                          const body = encodeURIComponent(`Hi, join our secure team vault on envdrop to manage our environment variables. Follow this link to sync your dashboard: ${link}`);
                          window.location.href = `mailto:?subject=${subject}&body=${body}`;
                       }} style={{ padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                         <Inbox size={18} /> Invite via Email
                       </button>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--foreground)' }}>Manual Connection</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Paste a team member's access key below to join an existing vault manually.</p>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
                       <input 
                        type="text" placeholder="PASTE_VAULT_KEY_HERE" value={teamKeyInput} 
                        onChange={(e) => setTeamKeyInput(e.target.value)}
                        style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--background)', color: 'var(--foreground)' }}
                       />
                       <button onClick={handleJoinTeam} style={{ padding: '1rem 1.5rem', background: 'var(--foreground)', color: 'var(--background)', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                         Sync Vault
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div style={{ maxWidth: '800px' }}>
               <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: isMobile ? '1.5rem' : '3rem', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '2rem' }}>Vault Settings</h3>
                  
                  <div style={{ display: 'grid', gap: '2rem' }}>
                     <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
                        <div>
                           <div style={{ fontWeight: 700, color: 'var(--foreground)' }}>Team Identity Name</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Custom label for your dashbord header.</div>
                        </div>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: isMobile ? '100%' : '240px', background: 'var(--background)', color: 'var(--foreground)' }} />
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           <div style={{ fontWeight: 700, color: 'var(--foreground)' }}>Global Flush</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Immediately expire all links.</div>
                        </div>
                        <button disabled style={{ padding: '0.6rem 1.25rem', background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--muted)', cursor: 'not-allowed' }}>Flush All</button>
                     </div>

                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '1rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
                        <div>
                           <div style={{ fontWeight: 700, color: '#e11d48' }}>Reset Local Vault</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Wipe everything and start fresh.</div>
                        </div>
                        <button onClick={handleResetVault} style={{ padding: '0.6rem 1.25rem', background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
                          Perma-Delete Vault
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </section>
      </main>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 90 }}
        />
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', zIndex: 100 }}
            />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '560px', background: 'var(--card-bg)',
                zIndex: 101, boxShadow: '-30px 0 60px rgba(0,0,0,0.1)', padding: '3.5rem', display: 'flex', flexDirection: 'column'
              }}
            >
              <button onClick={() => setIsCreateOpen(false)} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--background)', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={24} />
              </button>
              <div style={{ flex: 1, overflowY: 'auto', marginTop: '1rem' }}>
                <ShareForm onSuccess={() => { setIsCreateOpen(false); fetchShares(); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedShare && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedShare(null)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.05)', backdropFilter: 'blur(4px)', zIndex: 90 }}
            />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '520px', background: 'var(--card-bg)',
                zIndex: 91, boxShadow: '-20px 0 100px rgba(15, 23, 42, 0.1)', padding: '4rem 3rem', display: 'flex', flexDirection: 'column',
                borderLeft: '1px solid var(--border-color)'
              }}
            >
              <button onClick={() => setSelectedShare(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={24} />
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '3.5rem' }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{selectedShare.label}</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>System ID: {selectedShare.id}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '2.5rem' }}>
                   <DetailRow icon={<Calendar size={20}/>} label="Creation Timestamp" value={new Date(selectedShare.createdAt).toLocaleString()} />
                   <DetailRow icon={<Timer size={20}/>} label="Time Until Expire" value={formatTTL(selectedShare.ttl)} color={selectedShare.ttl < 3600 ? '#e11d48' : 'var(--foreground)'} />
                   <DetailRow icon={<BarChart3 size={20}/>} label="Total Views" value={`${selectedShare.hits} recorded points`} />
                   
                   <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        <Globe size={14} /> Recent IPs
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedShare.accessLogs.slice(0, 3).map((log, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <code style={{ color: 'var(--brand-primary)' }}>{log.ip}</code>
                            <span style={{ color: 'var(--muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                        {selectedShare.accessLogs.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Waiting for first access...</p>}
                      </div>
                   </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <button onClick={(e) => copyFullLink(selectedShare.id, e)} style={{ width: '100%', padding: '1.1rem', background: 'var(--brand-primary)', color: 'white', borderRadius: '16px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                   {copiedId === selectedShare.id ? <Check size={20} /> : <><Copy size={20} /> Copy Secure Link</>}
                 </button>
                 <button onClick={(e) => handleRevoke(selectedShare.id, e)} style={{ width: '100%', padding: '1.1rem', background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', borderRadius: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                   Revoke Entirely
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newToken && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 }} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '500px', background: 'var(--card-bg)', borderRadius: '24px', padding: '3rem', zIndex: 1001, boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Token Generated!</h3>
                <p style={{ color: 'var(--muted)' }}>Copy this key now. For your security, this is the **ONLY TIME** it will be shown.</p>
              </div>

              <div style={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <code style={{ flex: 1, color: 'var(--brand-primary)', fontWeight: 800, fontSize: '1.1rem', wordBreak: 'break-all' }}>{newToken}</code>
                <button 
                  onClick={() => { navigator.clipboard.writeText(newToken); alert("Token copied!"); }}
                  style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', cursor: 'pointer' }}
                >
                  <Copy size={18} />
                </button>
              </div>

              <button onClick={() => setNewToken(null)} style={{ width: '100%', padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                I have saved my token securely
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHelpOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsHelpOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', zIndex: 2000 }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }} 
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} 
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: '50%', left: '50%', 
                width: '90%', maxWidth: '640px', background: 'var(--card-bg)', borderRadius: '28px', 
                padding: '3.5rem', zIndex: 2001, boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
                maxHeight: '85vh', overflowY: 'auto'
              }}
            >
              <button onClick={() => setIsHelpOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--background)', border: 'none', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                 </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>The API Token Handbook</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>The secure bridge between your dashboard and your development workflow.</p>
                </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <section>
                  <h4 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-primary)' }}></div>
                    What is an API Token?
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                    An API Token is a secret "Security Handshake." It allows our **CLI tool** and **VS Code extension** to talk to your vault without needing your personal email or password every time.
                  </p>
                </section>

                <section>
                  <h4 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></div>
                    How do I use it?
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p><b>1. Generate:</b> Enter a label (like "Work Laptop") and click Generate Key.</p>
                    <p><b>2. Authenticate:</b> Copy the key and use the <code style={{ color: 'var(--brand-primary)' }}>envdrop login</code> command or enter it into the VS Code extension settings.</p>
                    <p><b>3. Secure Push:</b> Now, you can push your .env files directly from your terminal or IDE into this dashboard instantly.</p>
                  </div>
                </section>

                <section style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Security Note</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                    Tokens are stored as SHA-256 hashes. We never store your raw keys. If you lose a key, simply **Revoke** it and generate a new one. Revoking a key instantly kills all access for any app using it.
                  </p>
                </section>
              </div>

              <button onClick={() => setIsHelpOpen(false)} style={{ width: '100%', marginTop: '2.5rem', padding: '1.1rem', background: 'var(--brand-primary)', color: 'white', borderRadius: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Got it, let&apos;s build
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', 
        padding: '0.8rem 1rem', borderRadius: '10px', border: 'none',
        background: active ? 'var(--brand-primary)' : 'transparent',
        color: active ? 'white' : 'var(--sidebar-text)',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        width: '100%'
      }}
    >
      {icon}
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </button>
  );
}

function DetailRow({ icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ color: 'var(--muted)' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontWeight: 700, color: color || 'var(--foreground)', fontSize: '0.95rem' }}>{value}</div>
      </div>
    </div>
  );
}
