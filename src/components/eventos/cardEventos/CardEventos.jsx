import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useCart } from "../../../contexts/carritoContext/CarritoContext";
import { useSesion } from "../../../contexts/sesionContext/SesionContext";
import { ROLES } from "../../../data/roles";
import "./cardEvento.css";

const CardEventos = ({
  idEvento,
  nombreEvento,
  horarioEvento,
  fechaEvento,
  imagenEvento,
  descripcion,
  lugarEvento,
  precioEvento,
  disponible,
  visible = true,
  onVerMas,
  onEliminar,
  onOcultar,
  onMostrar,
}) => {
  const navigate = useNavigate();
  const { agregarCarrito } = useCart();
  const { usuario } = useSesion();
  const [agregado, setAgregado] = useState(false);

  const isDisponible = !(
    disponible === false ||
    disponible === 0 ||
    disponible === "0" ||
    String(disponible).toLowerCase() === "false"
  );

  const handleAgregarCarrito = () => {
    if (!isDisponible) return;

    const payload = {
      id: idEvento,
      nombre: nombreEvento,
      precio: precioEvento,
      imagen: imagenEvento,
      disponible: isDisponible,
    };

    agregarCarrito && agregarCarrito(payload);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  const puedeGestionar =
    usuario &&
    (usuario.role === ROLES.ADMIN || usuario.role === ROLES.SUPER_ADMIN);

  return (
    <article
      className="evento-card"
      onClick={() => navigate(`/evento/${idEvento}`)}
    >
      <img
        className="evento-card-img"
        src={imagenEvento || "/placeholder.jpg"}
        alt={nombreEvento}
      />

      <div className="evento-card-body">
        <h3>{nombreEvento}</h3>

        <p className="evento-lugar">{lugarEvento}</p>

        <small className="evento-fecha">
          {new Date(fechaEvento).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          • {horarioEvento?.slice(0, 5)}
        </small>

        {puedeGestionar && !visible && (
          <div className="evento-oculto">⚠️ Evento oculto</div>
        )}

        <div className="evento-acciones">
          <Button
            size="sm"
            variant={isDisponible ? "success" : "secondary"}
            onClick={(e) => {
              e.stopPropagation();
              handleAgregarCarrito();
            }}
            disabled={!isDisponible || agregado}
          >
            {!isDisponible
              ? "No disponible"
              : agregado
              ? "Agregada al Carrito"
              : "Comprar Entrada"}
          </Button>

          {puedeGestionar && (
            <>
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminar && onEliminar(idEvento);
                }}
              >
                Eliminar
              </Button>

              {visible ? (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOcultar && onOcultar(idEvento);
                  }}
                >
                  Ocultar
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMostrar && onMostrar(idEvento);
                  }}
                >
                  Mostrar
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default CardEventos;