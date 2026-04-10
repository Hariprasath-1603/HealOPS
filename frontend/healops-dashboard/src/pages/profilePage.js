import { pageHeader } from "../components/PageHeader.js";

export function profilePage({ user }) {
  return `
    ${pageHeader({ title: "Profile", subtitle: "Personal details and account settings" })}

    <section class="max-w-xl">
      <article class="soft-card rounded-xl2 bg-white p-6">
        <div class="mb-5 flex items-center gap-4">
          <div class="grid h-14 w-14 place-content-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
            ${user.avatar}
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">${user.name}</h3>
            <p class="text-sm text-slate-500">${user.role}</p>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="rounded-xl2 border border-slate-200 p-3">
            <p class="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p class="mt-1 font-semibold text-slate-800">${user.email}</p>
          </div>
          <div class="rounded-xl2 border border-slate-200 p-3">
            <p class="text-xs uppercase tracking-wide text-slate-500">Hospital</p>
            <p class="mt-1 font-semibold text-slate-800">${user.hospital}</p>
          </div>
        </div>

        <button id="logoutButton" class="mt-5 rounded-xl2 bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">
          Logout
        </button>
      </article>
    </section>
  `;
}
