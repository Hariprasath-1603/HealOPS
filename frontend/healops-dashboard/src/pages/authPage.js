export function authPage({ mode = "login", loading = false, error = "", apiBaseUrl }) {
  const isLogin = mode === "login";

  return `
    <div class="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 via-white to-brand-50 p-4">
      <section class="soft-card w-full max-w-md rounded-xl2 bg-white p-6 md:p-8">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-xl2 bg-brand-600 text-xl font-extrabold text-white">H</div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">HealOps</h1>
          <p class="mt-1 text-sm text-slate-500">Healthcare SaaS Control Panel</p>
        </div>

        <div class="mb-4 rounded-xl2 border border-slate-200 bg-slate-50 p-3">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Backend URL</label>
          <input id="apiBaseUrl" value="${apiBaseUrl}" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>

        <div class="mb-4 flex rounded-xl2 bg-slate-100 p-1">
          <button id="switchLogin" class="flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
            isLogin ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"
          }">Login</button>
          <button id="switchSignup" class="flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
            !isLogin ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"
          }">Sign Up</button>
        </div>

        <form id="authForm" class="space-y-3">
          ${
            !isLogin
              ? "<input id='signupUsername' required placeholder='Full name / username' class='w-full rounded-xl2 border border-slate-200 px-3 py-2.5 text-sm' />"
              : ""
          }
          <input id="authEmail" type="email" required placeholder="Email" class="w-full rounded-xl2 border border-slate-200 px-3 py-2.5 text-sm" />
          <input id="authPassword" type="password" required placeholder="Password" class="w-full rounded-xl2 border border-slate-200 px-3 py-2.5 text-sm" />
          ${
            !isLogin
              ? "<select id='signupRole' class='w-full rounded-xl2 border border-slate-200 px-3 py-2.5 text-sm'><option value='staff'>Staff</option><option value='doctor'>Doctor</option><option value='admin'>Admin</option><option value='patient'>Patient</option></select>"
              : ""
          }
          <button ${
            loading ? "disabled" : ""
          } class="w-full rounded-xl2 bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
            ${loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        ${
          error
            ? `<p class="mt-3 rounded-xl2 border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${error}</p>`
            : ""
        }
      </section>
    </div>
  `;
}
