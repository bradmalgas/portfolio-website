export default function BlogLoading() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-4">
          <div className="h-4 w-24 rounded-full bg-surface-raised" />
          <div className="h-12 w-80 rounded bg-surface-raised" />
          <div className="h-5 w-full max-w-2xl rounded bg-surface-raised" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card overflow-hidden p-6 shadow-inner-highlight">
              <div className="aspect-[16/9] rounded-md bg-surface" />
              <div className="mt-6 space-y-4">
                <div className="h-6 w-24 rounded bg-surface" />
                <div className="h-8 w-4/5 rounded bg-surface" />
                <div className="h-4 w-full rounded bg-surface" />
                <div className="h-4 w-2/3 rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
