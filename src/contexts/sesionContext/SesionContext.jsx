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

  // Función para loguear (puede recibir el objeto usuario devuelto por el backend)
  const loginUsuario = (usuarioObj) => {
    setUsuario(usuarioObj || null);
  };

  // Función para desloguear
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