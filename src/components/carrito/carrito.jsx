import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useCart } from "../../contexts/carritoContext/CarritoContext";
import { useSesion } from "../../contexts/sesionContext/SesionContext";
import { iniciarPago } from "../../services/api";
import QRCode from "react-qr-code";

const Carrito = () => {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart();
  const { usuario } = useSesion();
  const [showVaciar, setShowVaciar] = useState(false);
  const [showSimulado, setShowSimulado] = useState(false);
  const [formSimulado, setFormSimulado] = useState({
    nombre: "",
    tarjeta: "",
    vencimiento: "",
    codigo: ""
  });
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);

  const handleAumentarCant = (eventoId) => {
    actualizarCantidad(eventoId, 1);
  };
  const handleDisminuirCant = (eventoId) => {
    const evento = carrito.find((evento) => evento.id === eventoId);
    if (evento && evento.cantidad > 1) {
      actualizarCantidad(eventoId, -1);
    }
  };

  const totalPagar = carrito.reduce(
    (total, evento) => total + Number(evento.precioEvento ?? evento.precio) * evento.cantidad,
    0
  );

  const pagarConMercadoPago = async () => {
    if (!usuario?.correo) {
      alert("Debes iniciar sesión para pagar.");
      return;
    }
    const items = carrito.map((item) => {
      const precio = Number(item.precioEvento ?? item.precio);
      return {
        evento_id: item.id, // 🔥 CLAVE
        title: item.nombreEvento || item.nombre,
        quantity: item.cantidad,
        unit_price: precio,
      };
    });

    if (items.some((i) => isNaN(i.unit_price) || i.unit_price <= 0)) {
      alert("Hay productos con precio inválido en el carrito.");
      return;
    }

    const resp = await iniciarPago(items, usuario);
    if (resp && resp.init_point) {
      window.location.href = resp.init_point;
    } else {
      alert(resp?.error || "No se pudo iniciar el pago");
    }
  };

  const handleSimuladoChange = (e) => {
    setFormSimulado({ ...formSimulado, [e.target.name]: e.target.value });
  };

  const handleSimuladoSubmit = async (e) => {
    e.preventDefault();
    if (!usuario?.id) {
      alert("Debes iniciar sesión para pagar.");
      return;
    }
    const token = usuario?.token || localStorage.getItem("token");

    try {
      for (const evento of carrito) {
        await fetch("http://localhost:3001/api/pago/registrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            evento_id: evento.id,
            cantidad: evento.cantidad,
            total: Number(evento.precioEvento ?? evento.precio) * evento.cantidad,
            estado_pago: "simulado",
            email_cliente: usuario.correo,
            datos_extra: {
              nombre: formSimulado.nombre,
              tarjeta: formSimulado.tarjeta,
              vencimiento: formSimulado.vencimiento,
              codigo: formSimulado.codigo
            }
          }),
        });
      }
      setPagoExitoso(true);
      setTimeout(() => {
        setShowSimulado(false);
        setPagoExitoso(false);
        vaciarCarrito();
        setFormSimulado({ nombre: "", tarjeta: "", vencimiento: "", codigo: "" });
        setMostrarQR(true);
      }, 2000);
    } catch (error) {
      alert("Error al registrar el pago simulado.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p className="text-center">El carrito está vacío</p>
      ) : (
        <div>
          <ul className="list-group">
            {carrito.map((evento) => (
              <li key={evento.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{evento.nombreEvento || evento.nombre}</span>
                  <p className="mb-0">${Number(evento.precioEvento ?? evento.precio).toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <Button variant="outline-secondary" size="sm" onClick={() => handleDisminuirCant(evento.id)}>-</Button>
                  <input
                    type="number"
                    readOnly
                    value={evento.cantidad}
                    className="form-control text-center mx-2"
                    style={{ width: "60px" }}
                  />
                  <Button variant="outline-secondary" size="sm" onClick={() => handleAumentarCant(evento.id)}>+</Button>
                </div>
                <div>
                  <p className="mb-0 fw-bold">${(Number(evento.precioEvento ?? evento.precio) * evento.cantidad).toFixed(2)}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => eliminarDelCarrito(evento.id)} title="Eliminar del carrito">
                  <i className="bi bi-trash"></i>
                </Button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="danger" size="sm" onClick={() => setShowVaciar(true)}>
              <i className="bi bi-trash"></i> Vaciar Carrito
            </Button>
            <h4 className="mb-0">
              Total a Pagar: <span className="text-primary">${totalPagar.toFixed(2)}</span>
            </h4>
          </div>
          <div className="mt-4 text-end d-flex gap-2 justify-content-end">
            <Button variant="success" size="lg" onClick={pagarConMercadoPago}>
              Mercadopago
            </Button>
            <Button variant="primary" size="lg" onClick={() => setShowSimulado(true)}>
              Pagar
            </Button>
          </div>
        </div>
      )}

      <Modal show={showVaciar} onHide={() => setShowVaciar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vaciar Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas vaciar el carrito?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVaciar(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => { vaciarCarrito(); setShowVaciar(false); }}>Vaciar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSimulado} onHide={() => setShowSimulado(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pago Simulado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pagoExitoso ? (
            <div className="text-success text-center">¡Pago realizado con éxito!</div>
          ) : (
            <form onSubmit={handleSimuladoSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre en la tarjeta</label>
                <input type="text" className="form-control" name="nombre" value={formSimulado.nombre} onChange={handleSimuladoChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Número de tarjeta</label>
                <input type="text" className="form-control" name="tarjeta" value={formSimulado.tarjeta} onChange={handleSimuladoChange} required maxLength={16} />
              </div>
              <div className="mb-3">
                <label className="form-label">Vencimiento</label>
                <input type="text" className="form-control" name="vencimiento" value={formSimulado.vencimiento} onChange={handleSimuladoChange} placeholder="MM/AA" required maxLength={5} />
              </div>
              <div className="mb-3">
                <label className="form-label">Código de seguridad</label>
                <input type="text" className="form-control" name="codigo" value={formSimulado.codigo} onChange={handleSimuladoChange} required maxLength={4} />
              </div>
              <Button variant="primary" type="submit" className="w-100">Confirmar Pago</Button>
            </form>
          )}
        </Modal.Body>
      </Modal>

      {mostrarQR && (
        <div className="text-center mt-4">
          <h5>🎟️ Entrada generada</h5>
                    <QRCode value="evento:12345|usuario:matias|estado:confirmado" size={180} />
          <p className="mt-2 text-muted">Este QR es de prueba.</p>
        </div>
      )}
    </div>
  );
};

export default Carrito;