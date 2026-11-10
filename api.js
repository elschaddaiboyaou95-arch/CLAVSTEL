// Couche d'acces a l'API Spring Boot (JWT envoye dans l'en-tete Authorization)
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
}
export const saveAuth = (data) => localStorage.setItem("auth", JSON.stringify(data));
export const clearAuth = () => localStorage.removeItem("auth");

async function request(path, options = {}) {
  const auth = getAuth();
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
  });
  if (res.status === 401 && path !== "/auth/login") {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Session expirée, veuillez vous reconnecter");
  }
  if (!res.ok) {
    let message = "Une erreur est survenue";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch { /* corps vide */ }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  login: (creds) => request("/auth/login", json("POST", creds)),
  clients: {
    list: (q = "") => request(`/clients?q=${encodeURIComponent(q)}`),
    create: (c) => request("/clients", json("POST", c)),
    update: (id, c) => request(`/clients/${id}`, json("PUT", c)),
    remove: (id) => request(`/clients/${id}`, { method: "DELETE" }),
  },
  factures: {
    list: (q = "") => request(`/factures?q=${encodeURIComponent(q)}`),
    create: (f) => request("/factures", json("POST", f)),
    update: (id, f) => request(`/factures/${id}`, json("PUT", f)),
    remove: (id) => request(`/factures/${id}`, { method: "DELETE" }),
    mine: () => request("/factures/mes-factures"),
  },
};

export const formatMoney = (n) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
