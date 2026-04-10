import { api, getToken, setBaseUrl, setToken } from "./services/api.js";
import { sidebar } from "./layout/Sidebar.js";
import { topbar } from "./layout/Topbar.js";
import { dashboardPage } from "./pages/dashboardPage.js";
import { patientsPage } from "./pages/patientsPage.js";
import { appointmentsPage } from "./pages/appointmentsPage.js";
import { tasksPage } from "./pages/tasksPage.js";
import { profilePage } from "./pages/profilePage.js";
import { authPage } from "./pages/authPage.js";

function readLocalTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem("healops.tasks") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalTasks(tasks) {
  localStorage.setItem("healops.tasks", JSON.stringify(tasks));
}

const state = {
  isAuthenticated: Boolean(getToken()),
  activePage: "dashboard",
  searchQuery: "",
  sidebarOpen: false,
  tasks: readLocalTasks(),
  activity: [],
  loadingAuth: false,
  authError: "",
  authMode: "login",
  user: {
    name: "",
    role: "",
    email: "",
    hospital: "",
    avatar: "H"
  },
  patients: [],
  appointments: [],
  apiError: ""
};

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function contentForPage() {
  const payload = {
    patients: state.patients,
    appointments: state.appointments,
    activity: state.activity,
    user: state.user,
    searchQuery: state.searchQuery,
    tasks: state.tasks
  };

  if (state.activePage === "patients") return patientsPage(payload);
  if (state.activePage === "appointments") return appointmentsPage(payload);
  if (state.activePage === "tasks") return tasksPage(payload);
  if (state.activePage === "profile") return profilePage(payload);
  return dashboardPage(payload);
}

