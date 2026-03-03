import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import {
  asignarStaff,
  getEventos,
  getStaffDelEvento,
  getStaffDisponibles,
  quitarStaff,
} from "../../services/staffApi";

export default function GestionarStaff() {
  const [eventos, setEventos] = useState([]);
  const [eventoId, setEventoId] = useState("");

  const [staffDisponibles, setStaffDisponibles] = useState([]);
  const [staffAsignado, setStaffAsignado] = useState([]);

  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  const evento = useMemo(
    () => eventos.find((e) => String(e.id) === String(eventoId)) || null,
    [eventos, eventoId]
  );

  async function cargarEventos() {
    setLoading(true);
    setError(null);
    try {
      const evs = await getEventos();
      setEventos(Array.isArray(evs) ? evs : []);
    } catch (e) {
      setError(e.message);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  async function cargarStaffEvento(id) {
    setError(null);
    try {
      const [asignados, disponibles] = await Promise.all([
        getStaffDelEvento(id),
        getStaffDisponibles(id),
      ]);

      setStaffAsignado(Array.isArray(asignados) ? asignados : []);
      setStaffDisponibles(Array.isArray(disponibles) ? disponibles : []);
    } catch (e) {
      setError(e.message);
      setStaffAsignado([]);
      setStaffDisponibles([]);
    }
  }

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    if (eventoId) {
      setStaffId("");
      cargarStaffEvento(eventoId);
    } else {
      setStaffAsignado([]);
      setStaffDisponibles([]);
      setStaffId("");
    }
  }, [eventoId]);

  const handleAsignar = async () => {
    if (!eventoId || !staffId) return;
    setWorking(true);
    setError(null);
    setOk(null);

    try {
      await asignarStaff(eventoId, Number(staffId));
      setOk("✅ Staff asignado");
      setStaffId("");
      await cargarStaffEvento(eventoId); // ✅ refresca asignados + disponibles
    } catch (e) {
      setError(e.message);
    } finally {
      setWorking(false);
      setTimeout(() => setOk(null), 2500);
    }
  };

  const handleQuitar = async (idStaff) => {
    if (!eventoId) return;
    setWorking(true);
    setError(null);
    setOk(null);

    try {
      await quitarStaff(eventoId, idStaff);
      setOk("✅ Staff removido");
      await cargarStaffEvento(eventoId); // ✅ refresca asignados + disponibles
    } catch (e) {
      setError(e.message);
    } finally {
      setWorking(false);
      setTimeout(() => setOk(null), 2500);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">👥 Gestionar Staff</h3>

      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <Spinner size="sm" animation="border" />
          <span>Cargando...</span>
        </div>
      ) : null}

      {error && <Alert variant="danger">{error}</Alert>}
      {ok && <Alert variant="success">{ok}</Alert>}

      <Card className="p-3 mb-3">
        <Form.Group>
          <Form.Label>Elegí un evento</Form.Label>
          <Form.Select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
            <option value="">-- Seleccioná --</option>
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                #{e.id} - {e.nombre}
              </option>
            ))}
          </Form.Select>

          {evento && (
            <small className="text-muted d-block mt-2">
              {new Date(evento.fecha).toLocaleDateString("es-AR")} • {evento.lugar || "-"}
            </small>
          )}
        </Form.Group>
      </Card>

      {!eventoId ? (
        <Alert variant="secondary">Seleccioná un evento para asignar staff.</Alert>
      ) : (
        <Row className="g-3">
          <Col md={5}>
            <Card className="p-3">
              <h5 className="mb-3">➕ Asignar staff</h5>

              <Form.Select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
                <option value="">-- Elegí un staff --</option>
                {staffDisponibles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} ({s.correo})
                  </option>
                ))}
              </Form.Select>

              <Button className="mt-3" disabled={!staffId || working} onClick={handleAsignar}>
                {working ? "Asignando..." : "Asignar"}
              </Button>

              {staffDisponibles.length === 0 && (
                <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                  No hay staff disponible (o todavía no creaste usuarios con rol <b>staff</b>).
                </div>
              )}
            </Card>
          </Col>

          <Col md={7}>
            <Card className="p-3">
              <h5 className="mb-3">📋 Staff asignado</h5>

              {staffAsignado.length === 0 ? (
                <div className="text-muted">No hay staff asignado todavía.</div>
              ) : (
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffAsignado.map((s) => (
                      <tr key={s.id}>
                        <td>{s.nombre}</td>
                        <td>{s.correo}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={working}
                            onClick={() => handleQuitar(s.id)}
                          >
                            Quitar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}