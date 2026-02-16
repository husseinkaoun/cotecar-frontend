// ✅ FILE: src/api.js

const API_BASE = "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // ✅ Build headers safely:
  // - If FormData: DO NOT set Content-Type (browser sets boundary)
  // - If JSON: set Content-Type application/json
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // ✅ Better error message (try JSON, then text)
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    let message = res.statusText;

    try {
      if (ct.includes("application/json")) {
        const j = await res.json();
        message =
          j?.message ||
          j?.error ||
          (Array.isArray(j?.message) ? j.message.join(", ") : message);
      } else {
        const t = await res.text();
        if (t) message = t;
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(message || `HTTP ${res.status}`);
  }

  // ✅ No content
  if (res.status === 204) return null;

  // ✅ Return JSON when possible, else return text
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();

  const text = await res.text();
  return text || null;
}

/* ---------------------------------------------------
   ✅ Admin Verification API
--------------------------------------------------- */

// ✅ List verification requests (status: PENDING | VERIFIED | REJECTED | empty for all)
export function adminListVerifications(status = "PENDING") {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/admin/verification${q}`, { method: "GET" });
}

// ✅ Approve/Reject verification request
export function adminReviewVerification(id, status, note = "") {
  return apiFetch(`/admin/verification/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });
}
