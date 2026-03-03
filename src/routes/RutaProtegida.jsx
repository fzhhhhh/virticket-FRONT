// src/routes/RutaProtegida.jsx
import { Navigate } from "react-router-dom";
import { useSesion } from "../contexts/sesionContext/SesionContext";

const RutaProtegida = ({ children, rolesPermitidos = [] }) => {
  const { usuario } = useSesion();

  // 1) Si no hay sesión, afuera
  if (!usuario) {
    return <Navigate to="/mostrarEvento" replace />;
  }

  // 2) Normalizar rol (por si viene con espacios/mayúsculas)
  const rol = String(usuario.role || "").trim().toLowerCase();

  // 3) Si la ruta exige roles y no coincide -> acceso denegado (NO mandes a /login)
  if (rolesPermitidos.length > 0) {
    const permitidosNorm = rolesPermitidos.map((r) => String(r).trim().toLowerCase());
    if (!permitidosNorm.includes(rol)) {
      return (
        <div className="container text-center mt-5 text-danger">
          <h2>🚫 Acceso denegado</h2>
          <p>No tenés permisos para ver esta sección.</p>
          <p>Rol detectado: <b>{rol || "sin rol"}</b></p>
        </div>
      );
    }
  }

  return children;
};

export default RutaProtegida;