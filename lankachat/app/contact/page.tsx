"use client";
import { useState } from "react";

const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 5.5-9 12-9 12S3 15.5 3 10a9 9 0 1 1 18 0Z" />
    <path d="M12 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
  </svg>
);

const IconCheck = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div style={{ padding: "3rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        {/* Info */}
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem" }}>Get In Touch</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Have a question, feedback, or want to collaborate? Reach out — we read every message.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { icon: <IconChat />, title: "Live Chat", desc: "Jump into LankaChat for instant replies", link: "/chat", linkText: "Open Chat" },
              { icon: <IconMail />, title: "Email", desc: "hello@lankachat.lk", link: "mailto:hello@lankachat.lk", linkText: "Send Email" },
              { icon: <IconPin />, title: "Based In", desc: "Sri Lanka", link: null, linkText: null },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "1.5rem", color: "var(--primary)" }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{item.desc}</p>
                  {item.link && <a href={item.link} style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none", marginTop: "0.25rem", display: "inline-block" }}>{item.linkText}</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: "2.5rem" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--primary)" }}><IconCheck /></div>
              <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Message Sent!</h2>
              <p style={{ color: "var(--text-muted)" }}>We''ll get back to you soon.</p>
              <button onClick={() => setStatus("idle")} className="btn-primary" style={{ marginTop: "1.5rem" }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "1.75rem" }}>Send a Message</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Full Name<span style={{ color: "var(--error)" }}>*</span></label>
                  <input className="input" type="text" placeholder="Kasun Perera" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Email Address<span style={{ color: "var(--error)" }}>*</span></label>
                  <input className="input" type="email" placeholder="kasun@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Message<span style={{ color: "var(--error)" }}>*</span></label>
                  <textarea className="input" placeholder="Your message..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required style={{ resize: "vertical", minHeight: 120 }} />
                </div>
                {error && <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>{error}</p>}
                <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
