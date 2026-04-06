"use client";

import { motion } from "framer-motion";
import { Shield, ChevronLeft, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";

interface ContentBlock {
  type: string;
  text?: string;
  items?: string[];
}

interface Post {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  content: ContentBlock[];
}

export default function BlogPostClient({ post }: { post: Post }) {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "image": [`https://envdrop.entrext.com${post.image}`],
          "datePublished": post.date,
          "author": [{
            "@type": "Person",
            "name": post.author,
            "jobTitle": post.authorRole
          }],
          "publisher": {
            "@type": "Organization",
            "name": "envdrop",
            "logo": {
              "@type": "ImageObject",
              "url": "https://envdrop.entrext.com/favicon.ico"
            }
          },
          "description": post.content.find(b => b.type === 'p')?.text || post.title
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://envdrop.entrext.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blogs",
              "item": "https://envdrop.entrext.com/blogs"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `https://envdrop.entrext.com/blogs/${post.title.toLowerCase().replace(/ /g, '-')}`
            }
          ]
        }}
      />
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', position: 'relative', zIndex: 10, backdropFilter: 'blur(10px)', background: 'var(--nav-bg)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 800, fontSize: '1.2rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
            <Shield size={18} />
          </div>
          envdrop
        </Link>
        <Link
          href="/blogs"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ChevronLeft size={16} /> All Blogs
        </Link>
      </nav>

      {/* Hero image */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--background) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '760px', padding: '0 1.5rem', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99,102,241,0.2)', backdropFilter: 'blur(10px)', color: '#818cf8', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Tag size={11} /> {post.category}
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.03em', color: 'var(--foreground)', marginBottom: '1rem' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: '#64748b', fontSize: '0.85rem', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={13} /> {post.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={13} /> {post.readTime}</span>
              <span style={{ color: '#94a3b8' }}>by {post.author} · {post.authorRole}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}
      >
        {post.content.map((block, i) => {
          if (block.type === 'h2') return (
            <h2 key={i} style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--foreground)', margin: '2.5rem 0 1rem', letterSpacing: '-0.02em', borderLeft: '3px solid #6366f1', paddingLeft: '1rem' }}>
              {block.text}
            </h2>
          );
          if (block.type === 'p') return (
            <p key={i} style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              {block.text}
            </p>
          );
          if (block.type === 'ul') return (
            <ul key={i} style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
              {block.items?.map((item, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.6rem', padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <span style={{ color: '#6366f1', marginTop: '0.35rem', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          );
          return null;
        })}

        {/* Back to blogs CTA */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <Link
            href="/blogs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)'; }}
          >
            <ChevronLeft size={16} /> Back to All Blogs
          </Link>
        </div>
      </motion.article>
    </main>
  );
}
