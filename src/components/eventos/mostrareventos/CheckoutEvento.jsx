// src/pages/checkout/CheckoutEvento.jsx
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getEventoPorId, iniciarPago } from "../../../services/api";
import { useSesion } from "../../../contexts/sesionContext/SesionContext";

export default function CheckoutEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useSesion();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Sectores (MVP)
  // Hoy lo dejamos en frontend (rápido). Más abajo te digo cómo llevarlo a DB.
  const sectores = useMemo(
    () => [
      { id: "general", nombre: "General", precio: evento?.precio ?? 0 },
      { id: "platea", nombre: "Platea", precio: Number(evento?.precio ?? 0) * 1.4 },
      { id: "vip", nombre: "VIP", precio: Number(evento?.precio ?? 0) * 2.0 },
    ],
    [evento]
  );

  const [sector, setSector] = useState("general");
  const [cantidad, setCantidad] = useState(1);

  const sectorElegido = useMemo(
    () => sectores.find((s) => s.id === sector) || sectores[0],
    [sectores, sector]
  );

  const total = useMemo(() => {
    const p = Number(sectorElegido?.precio || 0);
    return Number((p * Number(cantidad)).toFixed(2));
  }, [sectorElegido, cantidad]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEventoPorId(id);

        // Normalizá según tu API (si ya te devuelve {nombre, precio, ...})
        setEvento({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          fecha: data.fecha,
          horario: data.horario,
          lugar: data.lugar,
          precio: data.precio,
          imagen: data.imagen,
          disponible: data.disponible,
        });
      } catch (e) {
        setError(e.message || "No se pudo cargar el evento");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handlePagarMP = async () => {
    try {
      if (!usuario?.correo) {
        setError("Tenés que iniciar sesión para pagar.");
        return;
      }
      if (!evento) return;

      // Si el evento no está disponible, cortamos
      if (!evento.disponible) {
        setError("Este evento no está disponible.");
        return;
      }

      setPagando(true);
      setError(null);

      // ✅ Un solo evento (NO multi-evento)
      const items = [
        {
          evento_id: evento.id,
          title: `${evento.nombre} - ${sectorElegido.nombre}`,
          quantity: Number(cantidad),
          unit_price: Number(sectorElegido.precio),
          // opcional: metadata extra (si tu back la guarda)
          sector: sectorElegido.id,
        },
      ];

      const resp = await iniciarPago(items, usuario);
      if (resp?.init_point) {
        window.location.href = resp.init_point;
      } else {
        setError(resp?.error || "No se pudo iniciar el pago");
      }
    } catch (e) {
      setError("Error al iniciar el pago");
    } finally {
      setPagando(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" />
        <div className="mt-2">Cargando checkout...</div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error || "Evento no encontrado"}</Alert>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Row className="g-4">
        <Col md={7}>
          <Card className="p-3">
            <div className="d-flex gap-3">
              <img
                src={evento.imagen || "https://via.placeholder.com/240x180?text=Evento"}
                alt={evento.nombre}
                style={{ width: 240, height: 180, objectFit: "cover", borderRadius: 12 }}
              />
              <div>
                <h4 className="mb-1">{evento.nombre}</h4>
                <div className="text-muted">
                  {new Date(evento.fecha).toLocaleDateString("es-AR")} •{" "}
                  {evento.horario?.slice(0, 5)} • {evento.lugar}
                </div>
                <p className="mt-2 mb-0">{evento.descripcion}</p>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="p-3">
            <h5 className="mb-3">🎟️ Elegí tus tickets</h5>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Sector</Form.Label>
              <Form.Select value={sector} onChange={(e) => setSector(e.target.value)}>
                {sectores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} — ${Number(s.precio).toLocaleString("es-AR")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={10}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
              <Form.Text className="text-muted">Máximo 10 por compra (ajustable).</Form.Text>
            </Form.Group>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong>Total</strong>
              <strong style={{ fontSize: 20 }}>${total.toLocaleString("es-AR")}</strong>
            </div>

            <div className="d-grid gap-2">
              <Button variant="success" onClick={handlePagarMP} disabled={pagando}>
                {pagando ? "Redirigiendo..." : "Pagar con MercadoPago"}
              </Button>

              <Button variant="outline-secondary" onClick={() => navigate(`/evento/${evento.id}`)}>
                Volver al evento
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}