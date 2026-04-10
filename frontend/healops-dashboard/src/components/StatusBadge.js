const map = {
  Upcoming: "bg-brand-50 text-brand-700 border border-brand-100",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-100",
  Scheduled: "bg-brand-50 text-brand-700 border border-brand-100",
  Confirmed: "bg-cyan-50 text-cyan-700 border border-cyan-100",
  "No_show": "bg-slate-100 text-slate-700 border border-slate-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Done: "bg-emerald-50 text-emerald-700 border border-emerald-100"
};

export function statusBadge(status) {
  const className = map[status] ?? "bg-slate-100 text-slate-700 border border-slate-200";
  return `<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}">${status}</span>`;
}
