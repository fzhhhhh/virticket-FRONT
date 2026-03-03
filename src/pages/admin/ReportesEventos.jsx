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
  Tabs,
  Tab,
} from "react-bootstrap";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  getResumenEvento,
  getVentasEvento,
  getEntradasKpisEvento,
  getDemografiaEvento,
  getIngresosPorHora,
} from "../../services/api";

import { descargarExcelEvento } from "../../services/api";

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

  // ✅ NUEVOS REPORTES (A+B+C)
  const [kpisEntradas, setKpisEntradas] = useState({
    tituladas: 0,
    no_tituladas: 0,
    usadas: 0,
  });
  const [demoTitulados, setDemoTitulados] = useState(null);
  const [demoUsadas, setDemoUsadas] = useState(null);
  const [ingresosHora, setIngresosHora] = useState([]);

  // ====== UI STATES ======
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [error, setError] = useState(null);

  // ✅ filtro ventas
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

      const [r1, r2, k1, d1, d2, h1] = await Promise.all([
        getResumenEvento(id),
        getVentasEvento(id),
        getEntradasKpisEvento(id),
        getDemografiaEvento(id, "titulados"),
        getDemografiaEvento(id, "usadas"),
        getIngresosPorHora(id),
      ]);

      setResumen(r1.resumen);
      setEstadoEntradas(r1.estadoEntradas || { validas: 0, usadas: 0 });
      setVentas(Array.isArray(r2) ? r2 : []);

      setKpisEntradas(k1 || { tituladas: 0, no_tituladas: 0, usadas: 0 });
      setDemoTitulados(d1 || null);
      setDemoUsadas(d2 || null);
      setIngresosHora(Array.isArray(h1) ? h1 : []);

      // reset filtro
      setFiltroEmail("");
    } catch (e) {
      setError(e.message);
      setResumen(null);
      setEstadoEntradas({ validas: 0, usadas: 0 });
      setVentas([]);

      setKpisEntradas({ tituladas: 0, no_tituladas: 0, usadas: 0 });
      setDemoTitulados(null);
      setDemoUsadas(null);
      setIngresosHora([]);
    } finally {
      setLoadingReportes(false);
    }
  };

  useEffect(() => {
    if (eventoId) cargarReportes(eventoId);
  }, [eventoId]);

  // ====== Filtro ventas ======
  const ventasFiltradas = useMemo(() => {
    const q = filtroEmail.trim().toLowerCase();
    if (!q) return ventas;

    return ventas.filter((v) => {
      const email = String(v.email_cliente || "").toLowerCase();
      const nombre = String(v.comprador || "").toLowerCase();
      return email.includes(q) || nombre.includes(q);
    });
  }, [ventas, filtroEmail]);

  // ====== KPIs derivados ======
  const tasaAsistencia = useMemo(() => {
    const tituladas = Number(kpisEntradas?.tituladas || 0);
    const usadas = Number(kpisEntradas?.usadas || 0);
    if (!tituladas) return 0;
    return Math.round((usadas / tituladas) * 100);
  }, [kpisEntradas]);

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

          <Button
  className="mt-3"
  variant="dark"
  disabled={!eventoId || loadingReportes}
  onClick={async () => {
    try {
      const blob = await descargarExcelEvento(eventoId);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_evento_${eventoId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  }}
>
  📥 Descargar Excel
</Button>
        </Form.Group>

        {eventoSeleccionado && (
          <small className="text-muted mt-2 d-block">
            Fecha: {new Date(eventoSeleccionado.fecha).toLocaleDateString("es-AR")} • Lugar:{" "}
            {eventoSeleccionado.lugar || "-"}
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
          {/* =======================
              B) CARDS ARRIBA (KPIs)
              ======================= */}
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
                <div style={{ fontSize: 26, fontWeight: 700 }}>{resumen.entradas_vendidas}</div>
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

            {/* ✅ KPIs nuevos (titulación + check-in real) */}
            <Col md={4}>
              <Card className="p-3">
                <div className="text-muted">Entradas tituladas</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>
                  {Number(kpisEntradas.tituladas || 0)}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  Pendientes de titular: <b>{Number(kpisEntradas.no_tituladas || 0)}</b>
                </div>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3">
                <div className="text-muted">Check-ins (escaneadas)</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>
                  {Number(kpisEntradas.usadas || 0)}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  Tasa asistencia (usadas/tituladas): <b>{tasaAsistencia}%</b>
                </div>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3">
                <div className="text-muted">Calidad de datos</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>
                  {Number(kpisEntradas.tituladas || 0) ? "OK" : "—"}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  Completar titulares mejora demografía y control de ingreso.
                </div>
              </Card>
            </Col>
          </Row>

          {/* =======================
              A) PESTAÑAS
              C) DASHBOARD CON GRÁFICOS
              ======================= */}
          <Tabs defaultActiveKey="ventas" className="mb-3">
            {/* =======================
                TAB 1: VENTAS (tu tabla actual)
                ======================= */}
            <Tab eventKey="ventas" title="🧾 Ventas">
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
            </Tab>

            {/* =======================
                TAB 2: DEMOGRAFÍA TITULADOS
                ======================= */}
            <Tab eventKey="titulados" title="👤 Asistentes (titulados)">
              <Card className="p-3">
                {!demoTitulados ? (
                  <div className="text-muted">Sin datos para mostrar.</div>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h5 className="mb-0">👤 Demografía (titulados)</h5>
                      <small className="text-muted">
                        Edad promedio: <b>{Number(demoTitulados.edad_promedio || 0).toFixed(1)}</b>
                      </small>
                    </div>

                    <Row className="g-3 mt-2">
                      <Col md={6}>
                        <h6 className="mt-2">Género</h6>
                        <div style={{ width: "100%", height: 280 }}>
                          <ResponsiveContainer>
                            <BarChart data={demoTitulados.genero || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="genero" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="cantidad" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Col>

                      <Col md={6}>
                        <h6 className="mt-2">Rangos de edad</h6>
                        <div style={{ width: "100%", height: 280 }}>
                          <ResponsiveContainer>
                            <BarChart data={demoTitulados.rangos || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="rango" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="cantidad" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Col>
                    </Row>

                    <hr />

                    <Row className="g-3">
                      <Col md={6}>
                        <h6>Tabla por género</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Género</th>
                              <th>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(demoTitulados.genero || []).map((g, idx) => (
                              <tr key={idx}>
                                <td>{g.genero}</td>
                                <td>{g.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>

                      <Col md={6}>
                        <h6>Tabla por rango etario</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Rango</th>
                              <th>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(demoTitulados.rangos || []).map((r, idx) => (
                              <tr key={idx}>
                                <td>{r.rango}</td>
                                <td>{r.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </Tab>

            {/* =======================
                TAB 3: ASISTENCIA REAL (USADAS)
                ======================= */}
            <Tab eventKey="usadas" title="✅ Asistencia real (escaneadas)">
              <Card className="p-3">
                {!demoUsadas ? (
                  <div className="text-muted">Sin datos para mostrar.</div>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h5 className="mb-0">✅ Demografía (escaneadas)</h5>
                      <small className="text-muted">
                        Edad promedio: <b>{Number(demoUsadas.edad_promedio || 0).toFixed(1)}</b>
                      </small>
                    </div>

                    <Row className="g-3 mt-2">
                      <Col md={6}>
                        <h6 className="mt-2">Género (check-ins)</h6>
                        <div style={{ width: "100%", height: 260 }}>
                          <ResponsiveContainer>
                            <BarChart data={demoUsadas.genero || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="genero" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="cantidad" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Col>

                      <Col md={6}>
                        <h6 className="mt-2">Rangos de edad (check-ins)</h6>
                        <div style={{ width: "100%", height: 260 }}>
                          <ResponsiveContainer>
                            <BarChart data={demoUsadas.rangos || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="rango" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="cantidad" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Col>
                    </Row>

                    <hr className="my-3" />

                    <h6>Ingresos por hora</h6>
                    {Array.isArray(ingresosHora) && ingresosHora.length > 0 ? (
                      <div style={{ width: "100%", height: 280 }}>
                        <ResponsiveContainer>
                          <LineChart data={ingresosHora}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hora" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="cantidad" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-muted">Todavía no hay escaneos.</div>
                    )}

                    <hr />

                    <Row className="g-3">
                      <Col md={6}>
                        <h6>Tabla por género</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Género</th>
                              <th>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(demoUsadas.genero || []).map((g, idx) => (
                              <tr key={idx}>
                                <td>{g.genero}</td>
                                <td>{g.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>

                      <Col md={6}>
                        <h6>Tabla por rango etario</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Rango</th>
                              <th>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(demoUsadas.rangos || []).map((r, idx) => (
                              <tr key={idx}>
                                <td>{r.rango}</td>
                                <td>{r.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
}