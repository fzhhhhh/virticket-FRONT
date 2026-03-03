import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { getMisEntradas, completarTitular } from "../../services/api";

export default function MisEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    titular_nombre: "",
    titular_apellido: "",
    titular_dni: "",
    titular_fecha_nacimiento: "",
    titular_genero: "",
  });
  const [guardando, setGuardando] = useState(false);

  const cargarEntradas = async () => {
    try {
      const data = await getMisEntradas();
      setEntradas(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error cargando entradas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEntradas();
  }, []);

  const abrirModal = (entrada) => {
    setEntradaSeleccionada(entrada);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      await completarTitular(entradaSeleccionada.id, formData);
      setShowModal(false);
      setFormData({
        titular_nombre: "",
        titular_apellido: "",
        titular_dni: "",
        titular_fecha_nacimiento: "",
        titular_genero: "",
      });
      cargarEntradas();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="container my-4">Cargando mis entradas...</div>;
  if (error) return <div className="container my-4 text-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">🎟️ Mis Entradas</h2>

      {entradas.length === 0 ? (
        <p>No tenés entradas todavía.</p>
      ) : (
        <div className="row">
          {entradas.map((en) => (
            <div className="col-md-6 col-lg-4 mb-3" key={en.id}>
              <div className="card p-3">
                <h5 className="mb-1">{en.nombre}</h5>

                <div className="text-muted" style={{ fontSize: 14 }}>
                  {en.fecha ? new Date(en.fecha).toLocaleDateString("es-AR") : ""}{" "}
                  {en.horario ? `• ${String(en.horario).slice(0, 5)}` : ""}
                </div>

                <div className="text-muted" style={{ fontSize: 14 }}>{en.lugar}</div>

                <div className="mt-2">
                  Estado:{" "}
                  <b className={en.estado === "valida" ? "text-success" : "text-danger"}>
                    {en.estado}
                  </b>
                </div>

                {Number(en.titulado) === 0 ? (
                  <div className="mt-3 text-center">
                    <Button variant="warning" onClick={() => abrirModal(en)}>
                      Completar datos del asistente
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 text-center">
                      <strong>{en.titular_nombre} {en.titular_apellido}</strong>
                    </div>
                    <div className="mt-3 d-flex justify-content-center">
                      <QRCode value={en.codigo_qr} size={160} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Completar datos del asistente</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>

            <Form.Group className="mb-2">
              <Form.Control
                required
                placeholder="Nombre"
                onChange={(e) => setFormData({ ...formData, titular_nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                required
                placeholder="Apellido"
                onChange={(e) => setFormData({ ...formData, titular_apellido: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                placeholder="DNI"
                onChange={(e) => setFormData({ ...formData, titular_dni: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                type="date"
                required
                onChange={(e) => setFormData({ ...formData, titular_fecha_nacimiento: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Select
                onChange={(e) => setFormData({ ...formData, titular_genero: e.target.value })}
              >
                <option value="">Género</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>No binario</option>
                <option>Prefiero no decir</option>
              </Form.Select>
            </Form.Group>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? <Spinner size="sm" animation="border" /> : "Guardar y generar QR"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}