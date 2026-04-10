import { pageHeader } from "../components/PageHeader.js";
import { statusBadge } from "../components/StatusBadge.js";

export function tasksPage({ tasks, searchQuery }) {
  const q = searchQuery.trim().toLowerCase();
  const rows = q ? tasks.filter((task) => task.title.toLowerCase().includes(q)) : tasks;

  return `
    ${pageHeader({
      title: "Tasks",
      subtitle: "Coordinate internal operations and follow-ups",
      buttonLabel: "Add Task",
      buttonId: "addTask"
    })}

    <section class="space-y-3">
      ${
        rows.length
          ? rows
              .map(
                (task) => `
            <article class="soft-card rounded-xl2 bg-white p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    data-task-toggle="${task.id}"
                    ${task.status === "Done" ? "checked" : ""}
                    class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <p class="text-sm font-semibold text-slate-800 ${
                    task.status === "Done" ? "line-through text-slate-400" : ""
                  }">${task.title}</p>
                </div>
                ${statusBadge(task.status)}
              </div>
            </article>
          `
              )
              .join("")
          : "<p class='rounded-xl2 bg-white p-6 text-sm text-slate-500 soft-card'>No tasks found.</p>"
      }
    </section>
  `;
}
