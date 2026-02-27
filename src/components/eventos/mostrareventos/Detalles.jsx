import "../../../App.css";
import { Button, Toast, Modal } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "../../../contexts/carritoContext/CarritoContext";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaCartPlus } from "react-icons/fa";
import { getEventoPorId, modificarEvento } from "../../../services/api";
import FormularioEditarEvento from "../mostrareventos/FormularioEditarEvento";
import { ROLES } from "../../../data/roles";

const Detalles = ({ evento: eventoProp, onEditar }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { agregarCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  const [evento, setEvento] = useState(eventoProp || location.state?.evento || null);

  // Estados para modal de edición
  const [showModal, setShowModal] = useState(false);
  const [eventoEditar, setEventoEditar] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!evento && id) {
      getEventoPorId(id).then(data => {
        if (data) {
          const eventoNormalizado = {
            id: data.id,
            nombreEvento: data.nombre,
            descripcion: data.descripcion,
            fechaEvento: data.fecha,
            horarioEvento: data.horario,
            lugarEvento: data.lugar,
            precioEvento: data.precio,
            imagenEvento: data.imagen,
            disponible: data.disponible,
          };
          setEvento(eventoNormalizado);
        }
      });
    }
  }, [evento, id]);

  const handleAgregarCarrito = () => {
    if (!evento) return;
    agregarCarrito({
      id,
      nombre: evento.nombreEvento,
      precio: evento.precioEvento,
      imagen: evento.imagenEvento,
      fechaEvento: evento.fechaEvento,
      horarioEvento: evento.horarioEvento,
      lugarEvento: evento.lugarEvento,
      disponible: evento.disponible,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  };

  // Función para abrir el modal y cargar el evento a editar
  const handleEditar = () => {
    setEventoEditar(evento);
    setShowModal(true);
  };

  // Función para guardar los cambios (llama al backend)
  const handleGuardar = async (eventoActualizado) => {
    const res = await modificarEvento(eventoActualizado);
    if (res.success) {
      setEvento(eventoActualizado); // actualizamos el estado para que se refleje en detalles
      setShowModal(false);
      alert("Evento modificado correctamente");
      window.location.reload();
    } else {
      alert("Error al modificar el evento: " + res.error);
    }
  };

  if (!evento) {
    return <div className="text-danger text-center mt-5">Evento no encontrado</div>;
  }

  const {
    nombreEvento,
    descripcion,
    fechaEvento,
    horarioEvento,
    lugarEvento,
    precioEvento,
    imagenEvento,
    disponible,
  } = evento;

  return (
    
    <div className="evento-detalle text-white" style={{ maxWidth: "900px", margin: "2rem auto", padding: "1.5rem" }}>
      
      <img
        src={imagenEvento || "https://via.placeholder.com/800x600?text=Sin+imagen"}
        alt={nombreEvento}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "1.5rem",
        }}
      />

      <h2 className="mb-3">{nombreEvento}</h2>
      <p className="lead">{descripcion}</p>

      <div className="mb-3">
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(fechaEvento).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p>
          <strong>Horario:</strong> {horarioEvento?.slice(0, 5)}
        </p>
        <p><strong>Lugar:</strong> {lugarEvento}</p>
        <p><strong>Precio:</strong> ${parseFloat(precioEvento).toFixed(2)}</p>
        <p>
          <strong>Disponibilidad:</strong>{" "}
          {disponible ? (
            <span className="badge bg-success">D</span>
          ) : (
            <span className="badge bg-danger">N</span>
            )}
        </p>
      </div>

      <div className="d-flex gap-3 flex-wrap justify-content-end mb-4">
        {(user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) && (
          <Button variant="primary" onClick={handleEditar}>
            <FaEdit className="me-2" />
            Modificar Evento
          </Button>
        )}

<Button
  variant="secondary"
  onClick={() => navigate("/")}
  className="mt-2"
>
  <FaArrowLeft className="me-2" />
</Button>

{disponible ? (
  <Button
    variant="success"
    onClick={() => navigate(`/checkout/${id}`)}  // ✅ CAMBIO ACÁ
  >
    <FaCartPlus className="me-2" />
    Comprar Entrada
  </Button>
) : (
  <Button variant="light" disabled>
    No disponible
  </Button>
)}
      </div>
      
<div className="mb-4">
  <h5>Ubicación en el mapa</h5>
  <iframe
    width="100%"
    height="300"
    style={{ border: 0, borderRadius: "12px" }}
    loading="lazy"
    allowFullScreen
    src={`https://www.google.com/maps?q=${encodeURIComponent(lugarEvento)}&output=embed`}
  />
</div>
      <Toast
        show={agregado}
        onClose={() => setAgregado(false)}
        delay={1200}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          minWidth: "180px",
          background: "#198754",
          color: "#fff",
          zIndex: 9999,
        }}
      >
        <Toast.Body>¡Agregado al carrito!</Toast.Body>
      </Toast>
      

      {/* Modal de edición */}
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
      
    </div>
  );
};

export default Detalles;