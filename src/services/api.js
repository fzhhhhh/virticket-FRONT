const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Obtener todos los eventos con autenticación
export const getEventos = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("📤 Token enviado en getEventos:", token);

    const response = await fetch(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok)
      throw new Error(`Error ${response.status}: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("❌ Error en getEventos:", error.message);
    return [];
  }
};

// 🔹 Agregar un nuevo evento
export const agregarEvento = async (dataEvento) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataEvento),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al agregar evento");
    return { success: true, evento: data };
  } catch (error) {
    console.error("❌ Error al agregar evento:", error);
    return { success: false, error: error.message };
  }
};

// 🔹 Modificar un evento existente
export const modificarEvento = async (dataEvento) => {
  const token = localStorage.getItem("token");
  try {
    console.log("📦 Enviando evento a modificar:", dataEvento);
    const response = await fetch(`${API_URL}/events/${dataEvento.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataEvento),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al modificar evento");
    return { success: true, evento: data };
  } catch (error) {
    console.error("❌ Error en modificarEvento:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Eliminar un evento
export const eliminarEvento = async (idEvento) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/events/${idEvento}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error al eliminar evento");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en eliminarEvento:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Obtener carrito de compras
export const getCarrito = async () => {
  try {
    const response = await fetch(`${API_URL}/carrito`);
    if (!response.ok) throw new Error("Error al obtener carrito");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getCarrito:", error.message);
    return [];
  }
};

// 🔹 Autenticación: login
export const login = async (correo, contraseña) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.mensaje || "Error en el login");

    if (data.token) {
      const user = {
        id: data.id,
        correo: data.correo,
        role: data.role,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    return { error: error.message };
  }
};

// 🔹 Autenticación: registro (actualizado)
// data = { nombre, apellido, correo, contraseña, dni?, fecha_nacimiento?, genero? }
export const register = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(resData.mensaje || resData.error || "Error al registrarse");

    return resData;
  } catch (error) {
    console.error("❌ Error en register:", error.message);
    return { error: error.message };
  }
};

// 🔹 Obtener todos los usuarios (solo para super_admin)
export const getUsuarios = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getUsuarios:", error.message);
    return [];
  }
};

// 🔹 Eliminar un usuario por ID
export const eliminarUsuario = async (idUsuario) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error al eliminar usuario");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en eliminarUsuario:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Obtener un evento por ID
export const getEventoPorId = async (id) => {
  if (!id) throw new Error("ID del evento no proporcionado");

  try {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "No se pudo obtener el evento");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getEventoPorId:", error.message);
    return null; // Podés manejar esto como quieras en el front
  }
};

// 🔹 Asignar rol a un usuario
export const asignarRol = async (userId, nuevoRol) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rol: nuevoRol }),
    });
    if (!response.ok) throw new Error("Error al asignar rol al usuario");
    const data = await response.json();
    return { success: true, usuario: data };
  } catch (error) {
    console.error("❌ Error en asignarRol:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Iniciar pago con MercadoPago desde el carrito
export const iniciarPago = async (items, usuario) => {
  const token = localStorage.getItem("token");

  if (!token) return { error: "No hay token. Iniciá sesión." };
  if (!usuario?.id || !usuario?.correo) return { error: "Falta usuario_id o email_cliente" };

  try {
    const response = await fetch(`${API_URL}/pago/crear-preferencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,                       // items con evento_id
        usuario_id: usuario.id,      // ✅ clave
        email_cliente: usuario.correo // ✅ clave
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "No se pudo iniciar el pago");

    return data; // { mp_preference_id, init_point }
  } catch (error) {
    console.error("❌ Error en iniciarPago:", error.message);
    return { error: error.message };
  }
};

// 🔹 Obtener lugares únicos de eventos desde el backend
export const getLugares = async () => {
  try {
    const response = await fetch(`${API_URL}/lugares`);
    if (!response.ok) throw new Error("No se pudieron obtener los lugares");
    const data = await response.json();
    return data.lugares || [];
  } catch (error) {
    console.error("Error al obtener lugares:", error.message);
    return [];
  }
};

// 🔹 Editar datos de la cuenta del usuario autenticado
export const editarCuenta = async (datosActualizados) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosActualizados),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al editar cuenta");
    return { success: true, usuario: data };
  } catch (error) {
    console.error("❌ Error en editarCuenta:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 GET ENTRADAS
export const getMisEntradas = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/entradas/mis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "No se pudieron obtener tus entradas");

  return data;
};

// 🔹 POST VALIDAR ENTRADA (solo admin / superAdmin

export const validarEntrada = async (codigo_qr) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/entradas/validar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ codigo_qr }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "No se pudo validar la entrada");
  return data; // { ok, mensaje, entradaId, evento_id, venta_id }
};

// 🔹 GET RESUMEN DE UN EVENTO (solo admin / superAdmin

// services/api.js (o donde tengas API_URL y tus exports)

export const getResumenEvento = async (eventoId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reportes/eventos/${eventoId}/resumen`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Error al obtener resumen");
  return data;
};

export const getVentasEvento = async (eventoId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reportes/eventos/${eventoId}/ventas`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Error al obtener ventas");
  return data;
};

// 🔹 Completar titular de una entrada
export const completarTitular = async (entradaId, data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/entradas/${entradaId}/titular`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(responseData?.error || "No se pudo completar titular");

  return responseData;
};

// 🔹 GET KPIs de entradas de un evento (solo admin / superAdmin
export const getEntradasKpisEvento = async (eventoId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reportes/eventos/${eventoId}/entradas-kpis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Error al obtener KPIs de entradas");
  return data;
};
// 🔹 GET Demografía de un evento (solo admin / superAdmin
export const getDemografiaEvento = async (eventoId, modo = "titulados") => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${API_URL}/reportes/eventos/${eventoId}/demografia?modo=${encodeURIComponent(modo)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Error al obtener demografía");
  return data;
};
// 🔹 GET Ingresos por hora de un evento (solo admin / superAdmin
export const getIngresosPorHora = async (eventoId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reportes/eventos/${eventoId}/ingresos-hora`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ([]));
  if (!res.ok) throw new Error(data?.error || "Error al obtener ingresos por hora");
  return data;
};


// 🔹 Descargar Excel de un evento (solo admin / superAdmin

export const descargarExcelEvento = async (eventoId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reportes/eventos/${eventoId}/excel`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "No se pudo descargar el Excel");
  }

  return await res.blob();
};

// ✅ Si ya tenés una función getEventos() en tu services/api, reemplazá esta por la tuya.
async function getEventosAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/events`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.error || "No se pudieron cargar eventos");
  return data;
}


function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getStaffDisponibles(eventoId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/disponibles`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo cargar staff disponibles");
  return data; // ← array
}

export async function getStaffAsignados(eventoId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/asignados`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo cargar staff asignado");
  return data; // ← array
}

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

export async function quitarStaff(eventoId, staffId) {
  const res = await fetch(`${API_URL}/staff/${eventoId}/quitar/${staffId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "No se pudo quitar staff");
  return data;
}