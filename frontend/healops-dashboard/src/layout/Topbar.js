export function topbar({ searchQuery, userInitials }) {
  return `
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
      <div class="flex items-center gap-3">
        <button id="toggleSidebar" class="rounded-xl2 border border-slate-200 p-2 text-slate-600 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div class="relative max-w-lg flex-1">
          <input
            id="globalSearch"
            value="${searchQuery}"
            placeholder="Search patients, appointments, tasks..."
            class="w-full rounded-xl2 border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none ring-brand-100 transition focus:ring"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.3-4.3"></path>
          </svg>
        </div>
        <button class="rounded-xl2 border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"></path>
            <path d="M9 17a3 3 0 0 0 6 0"></path>
          </svg>
        </button>
        <div class="grid h-10 w-10 place-content-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">${userInitials}</div>
      </div>
    </header>
  `;
}
