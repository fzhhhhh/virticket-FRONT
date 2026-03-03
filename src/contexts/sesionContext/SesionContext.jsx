import React, { createContext, useContext, useState, useEffect } from "react";

const SesionContext = createContext();

export const SesionProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  // ✅ Login: guardo token + usuario (incluye role)
  const loginUsuario = (data) => {
    // data debería venir del backend: { token, role, correo, id, nombre }
    if (!data?.token || !data?.role) {
      console.warn("loginUsuario: faltan token/role en data", data);
      setUsuario(null);
      return;
    }

    localStorage.setItem("token", data.token);

    setUsuario({
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      role: data.role,
    });
  };

  const logoutUsuario = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <SesionContext.Provider value={{ usuario, setUsuario, loginUsuario, logoutUsuario }}>
      {children}
    </SesionContext.Provider>
  );
};

export const useSesion = () => useContext(SesionContext);