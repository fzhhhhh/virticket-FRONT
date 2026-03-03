import { useState, useEffect } from "react";
import { Button, Table, Modal, Spinner, Alert } from "react-bootstrap";
import { getEventos, eliminarEvento } from "../../services/api";
import { FaTrash } from "react-icons/fa";

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      setCargando(true);
      setError(null);
      const data = await getEventos();
      if (Array.isArray(data)) {
        setEventos(data);
      } else {
        setError("No se pudieron cargar los eventos");
      }
      setCargando(false);
    };
    cargarEventos();
  }, []);

  const confirmarEliminacion = (evento) => {
    setEventoAEliminar(evento);
    setMostrarModal(true);
  };

  const handleEliminar = async () => {
    const res = await eliminarEvento(eventoAEliminar._id || eventoAEliminar.id);
    if (res.success) {
      setEventos((prev) =>
        prev.filter((e) => e._id !== eventoAEliminar._id && e.id !== eventoAEliminar.id)
      );
      setExito(`Evento "${eventoAEliminar.nombre}" eliminado correctamente.`);
      setTimeout(() => setExito(null), 2500);
    } else {
      setError("No se pudo eliminar el evento");
    }
    setMostrarModal(false);
    setEventoAEliminar(null);
  };

  const eventosFiltrados = eventos.filter((e) =>
    `${e.nombre} ${e.lugar}`.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestión de Eventos</h3>

      <input
        type="text"
        placeholder="Buscar por título o ubicación..."
        className="form-control mb-3"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />

      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando eventos...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      {!cargando && eventosFiltrados.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Título</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventosFiltrados.map((e) => (
              <tr key={e._id || e.id}>
                <td>{e.nombre}</td>
                <td>{e.lugar}</td>
                <td>{new Date(e.fecha).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => confirmarEliminacion(e)}
                    title="Eliminar evento"
                  >
                    <FaTrash className="me-1" />
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!cargando && eventosFiltrados.length === 0 && (
        <p className="text-center text-muted mt-4">No se encontraron eventos que coincidan.</p>
      )}

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que querés eliminar el evento{" "}
          <strong>{eventoAEliminar?.nombre}</strong>?
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

export default GestionEventos;