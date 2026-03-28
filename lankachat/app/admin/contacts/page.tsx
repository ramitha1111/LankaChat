import { createAdminClient, createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const formatDate = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const service = createServiceRoleClient();
  const { data, error } = await service
    .from("contacts")
    .select("id,name,email,message,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const contacts: Contact[] = data ?? [];
  const fetchError = error?.message || "";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "2rem" }}>Contact Requests</h1>
          <p style={{ color: "var(--text-muted)" }}>Latest 100 submissions from the contact form.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem", overflowX: "auto" }}>
        {fetchError && <p style={{ color: "var(--error)", marginBottom: "0.75rem" }}>{fetchError}</p>}
        {contacts.length === 0 && !fetchError ? (
          <p style={{ color: "var(--text-muted)" }}>No contact submissions yet.</p>
        ) : (!fetchError && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                <th style={{ padding: "0.75rem" }}>Name</th>
                <th style={{ padding: "0.75rem" }}>Email</th>
                <th style={{ padding: "0.75rem" }}>Message</th>
                <th style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <a href={`mailto:${c.email}`} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>{c.email}</a>
                  </td>
                  <td style={{ padding: "0.75rem", maxWidth: 420 }}>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{c.message}</p>
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}
