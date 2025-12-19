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

// 🔹 Autenticación: registro
export const register = async (nombre, correo, contraseña) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contraseña }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al registrarse");
    return data;
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
export const iniciarPago = async (items) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/pago/crear-preferencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error("No se pudo iniciar el pago");
    return await response.json(); // { id, init_point }
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