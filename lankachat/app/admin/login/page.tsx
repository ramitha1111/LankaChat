"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A, #1E3A5F)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card animate-fade" style={{ width: "100%", maxWidth: 420, padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #2563EB, #06B6D4)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.25rem", color: "white", margin: "0 auto 1rem" }}>LC</div>
          <h1 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.25rem" }}>Admin Login</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>LankaChat Control Panel</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Email Address</label>
            <input className="input" type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.75rem", color: "#DC2626", fontSize: "0.85rem" }}>
              ❌ {error}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
            {loading ? "Signing in..." : "🔐 Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.78rem", marginTop: "1.5rem" }}>
          Admin access only. Create your account in the Supabase dashboard.
        </p>
      </div>
    </div>
  );
}
