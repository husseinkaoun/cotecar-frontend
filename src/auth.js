import { apiFetch } from "./api";

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.token);
  return data.token;
}

export async function me() {
  return apiFetch("/auth/me");
}

export function logout() {
  localStorage.removeItem("token");
}
