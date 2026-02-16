import { apiFetch } from "../api";

export async function getMe() {
  return apiFetch("/auth/me");
}
