import { SignIn } from "@clerk/nextjs";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogSignInPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-8 shadow-inner-highlight">
            <span className="eyebrow">Blog Admin</span>
            <h1 className="mt-2 text-h2 font-semibold text-ink">Sign in to edit posts</h1>
            <div className="section-rule" />
            <p className="text-body text-ink-secondary">
              This editor is only for the configured admin user. Public blog pages stay open to everyone.
            </p>
          </div>

          <div className="card flex justify-center p-6 shadow-inner-highlight">
            <SignIn
              routing="path"
              path="/blog/sign-in"
              signInUrl="/blog/sign-in"
              fallbackRedirectUrl="/blog/editor"
              appearance={{
                variables: {
                  colorBackground: "rgb(var(--color-surface-raised-rgb))",
                  colorPrimary: "rgb(var(--color-accent-rgb))",
                  colorText: "rgb(var(--color-ink-rgb))",
                  colorTextSecondary: "rgb(var(--color-ink-secondary-rgb))",
                  colorNeutral: "rgb(var(--color-border-rgb))",
                  colorInputBackground: "rgb(var(--color-surface-rgb))",
                  colorInputText: "rgb(var(--color-ink-rgb))",
                },
                elements: {
                  card: "shadow-none bg-transparent",
                  formButtonPrimary: "bg-accent hover:bg-accent-hover text-white shadow-glow",
                  footerActionLink: "text-accent hover:text-accent-hover",
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
