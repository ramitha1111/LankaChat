"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className="btn-secondary" style={{ color: "var(--error)", borderColor: "var(--error)" }}>
      Sign Out
    </button>
  );
}
