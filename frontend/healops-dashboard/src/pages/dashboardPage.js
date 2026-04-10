import { StatCard } from "../components/StatCard.js";
import { pageHeader } from "../components/PageHeader.js";

export function dashboardPage({ patients, appointments, tasks, activity, searchQuery }) {
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((item) => item.date === today).length;
  const completedAppointments = appointments.filter((item) =>
    String(item.status).toLowerCase().includes("completed")
  ).length;
  const completionRate = appointments.length
    ? `${Math.round((completedAppointments / appointments.length) * 100)}%`
    : "0%";
  const nextAppointment = appointments.find((item) => item.date >= today);

  const q = searchQuery.trim().toLowerCase();
  const visibleActivity = q
    ? activity.filter((item) => item.toLowerCase().includes(q))
    : activity;

  return `
    ${pageHeader({
      title: "Dashboard",
      subtitle: "Operational snapshot for your healthcare team"
    })}

    <section class="grid gap-4 md:grid-cols-3">
      ${StatCard({
        label: "Total Patients",
        value: String(patients.length),
        note: "Active records",
        icon: "<span aria-hidden='true'>+</span>",
        accent: "blue"
      })}
      ${StatCard({
        label: "Appointments Today",
        value: String(todaysAppointments),
        note: "Across all departments",
        icon: "<span aria-hidden='true'>#</span>",
        accent: "emerald"
      })}
      ${StatCard({
        label: "Pending Tasks",
        value: String(pendingTasks),
        note: "Needs attention",
        icon: "<span aria-hidden='true'>!</span>",
        accent: "amber"
      })}
    </section>

    <section class="mt-6 grid gap-4 lg:grid-cols-3">
      <article class="soft-card rounded-xl2 bg-white p-5 lg:col-span-2">
        <h3 class="text-base font-bold text-slate-900">Recent Activity</h3>
        <div class="mt-3 space-y-3">
          ${
            visibleActivity.length
              ? visibleActivity
                  .map(
                    (item) => `
                <div class="rounded-xl2 border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-600">${item}</div>
              `
                  )
                  .join("")
              : "<p class='text-sm text-slate-500'>No activity found for your search.</p>"
          }
        </div>
      </article>

      <article class="soft-card rounded-xl2 bg-white p-5">
        <h3 class="text-base font-bold text-slate-900">Quick Insights</h3>
        <div class="mt-3 space-y-3 text-sm">
          <div class="rounded-xl2 border border-slate-200 p-3">
            <p class="font-semibold text-slate-900">Completion Rate</p>
            <p class="text-slate-500">${completionRate}</p>
          </div>
          <div class="rounded-xl2 border border-slate-200 p-3">
            <p class="font-semibold text-slate-900">Next Appointment</p>
            <p class="text-slate-500">${nextAppointment ? `${nextAppointment.patient} at ${nextAppointment.time}` : "No upcoming appointments"}</p>
          </div>
          <div class="rounded-xl2 border border-slate-200 p-3">
            <p class="font-semibold text-slate-900">Registered Patients</p>
            <p class="text-slate-500">${patients.length}</p>
          </div>
        </div>
      </article>
    </section>
  `;
}
