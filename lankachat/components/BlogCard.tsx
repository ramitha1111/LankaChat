"use client";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

const IconNote = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export default function BlogCard({ post }: { post: Post }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <article className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", transform: isHovered ? "translateY(-4px)" : "none", boxShadow: isHovered ? "var(--shadow-lg)" : "none" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {post.cover_image_url ? (
          <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
            <Image src={post.cover_image_url} alt={post.title} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))" }} />
          </div>
        ) : (
          <div style={{ height: 180, background: "linear-gradient(135deg, var(--primary-50), var(--primary-100))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-dark)" }}><IconNote /></div>
        )}
        <div style={{ padding: "1.25rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>{formatDate(post.created_at)}</p>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{post.title}</h3>
          {post.excerpt && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>}
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>
            Read more <IconArrow />
          </div>
        </div>
      </article>
    </Link>
  );
}
