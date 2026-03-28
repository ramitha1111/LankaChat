import { createAdminClient } from "@/lib/supabase/server";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog | LankaChat",
  description: "Tips, updates and stories from the LankaChat team.",
};

export default async function BlogPage() {
  const supabase = await createAdminClient();
  const { data: posts } = await supabase.from("posts").select("id,title,slug,excerpt,cover_image_url,created_at").eq("published", true).order("created_at", { ascending: false });

  return (
    <div style={{ padding: "3rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.75rem" }}>Blog</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>
          Tips, news and stories from the LankaChat community.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-light)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>—</div>
          <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {posts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
