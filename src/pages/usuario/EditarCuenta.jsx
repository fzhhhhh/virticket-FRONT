import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { editarCuenta } from "../../services/api";
import { useSesion } from "../../contexts/sesionContext/SesionContext";

const EditarCuenta = () => {
  const { usuario, actualizarUsuario } = useSesion();
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [contraseña, setContraseña] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);

    const datos = { nombre, correo };
    if (contraseña) datos.contraseña = contraseña;

    const res = await editarCuenta(datos);

    if (res.success) {
      actualizarUsuario(res.usuario);
      setExito("✅ Cuenta actualizada correctamente.");
    } else {
      setError(res.error || "❌ Error al actualizar la cuenta.");
    }

    setCargando(false);
    setTimeout(() => {
      setExito(null);
      setError(null);
    }, 3000);
  };

  return (
    <div className="container mt-4">
      <h3>Cambiar Informacion de la cuenta</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña (opcional)</Form.Label>
          <Form.Control
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Solo si querés cambiarla"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={cargando}>
          {cargando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </Form>

      {exito && <Alert variant="success" className="mt-3">{exito}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default EditarCuenta;