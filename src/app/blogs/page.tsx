"use client";

import { motion } from "framer-motion";
import { Shield, ChevronLeft, Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

import { blogData } from "@/data/blogs";

const categoryColors: Record<string, string> = {
  Security: "#ef4444",
  Engineering: "#6366f1",
  Product: "#8b5cf6",
  DevOps: "#06b6d4",
  Trends: "#f59e0b",
  Compare: "#10b981",
  Story: "#ec4899",
  Guide: "#84cc16",
};

export default function BlogsPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient background */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        background: 'var(--nav-bg)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 800, fontSize: '1.2rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
            <Shield size={18} />
          </div>
          envdrop
        </Link>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <ChevronLeft size={15} /> Back to envdrop
        </Link>
      </nav>

      {/* Header */}
      <section style={{ padding: '5rem 2rem 3rem', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            <Tag size={12} /> envdrop Engineering Blog
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--foreground)' }}>
            Our <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>envdrop</span> Notes
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.15rem', maxWidth: '560px', lineHeight: 1.7 }}>
            Security insights, engineering deep-dives, and the future of zero-knowledge sharing.
          </p>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section style={{ padding: '2rem 2rem 8rem', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {blogData.map((blog, idx) => (
            <BlogCard key={idx} {...blog} index={idx} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
        © {new Date().getFullYear()} envdrop Engineering · All rights reserved
      </footer>
    </main>
  );
}

function BlogCard({ title, category, date, image, slug, readTime, index }: {
  title: string;
  category: string;
  date: string;
  image: string;
  slug: string;
  readTime: string;
  index: number;
}) {
  const accent = categoryColors[category] || '#6366f1';

  return (
    <Link href={`/blogs/${slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.6 }}
        whileHover={{ y: -8, transition: { duration: 0.25 } }}
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}33`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent}22`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
        }}
      >
        {/* Image */}
        <div style={{ height: '200px', position: 'relative', background: 'var(--sidebar-bg)', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s, transform 0.4s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, rgba(15,23,42,0.9) 100%)` }} />
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem',
            background: `${accent}22`,
            backdropFilter: 'blur(8px)',
            color: accent,
            padding: '0.3rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: `1px solid ${accent}44`,
          }}>
            {category}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.85rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={12} /> {date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={12} /> {readTime} read</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.4, marginBottom: 'auto', color: 'var(--foreground)', paddingBottom: '1.25rem' }}>
            {title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: accent, fontWeight: 700, fontSize: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            Read Article <ArrowRight size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
