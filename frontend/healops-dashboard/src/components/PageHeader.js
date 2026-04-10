export function pageHeader({ title, subtitle, buttonLabel = "", buttonId = "" }) {
  return `
    <section class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">${title}</h1>
        <p class="mt-1 text-sm text-slate-500">${subtitle}</p>
      </div>
      ${
        buttonLabel
          ? `<button id="${buttonId}" class="rounded-xl2 bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">${buttonLabel}</button>`
          : ""
      }
    </section>
  `;
}
