function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:px-10">
        <header className="flex items-center justify-between">
          <p className="text-lg font-semibold tracking-tight">Rise</p>
          <a
            href="#contact"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Contact
          </a>
        </header>

        <main className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-2">
          <section className="space-y-6">
            <p className="inline-block rounded-full border border-cyan-700/50 bg-cyan-900/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
              React + Tailwind
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Build faster with a clean, modern starting point.
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              This site is ready for your content, product, or portfolio.
              Tailwind is configured and the layout is responsive out of the
              box.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#start"
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Get Started
              </a>
              <a
                href="#learn"
                className="rounded-full border border-slate-700 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Learn More
              </a>
            </div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-900/20">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Performance</p>
              <p className="mt-1 text-2xl font-semibold">Fast by default</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Styling</p>
              <p className="mt-1 text-2xl font-semibold">Tailwind v4 ready</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Stack</p>
              <p className="mt-1 text-2xl font-semibold">Vite + React + TS</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
