import Link from "next/link";
import { forbidden, redirect } from "next/navigation";

import DeletePostButton from "@/app/components/blog/DeletePostButton";
import FadeIn from "@/app/components/ui/FadeIn";
import { getAdminAccess } from "@/lib/blog/auth";
import { getAdminPosts } from "@/lib/blog/data";
import { formatDate } from "@/lib/blog/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BlogEditorIndexPage() {
  const { userId, isAdmin } = await getAdminAccess();

  if (!userId) {
    redirect("/blog/sign-in");
  }

  if (!isAdmin) {
    forbidden();
  }

  const posts = await getAdminPosts();

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Blog Admin</span>
              <h1 className="mt-2 text-h1 font-bold text-ink">Manage posts</h1>
              <div className="section-rule" />
              <p className="text-body-lg text-ink-secondary">
                Review drafts, update published articles, and start a new post.
              </p>
            </div>
            <Link href="/blog/editor/new" className="btn-accent text-sm">
              New Post
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={80} className="mt-12">
          <div className="card overflow-hidden shadow-inner-highlight">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-surface">
                  <tr className="text-left text-xs uppercase tracking-widest text-ink-tertiary">
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Published</th>
                    <th className="px-5 py-4">Views</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map((post) => (
                    <tr key={post.id} className="text-body text-ink-secondary">
                      <td className="px-5 py-4">
                        <Link
                          href={`/blog/editor/${post.slug}`}
                          className="font-medium text-ink transition-colors duration-250 hover:text-accent-hover"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="tag">{post.status}</span>
                      </td>
                      <td className="px-5 py-4">{post.category}</td>
                      <td className="px-5 py-4">{formatDate(post.published_at) ?? "Draft"}</td>
                      <td className="px-5 py-4">{post.view_count}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/blog/editor/${post.slug}`}
                            className="text-body-sm text-ink transition-colors duration-250 hover:text-accent-hover"
                          >
                            Edit
                          </Link>
                          <DeletePostButton slug={post.slug} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
