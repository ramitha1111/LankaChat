import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Blog Post - LankaChat",
  description: "Read our latest blog posts.",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceRoleClient();
  const { data: post } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single();

  if (!post) {
    return (
      <div style={{ padding: "3rem 1.5rem", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>Post not found</h1>
        <Link href="/blog" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/blog" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          ← Back to Blog
        </Link>

        <article>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            Published on {formatDate(post.created_at)}
          </p>

          {post.cover_image_url && (
            <div style={{ position: "relative", height: 400, marginBottom: "2rem", borderRadius: 12, overflow: "hidden" }}>
              <Image src={post.cover_image_url} alt={post.title} fill style={{ objectFit: "cover" }} />
            </div>
          )}

          <div className="prose" style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text)" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/blog" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>← Back to Blog</Link>
        </div>
      </div>
    </div>
  );
}
