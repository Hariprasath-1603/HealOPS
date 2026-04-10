import { pageHeader } from "../components/PageHeader.js";

export function patientsPage({ patients, searchQuery }) {
  const q = searchQuery.trim().toLowerCase();
  const rows = q
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(q) || patient.condition.toLowerCase().includes(q)
      )
    : patients;

  return `
    ${pageHeader({
      title: "Patients",
      subtitle: "Manage and track patient records",
      buttonLabel: "Add Patient",
      buttonId: "addPatient"
    })}

    <section class="soft-card scroll-slim overflow-auto rounded-xl2 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Age</th>
            <th class="px-4 py-3">Condition</th>
            <th class="px-4 py-3">Last Update</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            rows.length
              ? rows
                  .map(
                    (patient) => `
                <tr class="border-b border-slate-100">
                  <td class="px-4 py-4 font-semibold text-slate-900">${patient.name}</td>
                  <td class="px-4 py-4 text-slate-600">${patient.age}</td>
                  <td class="px-4 py-4 text-slate-600">${patient.condition}</td>
                  <td class="px-4 py-4 text-slate-500">${patient.updatedAt}</td>
                  <td class="px-4 py-4">
                    <div class="flex gap-2">
                      <button data-action="view-patient" data-id="${patient.id}" class="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">View</button>
                      <button data-action="edit-patient" data-id="${patient.id}" class="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700">Edit</button>
                      <button data-action="delete-patient" data-id="${patient.id}" class="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                    </div>
                  </td>
                </tr>
              `
                  )
                  .join("")
              : "<tr><td colspan='5' class='px-4 py-8 text-center text-slate-500'>No patients found.</td></tr>"
          }
        </tbody>
      </table>
    </section>
  `;
}
