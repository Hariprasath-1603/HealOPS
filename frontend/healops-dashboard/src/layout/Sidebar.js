const menuItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "patients", label: "Patients" },
  { key: "appointments", label: "Appointments" },
  { key: "tasks", label: "Tasks" },
  { key: "profile", label: "Profile" }
];

export function sidebar(activePage, isOpen) {
  const itemMarkup = menuItems
    .map((item) => {
      const active = item.key === activePage;
      return `
        <button
          data-nav="${item.key}"
          class="w-full rounded-xl2 px-3 py-2.5 text-left text-sm font-semibold transition ${
            active
              ? "bg-brand-50 text-brand-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
          }"
        >
          ${item.label}
        </button>
      `;
    })
    .join("");

  return `
    <aside class="fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white p-5 transition duration-200 md:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }">
      <div class="mb-8 flex items-center gap-3">
        <div class="grid h-10 w-10 place-content-center rounded-xl2 bg-brand-600 text-lg font-extrabold text-white">H</div>
        <div>
          <div class="text-lg font-extrabold tracking-tight text-slate-900">HealOps</div>
          <div class="text-xs text-slate-500">Healthcare Command Center</div>
        </div>
      </div>
      <nav class="space-y-1">${itemMarkup}</nav>
    </aside>
  `;
}
