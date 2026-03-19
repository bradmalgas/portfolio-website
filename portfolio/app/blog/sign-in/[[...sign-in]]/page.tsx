import { SignIn } from "@clerk/nextjs";

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
                  colorBackground: "rgb(22,22,31)",
                  colorPrimary: "rgb(124,110,255)",
                  colorText: "rgb(237,238,245)",
                  colorTextSecondary: "rgb(136,136,168)",
                  colorNeutral: "rgb(34,34,46)",
                  colorInputBackground: "rgb(17,17,25)",
                  colorInputText: "rgb(237,238,245)",
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
