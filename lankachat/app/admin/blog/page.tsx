"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const IconNote = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 20h9" />
    <path d="M12 4h9" />
    <path d="M12 9h9" />
    <path d="M12 15h9" />
    <path d="M3 5v14a2 2 0 0 0 2 2h5" />
    <path d="M7 5c0-1.1.9-2 2-2h5" />
  </svg>
);

const IconDoc = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const IconDraft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 21H5a2 2 0 0 1-2-2V7" />
    <path d="m9 15 3-3 3 3" />
    <path d="m9 9 3 3 3-3" />
    <path d="M17 3h4v4" />
    <path d="M21 3 14 10" />
  </svg>
);

interface Post { id: string; title: string; slug: string; published: boolean; created_at: string; }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/posts?all=1");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const togglePublish = async (post: Post) => {
    await fetch(`/api/posts?id=${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    fetchPosts();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><IconNote /> Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary" style={{ textDecoration: "none" }}>{"\u2795"} New Post</Link>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? <p style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</p> : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-light)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--primary)" }}><IconDoc /></div>
            <p style={{ fontWeight: 600 }}>No posts yet</p>
            <Link href="/admin/blog/new" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", marginTop: "1rem" }}>Create First Post</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                {["Title", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.15rem" }}>{post.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>/blog/{post.slug}</p>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className={`badge ${post.published ? "badge-green" : "badge-blue"}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      {post.published ? (<><IconCheck /> Published</>) : (<><IconDraft /> Draft</>)}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>{formatDate(post.created_at)}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link href={`/admin/blog/${post.id}`} className="btn-ghost" style={{ textDecoration: "none", fontSize: "0.8rem" }}>Edit</Link>
                      <button onClick={() => togglePublish(post)} className="btn-ghost" style={{ fontSize: "0.8rem" }}>{post.published ? "Unpublish" : "Publish"}</button>
                      <button onClick={() => deletePost(post.id, post.title)} style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, padding: "0.4rem 0.5rem", borderRadius: 6 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
