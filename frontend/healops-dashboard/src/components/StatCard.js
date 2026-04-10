export function StatCard({ label, value, note, icon, accent }) {
  return `
    <div class="soft-card rounded-xl2 bg-white p-5">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm font-semibold text-slate-500">${label}</span>
        <div class="rounded-xl bg-${accent}-50 p-2 text-${accent}-600">${icon}</div>
      </div>
      <div class="text-3xl font-extrabold tracking-tight text-slate-900">${value}</div>
      <div class="mt-2 text-xs font-medium text-slate-500">${note}</div>
    </div>
  `;
}
