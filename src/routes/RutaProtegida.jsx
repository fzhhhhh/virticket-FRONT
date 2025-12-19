import { Navigate } from "react-router-dom";
import { useSesion } from "../contexts/sesionContext/SesionContext";
import { ROLES } from "../data/roles"; // ← Importación de constantes

const RutaProtegida = ({ children, rolesPermitidos = [] }) => {
  const { usuario } = useSesion();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Validación defensiva: rol desconocido
  const rolesValidos = Object.values(ROLES);
  if (!rolesValidos.includes(usuario.role)) {
    return <Navigate to="/login" replace />;
  }

  // Validación por rol permitido
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
    return (
      <div className="container text-center mt-5 text-danger">
        <h2>🚫 Acceso denegado</h2>
        <p>No tenés permisos para ver esta sección.</p>
        <p>Si creés que esto es un error, contactá con un administrador.</p>
      </div>
    );
  }

  return children;
};

export default RutaProtegida;