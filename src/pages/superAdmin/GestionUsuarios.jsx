import { useState, useEffect } from "react";
import { Button, Table, Modal, Spinner, Alert, Form } from "react-bootstrap";
import { asignarRol, getUsuarios, eliminarUsuario } from "../../services/api";
import BuscadorUsuarios from "./BuscadorUsuarios";
import FormularioRoles from "./FormularioRoles";
import { FaTrash } from "react-icons/fa";
import distintosRoles from "../../data/roles";


const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [buscar, setBuscar] = useState("");



//
const [rolesSeleccionados, setRolesSeleccionados] = useState({});
const [enviando, setEnviando] = useState({});
const [mensajesRol, setMensajesRol] = useState({});
///

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    const data = await getUsuarios();
    if (Array.isArray(data)) {
      setUsuarios(data);
    } else {
      setError("No se pudieron cargar los usuarios");
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const confirmarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModal(true);
  };

  const handleEliminar = async () => {
    const res = await eliminarUsuario(usuarioAEliminar._id || usuarioAEliminar.id);
    if (res.success) {
      setUsuarios((prev) =>
        prev.filter((u) => u._id !== usuarioAEliminar._id && u.id !== usuarioAEliminar.id)
      );
      setExito(`Usuario "${usuarioAEliminar.nombre}" eliminado correctamente.`);
      setTimeout(() => setExito(null), 2500);
    } else {
      setError("No se pudo eliminar el usuario");
    }
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.correo}`.toLowerCase().includes(buscar.toLowerCase())
  );

  
  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestión de Usuarios</h3>

      <BuscadorUsuarios valor={buscar} onBuscar={setBuscar} />

      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      {!cargando && usuariosFiltrados.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Cambiar Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
  {usuariosFiltrados.map((u) => {
    const id = u._id || u.id;
    const rolSeleccionado = rolesSeleccionados[id] || "";

    const handleSubmit = async (event) => {
      event.preventDefault();
      setError(null);
      setEnviando((prev) => ({ ...prev, [id]: true }));

      try {
        const result = await asignarRol(id, rolSeleccionado);
        if (result.success) {
          setMensajesRol((prev) => ({
            ...prev,
            [id]: `✅ Rol "${rolSeleccionado}" asignado a ${u.nombre}`,
          }));
          setRolesSeleccionados((prev) => ({ ...prev, [id]: "" }));
          cargarUsuarios();
        } else {
          setError(result.error || "Error al asignar el rol.");
        }
      } catch {
        setError("Error al asignar el rol. Intenta nuevamente.");
      } finally {
        setEnviando((prev) => ({ ...prev, [id]: false }));
        setTimeout(() => {
          setMensajesRol((prev) => ({ ...prev, [id]: null }));
        }, 3000);
      }
    };

    return (
      <tr key={id}>
        <td>{u.nombre}</td>
        <td>{u.correo}</td>
        <td>{u.role}</td>
        <td>
          <Form onSubmit={handleSubmit}>
            <Form.Select
              value={rolSeleccionado}
              onChange={(e) =>
                setRolesSeleccionados((prev) => ({
                  ...prev,
                  [id]: e.target.value,
                }))
              }
              disabled={enviando[id]}
              required
            >
              <option value="">Selecciona un rol...</option>
              {distintosRoles.map((rolItem) => (
                <option key={rolItem.id} value={rolItem.value}>
                  {rolItem.roleName}
                </option>
              ))}
            </Form.Select>

            <Button
              className="mt-2"
              variant="secondary"
              type="submit"
              disabled={!rolSeleccionado || enviando[id]}
              style={{ minWidth: 140 }}
            >
              {enviando[id] ? (
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
                "Asignar Rol"
              )}
            </Button>

            {mensajesRol[id] && (
              <div className="text-success mt-2">{mensajesRol[id]}</div>
            )}
          </Form>
        </td>
        <td>
          <Button
            variant="danger"
            size="sm"
            onClick={() => confirmarEliminacion(u)}
            title="Eliminar usuario"
          >
            <FaTrash className="me-1" />
            Eliminar
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>
        </Table>
      )}

      {!cargando && usuariosFiltrados.length === 0 && (
        <p className="text-center text-muted mt-4">No se encontraron usuarios que coincidan.</p>
      )}

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que querés eliminar al usuario{" "}
          <strong>{usuarioAEliminar?.nombre}</strong> ({usuarioAEliminar?.correo})?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            <FaTrash className="me-1" />
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;