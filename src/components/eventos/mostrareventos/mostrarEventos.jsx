import { useState, useEffect } from "react";
import CardEventos from "../cardEventos/CardEventos";
import { getEventos, modificarEvento } from "../../../services/api";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import FormularioEditarEvento from "./FormularioEditarEvento";
import Detalles from "./Detalles";
import { useSesion } from "../../../contexts/sesionContext/SesionContext";
import { ROLES } from "../../../data/roles";
import "./mostrareventos.css";

const MostrarEventos = ({ buscar }) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eventoEditar, setEventoEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventoDetalles, setEventoDetalles] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [toastGuardado, setToastGuardado] = useState(false);

  const { usuario } = useSesion();
  const esAdmin = usuario?.role === ROLES.ADMIN || usuario?.role === ROLES.SUPER_ADMIN;

 useEffect(() => {
  cargarEventos();
 }, [usuario]);


  const cargarEventos = async () => {
    setCargando(true);
    const data = await getEventos();
    setEventos(data);
    setCargando(false);
  };

  const handleEditar = (evento) => {
    setEventoEditar(evento);
    setShowModal(true);
  };

  const handleGuardar = async (eventoActualizado) => {
    const res = await modificarEvento(eventoActualizado);
    if (res.success) {
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === eventoActualizado.id ? eventoActualizado : ev
        )
      );
      setShowModal(false);
      setToastGuardado(true);
      setTimeout(() => setToastGuardado(false), 3000);
      if (eventoDetalles && eventoDetalles.id === eventoActualizado.id) {
        setEventoDetalles(eventoActualizado);
      }
    } else {
      alert("Error al modificar el evento: " + res.error);
    }
  };

  const handleVerMas = (evento) => {
    setEventoDetalles(evento);
    setShowDetalles(true);
  };

  const confirmarEliminar = (id) => {
    setEventoAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleEliminar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/events/${eventoAEliminar}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEventos((prev) => prev.filter((ev) => ev.id !== eventoAEliminar));
        setEventoAEliminar(null);
        setMostrarConfirmacion(false);
      } else {
        alert(data.mensaje || "Error al eliminar evento");
      }
    } catch (error) {
      console.error("❌ Error al eliminar evento:", error);
      alert("Ocurrió un error al eliminar el evento");
    }
  };

  const handleOcultar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/events/${id}/ocultar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        cargarEventos();
      } else {
        alert(data.mensaje || "Error al ocultar evento");
      }
    } catch (error) {
      console.error("❌ Error al ocultar evento:", error);
      alert("Ocurrió un error al ocultar el evento");
    }
  };

  const handleMostrar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/events/${id}/mostrar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        cargarEventos();
      } else {
        alert(data.mensaje || "Error al mostrar evento");
      }
    } catch (error) {
      console.error("❌ Error al mostrar evento:", error);
      alert("Ocurrió un error al mostrar el evento");
    }
  };

  const eventosFilt = eventos.filter((evento) =>
    [evento.nombre, evento.lugar, evento.descripcion]
      .join(" ")
      .toLowerCase()
      .includes((buscar || "").toLowerCase())
  );

  return (
    <div className="eventos-container">
      {cargando ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center my-5"
          style={{ minHeight: "40vh" }}
        >
          <div
            className="spinner-border text-danger"
            role="status"
            style={{ width: 60, height: 60 }}
          />
          <p className="mt-4 fs-5">Cargando eventos...</p>
        </div>
      ) : (
        <div className="eventos-grid">
          {eventosFilt.length > 0 ? (
            eventosFilt.map((evento) => (
              <CardEventos
                key={evento.id}
                idEvento={evento.id}
                nombreEvento={evento.nombre}
                horarioEvento={evento.horario}
                fechaEvento={evento.fecha}
                imagenEvento={evento.imagen}
                descripcion={evento.descripcion}
                lugarEvento={evento.lugar}
                precioEvento={evento.precio}
                disponible={evento.disponible}
                visible={evento.visible}
                onVerMas={() =>
                  handleVerMas({
                    id: evento.id,
                    nombreEvento: evento.nombre,
                    horarioEvento: evento.horario,
                    fechaEvento: evento.fecha,
                    imagenEvento: evento.imagen,
                    descripcion: evento.descripcion,
                    lugarEvento: evento.lugar,
                    precioEvento: evento.precio,
                    disponible: evento.disponible,
                    visible: evento.visible,
                  })
                }
                onEliminar={() => confirmarEliminar(evento.id)}
                onOcultar={() => handleOcultar(evento.id)}
                onMostrar={() => handleMostrar(evento.id)}
              />
            ))
          ) : (
            <div className="text-center text-muted fs-5" style={{ gridColumn: "1/-1" }}>
              No se encontraron eventos con ese nombre.
            </div>
          )}
        </div>
      )}

      <Modal show={showDetalles} onHide={() => setShowDetalles(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventoDetalles ? (
            <Detalles
              evento={eventoDetalles}
              onEditar={handleEditar}
              onCerrar={() => setShowDetalles(false)}
            />
          ) : (
            <div className="text-danger">Evento no encontrado</div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventoEditar && (
            <FormularioEditarEvento
              evento={eventoEditar}
              onGuardar={handleGuardar}
              onCancelar={() => setShowModal(false)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar evento?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción es irreversible. ¿Estás seguro de que deseás eliminar este evento?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        show={toastGuardado}
        onClose={() => setToastGuardado(false)}
        delay={3000}
        autohide
        bg="success"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1055,
          minWidth: 200,
          color: "white",
        }}
      >
        <Toast.Body className="fw-semibold">✅ Cambios guardados correctamente</Toast.Body>
      </Toast>
    </div>
  );
};

export default MostrarEventos;