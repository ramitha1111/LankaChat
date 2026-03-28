"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8 12 3 7 8" />
    <path d="M12 3v12" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

interface PostData { id?: string; title: string; excerpt: string; content: string; cover_image_url: string; published: boolean; }

interface Props { initialData?: PostData; mode: "new" | "edit"; }

export default function PostEditor({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PostData>(initialData || { title: "", excerpt: "", content: "", cover_image_url: "", published: false });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, cover_image_url: data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    const url = mode === "edit" ? `/api/posts?id=${form.id}` : "/api/posts";
    const method = mode === "edit" ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess(mode === "edit" ? "Post updated!" : "Post created!");
      if (mode === "new") setTimeout(() => router.push("/admin/blog"), 1000);
    } else {
      const d = await res.json();
      setError(d.error || "Failed to save");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Title *</label>
          <input className="input" placeholder="Post title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={{ fontSize: "1.1rem", fontWeight: 600 }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Excerpt (shown in blog list)</label>
          <textarea className="input" placeholder="Short summary..." rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} style={{ resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Cover Image</label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="cover-upload" />
            <label htmlFor="cover-upload" className="btn-secondary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {uploading ? "Uploading..." : (<><IconUpload /> Upload Image</>)}
            </label>
            {form.cover_image_url && <span style={{ fontSize: "0.82rem", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><IconCheck /> Image uploaded</span>}
          </div>
          {form.cover_image_url && (
            <div style={{ marginTop: "0.75rem" }}>
              <img src={form.cover_image_url} alt="Cover" style={{ height: 120, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)" }} />
            </div>
          )}
          <div style={{ marginTop: "0.5rem" }}>
            <input className="input" type="url" placeholder="Or paste image URL..." value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} style={{ fontSize: "0.85rem" }} />
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Content *</label>
          <textarea className="input" placeholder="Write your post content here..." rows={16} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.9rem" }} />
          <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.25rem" }}>Plain text or Markdown supported</p>
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.875rem", background: "var(--primary-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-100)" }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
            <span style={{ fontWeight: 600 }}>
              {form.published ? "Published (visible to everyone)" : "Draft (hidden from public)"}
            </span>
          </label>
        </div>
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.75rem", color: "#DC2626", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><IconInfo /> {error}</div>}
      {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "0.75rem", color: "#16A34A", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><IconCheck /> {success}</div>}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="submit" className="btn-primary" disabled={saving || uploading} style={{ padding: "0.75rem 2rem" }}>
          {saving ? "Saving..." : mode === "edit" ? "Update Post" : "Create Post"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push("/admin/blog")}>Cancel</button>
      </div>
    </form>
  );
}
