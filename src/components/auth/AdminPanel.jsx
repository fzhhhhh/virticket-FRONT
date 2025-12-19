import React, { useState, useEffect } from "react";
import AgregarEvento from "../eventos/agregarevento/agregarEvento";

const AdminPanel = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.nombre) {
      setNombreUsuario(usuario.nombre);
    }
  }, []);

  const handleEventoAgregado = (nuevoEvento) => {
    setMensaje("✅ Evento agregado correctamente.");
    setMostrarFormulario(false);
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4">
        Bienvenido, {nombreUsuario || "Administrador"}
      </h2>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? "Ocultar formulario" : "Agregar nuevo evento"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="d-flex justify-content-center">
          <AgregarEvento OnEventoAdded={handleEventoAgregado} />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;