async function syncDataFromApi() {
  state.apiError = "";
  const [meResult, patientsResult, appointmentsResult] = await Promise.allSettled([
    api.me(),
    api.getPatients(),
    api.getAppointments()
  ]);

  const errors = [];

  if (meResult.status === "fulfilled") {
    const me = meResult.value;
    state.user = {
      ...state.user,
      name: me.username || me.email,
      role: me.role || "staff",
      email: me.email || state.user.email,
      avatar: initials(me.username || me.email || "H")
    };
  } else {
    errors.push(meResult.reason?.message || "Failed to load user profile");
  }

  if (patientsResult.status === "fulfilled") {
    const patientsResp = patientsResult.value;
    state.patients = (patientsResp || []).map((item) => {
      const birthYear = new Date(item.date_of_birth).getFullYear();
      const currentYear = new Date().getFullYear();
      return {
        id: item.id,
        name: `${item.first_name} ${item.last_name}`.trim(),
        age: Number.isNaN(birthYear) ? "-" : currentYear - birthYear,
        condition: item.insurance_provider || "General",
        updatedAt: item.updated_at ? new Date(item.updated_at).toLocaleString() : "-",
        raw: item
      };
    });
  } else {
    errors.push(patientsResult.reason?.message || "Failed to load patients");
    state.patients = [];
  }

  if (appointmentsResult.status === "fulfilled") {
    const appointmentsResp = appointmentsResult.value;
    state.appointments = (appointmentsResp || []).map((item) => ({
      id: item.id,
      patient: item.patient_name || `Patient #${item.patient_id}`,
      doctor: item.doctor_name || `Doctor #${item.doctor_id}`,
      date: item.start_time ? new Date(item.start_time).toISOString().slice(0, 10) : "-",
      time: item.start_time
        ? new Date(item.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-",
      status: item.status ? item.status[0].toUpperCase() + item.status.slice(1) : "Upcoming"
    }));
  } else {
    errors.push(appointmentsResult.reason?.message || "Failed to load appointments");
    state.appointments = [];
  }

  const recentPatients = state.patients.slice(0, 3).map((item) => `Patient record active: ${item.name}`);
  const recentAppointments = state.appointments.slice(0, 3).map(
    (item) => `Appointment ${item.status.toLowerCase()}: ${item.patient} at ${item.time}`
  );
  state.activity = [...recentAppointments, ...recentPatients];

  state.apiError = errors.length ? `API sync issues: ${errors.join(" | ")}` : "";
}

function render() {
  const app = document.querySelector("#app");

  if (!state.isAuthenticated) {
    app.innerHTML = authPage({
      mode: state.authMode,
      loading: state.loadingAuth,
      error: state.authError,
      apiBaseUrl: api.getBaseUrl()
    });
    wireEvents();
    return;
  }

  app.innerHTML = `
    <div class="min-h-screen bg-slate-50 text-slate-800">
      <div class="${state.sidebarOpen ? "block" : "hidden"} fixed inset-0 z-20 bg-slate-900/30 md:hidden" id="sidebarOverlay"></div>
      ${sidebar(state.activePage, state.sidebarOpen)}
      <div class="min-h-screen md:ml-72">
        ${topbar({ searchQuery: state.searchQuery, userInitials: initials(state.user.name || "HealOps") })}
        <main class="fade-in p-4 md:p-8">
          ${
            state.apiError
              ? `<p class="mb-4 rounded-xl2 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">${state.apiError}</p>`
              : ""
          }
          ${contentForPage()}
        </main>
      </div>
    </div>
  `;

  wireEvents();
}

function wireEvents() {
  const apiUrlInput = document.querySelector("#apiBaseUrl");
  if (apiUrlInput) {
    apiUrlInput.addEventListener("change", () => {
      setBaseUrl(apiUrlInput.value.trim() || "http://localhost:8000");
    });
  }

  const switchLogin = document.querySelector("#switchLogin");
  if (switchLogin) {
    switchLogin.addEventListener("click", () => {
      state.authMode = "login";
      state.authError = "";
      render();
    });
  }

  const switchSignup = document.querySelector("#switchSignup");
  if (switchSignup) {
    switchSignup.addEventListener("click", () => {
      state.authMode = "signup";
      state.authError = "";
      render();
    });
  }

  const authForm = document.querySelector("#authForm");
  if (authForm) {
    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.querySelector("#authEmail").value.trim();
      const password = document.querySelector("#authPassword").value;
      const username = document.querySelector("#signupUsername")?.value.trim();
      const role = document.querySelector("#signupRole")?.value;

      state.loadingAuth = true;
      state.authError = "";
      render();

      try {
        if (state.authMode === "signup") {
          await api.register({ email, username, password, role });
        }

        const loginResp = await api.login(email, password);
        setToken(loginResp.access_token);
        state.isAuthenticated = true;
        state.loadingAuth = false;
        await syncDataFromApi();
        render();
      } catch (error) {
        state.loadingAuth = false;
        state.authError = error.message || "Authentication failed";
        render();
      }
    });
  }

  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePage = button.getAttribute("data-nav");
      state.sidebarOpen = false;
      render();
    });
  });

  const search = document.querySelector("#globalSearch");
  if (search) {
    search.addEventListener("input", (event) => {
      state.searchQuery = event.target.value;
      render();
    });
  }

  const toggleSidebar = document.querySelector("#toggleSidebar");
  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
      state.sidebarOpen = !state.sidebarOpen;
      render();
    });
  }

  const overlay = document.querySelector("#sidebarOverlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      state.sidebarOpen = false;
      render();
    });
  }

  document.querySelectorAll("[data-task-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      const taskId = Number(input.getAttribute("data-task-toggle"));
      state.tasks = state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: input.checked ? "Done" : "Pending" }
          : task
      );
      saveLocalTasks(state.tasks);
      render();
    });
  });

  const addTask = document.querySelector("#addTask");
  if (addTask) {
    addTask.addEventListener("click", () => {
      const title = window.prompt("Task title");
      if (!title) return;
      state.tasks.unshift({ id: Date.now(), title, status: "Pending" });
      saveLocalTasks(state.tasks);
      render();
    });
  }

  const addPatient = document.querySelector("#addPatient");
  if (addPatient) {
    addPatient.addEventListener("click", async () => {
      const firstName = window.prompt("First name");
      if (!firstName) return;
      const lastName = window.prompt("Last name") || "-";
      const email = window.prompt("Email") || "";
      const dateOfBirth = window.prompt("Date of birth (YYYY-MM-DD)") || "1990-01-01";
      const phone = window.prompt("Phone") || "N/A";
      const address = window.prompt("Address") || "N/A";
      const insuranceProvider = window.prompt("Condition/insurance") || "General";

      try {
        await api.createPatient({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          email,
          phone,
          address,
          insurance_provider: insuranceProvider,
          insurance_id: "N/A"
        });
        await syncDataFromApi();
        render();
      } catch (error) {
        window.alert(error.message);
      }
    });
  }

  const addAppointment = document.querySelector("#addAppointment");
  if (addAppointment) {
    addAppointment.addEventListener("click", async () => {
      try {
        const doctors = await api.getDoctors();
        const patientId = Number(window.prompt("Patient ID"));
        const doctorHint = doctors.length
          ? `Available doctor IDs: ${doctors.map((d) => d.id).join(", ")}`
          : "Enter doctor ID";
        const doctorId = Number(window.prompt(doctorHint));
        const startTime = window.prompt("Start datetime (YYYY-MM-DDTHH:mm:ss)");
        const endTime = window.prompt("End datetime (YYYY-MM-DDTHH:mm:ss)");
        if (!patientId || !doctorId || !startTime || !endTime) return;

        await api.createAppointment({
          patient_id: patientId,
          doctor_id: doctorId,
          start_time: startTime,
          end_time: endTime,
          status: "scheduled",
          notes: "Created from HealOps SaaS dashboard"
        });

        await syncDataFromApi();
        render();
      } catch (error) {
        window.alert(error.message);
      }
    });
  }

  const logoutButton = document.querySelector("#logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      setToken("");
      state.isAuthenticated = false;
      state.authMode = "login";
      state.authError = "";
      state.user = { name: "", role: "", email: "", hospital: "", avatar: "H" };
      state.patients = [];
      state.appointments = [];
      state.activity = [];
      state.apiError = "";
      render();
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.getAttribute("data-action");
      const id = button.getAttribute("data-id");

      if (action === "delete-patient") {
        if (!window.confirm("Delete this patient?")) return;
        try {
          await api.deletePatient(Number(id));
          await syncDataFromApi();
          render();
        } catch (error) {
          window.alert(error.message);
        }
        return;
      }

      if (action === "edit-patient") {
        const existing = state.patients.find((item) => String(item.id) === String(id));
        if (!existing?.raw) {
          window.alert("Cannot edit this row right now.");
          return;
        }

        const firstName = window.prompt("First name", existing.raw.first_name || "");
        if (!firstName) return;

        const payload = {
          first_name: firstName,
          last_name: window.prompt("Last name", existing.raw.last_name || "") || "",
          phone: window.prompt("Phone", existing.raw.phone || "") || "",
          address: window.prompt("Address", existing.raw.address || "") || "",
          insurance_provider:
            window.prompt("Condition/insurance", existing.raw.insurance_provider || "") || "",
          insurance_id: existing.raw.insurance_id || "N/A"
        };

        try {
          await api.updatePatient(Number(id), payload);
          await syncDataFromApi();
          render();
        } catch (error) {
          window.alert(error.message);
        }
        return;
      }

      if (action === "view-patient") {
        const existing = state.patients.find((item) => String(item.id) === String(id));
        const details = existing?.raw
          ? `${existing.name}\nEmail: ${existing.raw.email}\nPhone: ${existing.raw.phone}\nAddress: ${existing.raw.address}`
          : `Patient ID ${id}`;
        window.alert(details);
        return;
      }

      window.alert(`${action.replace("-", " ")} for patient ID ${id}`);
    });
  });
}

async function bootstrap() {
  if (state.isAuthenticated) {
    await syncDataFromApi();
  }
  render();
}

bootstrap();
