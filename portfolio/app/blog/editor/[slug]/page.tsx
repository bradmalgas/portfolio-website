import { redirect } from "next/navigation";

import EditorForm from "@/app/components/blog/EditorForm";
import { getAdminAccess } from "@/lib/blog/auth";
import { getAdminPostBySlug, getAllCategoriesForEditor } from "@/lib/blog/data";
import { serialisePostForEditor } from "@/lib/blog/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface BlogEditorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogEditorPage({ params }: BlogEditorPageProps) {
  const { userId, isAdmin } = await getAdminAccess();

  if (!userId) {
    redirect("/blog/sign-in");
  }

  if (!isAdmin) {
    return (
      <section className="section-padding">
        <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
          <span className="eyebrow">Blog Admin</span>
          <h1 className="mt-2 text-h2 font-semibold text-ink">Unauthorised</h1>
          <div className="section-rule mx-auto" />
          <p className="text-body text-ink-secondary">
            Your account is signed in, but it is not configured as the blog admin.
          </p>
        </div>
      </section>
    );
  }

  const { slug } = await params;
  const isNew = slug === "new";

  const [categories, post] = await Promise.all([
    getAllCategoriesForEditor(),
    isNew ? Promise.resolve(null) : getAdminPostBySlug(slug),
  ]);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <EditorForm initialPost={serialisePostForEditor(post)} categories={categories} />
      </div>
    </section>
  );
}
