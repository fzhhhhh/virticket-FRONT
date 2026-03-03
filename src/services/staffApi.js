// src/services/staffApi.js
const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Traer eventos (productor => solo los suyos si tu backend filtra por role)
export async function getEventos() {
  const res = await fetch(`${API_URL}/events`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudieron cargar eventos");
  return data;
}

// Staff asignados al evento
export async function getStaffDelEvento(eventoId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/asignados`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo cargar staff asignado");
  return data; // array
}

// Staff disponibles para ese evento
export async function getStaffDisponibles(eventoId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/disponibles`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo cargar staff disponibles");
  return data; // array
}

// Asignar staff
export async function asignarStaff(eventoId, staff_id) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/asignar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ staff_id }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo asignar staff");
  return data;
}

// Quitar staff
export async function quitarStaff(eventoId, staffId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/quitar/${staffId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo quitar staff");
  return data;
}