import { pageHeader } from "../components/PageHeader.js";
import { statusBadge } from "../components/StatusBadge.js";

export function appointmentsPage({ appointments, searchQuery }) {
  const q = searchQuery.trim().toLowerCase();
  const rows = q
    ? appointments.filter(
        (item) => item.patient.toLowerCase().includes(q) || item.status.toLowerCase().includes(q)
      )
    : appointments;

  return `
    ${pageHeader({
      title: "Appointments",
      subtitle: "Track schedules and appointment status",
      buttonLabel: "Add Appointment",
      buttonId: "addAppointment"
    })}

    <section class="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
      <article class="soft-card rounded-xl2 bg-white p-5">
        <h3 class="text-base font-bold text-slate-900">Calendar</h3>
        <div class="mt-4 rounded-xl2 border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-700">April 2026</p>
          <p class="mt-2 text-sm text-slate-500">10, 11, 12 have active slots</p>
        </div>
      </article>

      <article class="soft-card scroll-slim overflow-auto rounded-xl2 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-3">Patient</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Time</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (item) => `
                  <tr class="border-b border-slate-100">
                    <td class="px-4 py-4 font-semibold text-slate-900">${item.patient}</td>
                    <td class="px-4 py-4 text-slate-600">${item.date}</td>
                    <td class="px-4 py-4 text-slate-600">${item.time}</td>
                    <td class="px-4 py-4">${statusBadge(item.status)}</td>
                  </tr>
                `
                    )
                    .join("")
                : "<tr><td colspan='4' class='px-4 py-8 text-center text-slate-500'>No appointments found.</td></tr>"
            }
          </tbody>
        </table>
      </article>
    </section>
  `;
}
