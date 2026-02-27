// src/pages/admin/ReportesEventos.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { getResumenEvento, getVentasEvento } from "../../services/api";

// ✅ Si ya tenés una función getEventos() en tu services/api, reemplazá esta por la tuya.
async function getEventosAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/events`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.error || "No se pudieron cargar eventos");
  return data;
}

export default function ReportesEventos() {
  // ====== DATA ======
  const [eventos, setEventos] = useState([]);
  const [eventoId, setEventoId] = useState("");

  const [resumen, setResumen] = useState(null);
  const [estadoEntradas, setEstadoEntradas] = useState({ validas: 0, usadas: 0 });
  const [ventas, setVentas] = useState([]);

  // ====== UI STATES ======
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [error, setError] = useState(null);

  // ✅ NUEVO: filtro
  const [filtroEmail, setFiltroEmail] = useState("");

  // ====== Cargar eventos ======
  useEffect(() => {
    (async () => {
      try {
        setLoadingEventos(true);
        setError(null);
        const evs = await getEventosAdmin();
        setEventos(Array.isArray(evs) ? evs : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingEventos(false);
      }
    })();
  }, []);

  // ====== Evento seleccionado (para mostrar info) ======
  const eventoSeleccionado = useMemo(() => {
    return eventos.find((e) => String(e.id) === String(eventoId)) || null;
  }, [eventos, eventoId]);

  // ====== Cargar reportes del evento ======
  const cargarReportes = async (id) => {
    try {
      setError(null);
      setLoadingReportes(true);

      const [r1, r2] = await Promise.all([
        getResumenEvento(id),
        getVentasEvento(id),
      ]);

      setResumen(r1.resumen);
      setEstadoEntradas(r1.estadoEntradas || { validas: 0, usadas: 0 });
      setVentas(Array.isArray(r2) ? r2 : []);

      // ✅ reset del filtro cada vez que cambiás de evento (opcional pero útil)
      setFiltroEmail("");
    } catch (e) {
      setError(e.message);
      setResumen(null);
      setEstadoEntradas({ validas: 0, usadas: 0 });
      setVentas([]);
    } finally {
      setLoadingReportes(false);
    }
  };

  useEffect(() => {
    if (eventoId) cargarReportes(eventoId);
  }, [eventoId]);

  // ======================================================
  // ✅ ACÁ VA EL useMemo DEL FILTRO (en el componente, antes del return)
  // ======================================================
  const ventasFiltradas = useMemo(() => {
    const q = filtroEmail.trim().toLowerCase();
    if (!q) return ventas;

    return ventas.filter((v) => {
      const email = String(v.email_cliente || "").toLowerCase();
      const nombre = String(v.comprador || "").toLowerCase(); // opcional
      return email.includes(q) || nombre.includes(q);
    });
  }, [ventas, filtroEmail]);

  // ====== UI ======
  return (
    <div className="container mt-4">
      <h3 className="mb-3">📊 Reportes por Evento</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="p-3 mb-3">
        <Form.Group>
          <Form.Label>Seleccionar evento</Form.Label>

          {loadingEventos ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" animation="border" />
              <span>Cargando eventos...</span>
            </div>
          ) : (
            <Form.Select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
              <option value="">-- Elegí un evento --</option>
              {eventos.map((e) => (
                <option key={e.id} value={e.id}>
                  #{e.id} - {e.nombre}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {eventoSeleccionado && (
          <small className="text-muted mt-2 d-block">
            Fecha: {new Date(eventoSeleccionado.fecha).toLocaleDateString("es-AR")} •
            Lugar: {eventoSeleccionado.lugar || "-"}
          </small>
        )}
      </Card>

      {loadingReportes && (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <div className="mt-2">Cargando reportes...</div>
        </div>
      )}

      {resumen && !loadingReportes && (
        <>
          <Row className="g-3 mb-3">
            <Col md={3}>
              <Card className="p-3">
                <div className="text-muted">Ventas (pagos)</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{resumen.ventas}</div>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3">
                <div className="text-muted">Entradas vendidas</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>
                  {resumen.entradas_vendidas}
                </div>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3">
                <div className="text-muted">Recaudado</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>
                  ${Number(resumen.recaudado || 0).toLocaleString("es-AR")}
                </div>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3">
                <div className="text-muted">Estado entradas</div>
                <div className="mt-1">
                  <Badge bg="success" className="me-2">
                    Válidas: {estadoEntradas.validas || 0}
                  </Badge>
                  <Badge bg="warning" text="dark">
                    Usadas: {estadoEntradas.usadas || 0}
                  </Badge>
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="p-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h5 className="mb-0">🧾 Ventas</h5>
              <small className="text-muted">
                (Ventas = pagos • Entradas vendidas = suma de cantidades)
              </small>
            </div>

            {/* ✅ Buscador por email */}
            <Form.Group className="mt-3">
              <Form.Label>Buscar por email (o nombre)</Form.Label>
              <Form.Control
                type="text"
                placeholder="ej: usuario@gmail.com"
                value={filtroEmail}
                onChange={(e) => setFiltroEmail(e.target.value)}
              />
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  Mostrando {ventasFiltradas.length} de {ventas.length}
                </small>
                {filtroEmail && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setFiltroEmail("")}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </Form.Group>

            <hr />

            {ventasFiltradas.length === 0 ? (
              <div className="text-muted">
                {ventas.length === 0
                  ? "No hay ventas registradas para este evento."
                  : "No hay resultados para esa búsqueda."}
              </div>
            ) : (
              <Table responsive bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Comprador</th>
                    <th>Email</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Cant.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map((v) => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{new Date(v.fecha).toLocaleString("es-AR")}</td>
                      <td>{v.comprador || "-"}</td>
                      <td>{v.email_cliente || "-"}</td>
                      <td>{v.metodo_pago || "-"}</td>
                      <td>
                        <Badge bg={v.estado_pago === "aprobado" ? "success" : "secondary"}>
                          {v.estado_pago}
                        </Badge>
                      </td>
                      <td>{v.cantidad}</td>
                      <td>${Number(v.total || 0).toLocaleString("es-AR")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}