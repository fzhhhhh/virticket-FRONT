import { useState, useEffect } from "react";
import { Button, Col, Form, Row, Alert, Spinner } from "react-bootstrap";
import distintosRoles from "../../data/roles";
import { asignarRol, getUsuarios } from "../../services/api";

const FormularioRoles = ({ onRolAsignado }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargandoUsuarios(true);
      const data = await getUsuarios();
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        setError("Error al cargar los usuarios.");
      }
      setCargandoUsuarios(false);
    };
    cargarUsuarios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensaje(null);
    setError(null);
    setEnviando(true);

    try {
      const result = await asignarRol(userId, rol);
      if (result.success) {
        const usuario = usuarios.find((u) => u._id === userId || u.id === userId);
        setMensaje(`✅ Rol "${rol}" asignado a "${usuario?.nombre || 'Usuario'}" correctamente.`);
        setUserId("");
        setRol("");
        onRolAsignado?.();
      } else {
        setError(result.error || "Error al asignar el rol.");
      }
    } catch {
      setError("Error al asignar el rol. Intenta nuevamente.");
    } finally {
      setEnviando(false);
      setTimeout(() => setMensaje(null), 2500);
    }
  };

  return (
    <div className="d-block p-3 mx-auto" style={{ maxWidth: "600px" }}>
      <Row className="roles">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="userId">
              <Form.Label>Seleccionar usuario</Form.Label>
              <Form.Select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={enviando || cargandoUsuarios}
                required
              >
                <option value="">Selecciona un usuario...</option>
                {usuarios.map((u) => (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.nombre} ({u.correo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="rol">
              <Form.Label>Asignar Rol</Form.Label>
              <Form.Select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={enviando}
                required
              >
                <option value="">Selecciona un rol...</option>
                {distintosRoles.map((rolItem) => (
                  <option key={rolItem.id} value={rolItem.value}>
                    {rolItem.roleName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {mensaje && (
              <Alert variant="success" className="text-center">
                {mensaje}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Button
              variant="secondary"
              type="submit"
              disabled={!userId || !rol || enviando}
              style={{ minWidth: 140 }}
            >
              {enviando ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Asignando...
                </>
              ) : (
                "Agregar Rol"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default FormularioRoles;