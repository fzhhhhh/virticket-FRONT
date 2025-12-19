import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Row, Col, InputGroup, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getLugares } from "../../../services/api";
import { Spinner } from "react-bootstrap";

const LUGARES_PREDEFINIDOS = [
  { id: 1, nombre: "Teatro Gran Rex", direccion: "Av. Corrientes 857, CABA" },
  { id: 2, nombre: "Luna Park", direccion: "Av. Eduardo Madero 470, CABA" },
  { id: 3, nombre: "Teatro Colón", direccion: "Cerrito 628, CABA" },
  { id: 4, nombre: "Movistar Arena", direccion: "Humboldt 450, CABA" },
  { id: 5, nombre: "Teatro Opera", direccion: "Av. Corrientes 860, CABA" },
  { id: 6, nombre: "Estadio GEBA", direccion: "Av. Figueroa Alcorta 7597, CABA" },
  { id: 7, nombre: "La Trastienda", direccion: "Balcarce 460, CABA" },
  { id: 8, nombre: "Niceto Club", direccion: "Niceto Vega 5510, CABA" },
  // Agrega más lugares según necesites
];

const AgregarEvento = ({ OnEventoAdded }) => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [lugar, setLugar] = useState("");
  const [nuevoLugar, setNuevoLugar] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [error, setError] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState("");
  const [mostrarNuevoLugar, setMostrarNuevoLugar] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [imagenPreviewError, setImagenPreviewError] = useState(false);
  const [lugares, setLugares] = useState([]);
  const [disponible, setDisponible] = useState(false);


  useEffect(() => {
    const fetchLugares = async () => {
      const lugaresObtenidos = await getLugares();
      setLugares(lugaresObtenidos);
    };
    fetchLugares();
  }, []);

  const handleAgregarEvento = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setError(null);
    setMensaje(null);

    const lugarFinal = mostrarNuevoLugar ? nuevoLugar : lugarSeleccionado;

    const nuevoEvento = {
      nombre,
      descripcion,
      fecha,
      horario,
      lugar: lugarFinal,
      precio,
      imagen,
      disponible
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEvento),
      });

      if (response.ok) {
        // Limpia los campos o muestra mensaje de éxito
        setNombre("");
        setDescripcion("");
        setFecha("");
        setHorario("");
        setLugar("");
        setNuevoLugar("");
        setPrecio("");
        setImagen("");
        setDireccion("");
        setSelected(null);
        setMensaje("✅ Evento agregado correctamente.");
        if (OnEventoAdded) OnEventoAdded();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        const data = await response.json();
        setError(data?.error || "Error al agregar evento");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card bg="dark" text="light" className="mx-auto my-4 p-4" style={{ maxWidth: "600px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.7)" }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
          Agregar Nuevo Evento
        </Card.Title>

        {mensaje && <Alert variant="success" className="text-center">{mensaje}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form className="formulario-agregar-evento text-dark" onSubmit={handleAgregarEvento} noValidate>
          <Form.Group controlId="nombre" className="mb-3">
            <Form.Label>Nombre del Evento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              minLength={3}
              maxLength={50}
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingrese un nombre válido (mínimo 3 caracteres).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="descripcion" className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              maxLength={200}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="fecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="horario">
              <Form.Label>Horario</Form.Label>
              <Form.Control
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
              />
            </Form.Group>
          </Row>

          <Form.Group controlId="precio" className="mb-3">
            <Form.Label>Precio</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                step="0.01"
                required
                aria-label="Precio"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="imagen" className="mb-4">
            <Form.Label>URL de imagen del evento</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imagen}
              onChange={(e) => { setImagen(e.target.value); setImagenPreviewError(false); }}
              pattern="https?://.+"
            />
            {imagen && !imagenPreviewError && (
              <div className="mt-2 text-center">
                <Image
                  src={imagen}
                  alt="Preview"
                  rounded
                  style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'cover' }}
                  onError={() => setImagenPreviewError(true)}
                />
              </div>
            )}
            {imagenPreviewError && <Form.Text className="text-danger">No se pudo cargar la imagen.</Form.Text>}
          </Form.Group>

          <Form.Group controlId="disponible" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <div className="d-flex gap-2 align-items-center mb-2">
              <Form.Check
                type="radio"
                label="Seleccionar lugar existente"
                name="tipoLugar"
                checked={!mostrarNuevoLugar}
                onChange={() => setMostrarNuevoLugar(false)}
              />
              <Form.Check
                type="radio"
                label="Agregar nuevo lugar"
                name="tipoLugar"
                checked={mostrarNuevoLugar}
                onChange={() => setMostrarNuevoLugar(true)}
              />
            </div>

            {mostrarNuevoLugar ? (
              <Form.Control
                type="text"
                value={nuevoLugar}
                onChange={(e) => setNuevoLugar(e.target.value)}
                placeholder="Ingrese el nuevo lugar"
              />
            ) : (
              <Form.Select
                value={lugarSeleccionado}
                onChange={(e) => setLugarSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un lugar</option>
                {LUGARES_PREDEFINIDOS.map((lugar) => (
                  <option key={lugar.id} value={lugar.nombre}>
                    {lugar.nombre} - {lugar.direccion}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={() => {
              // reset parcial o cerrar modal según tu UI
              setNombre("");
              setDescripcion("");
              setFecha("");
              setHorario("");
              setLugar("");
              setNuevoLugar("");
              setPrecio("");
              setImagen("");
              setDisponible(false);
              setDireccion("");
              setSelected(null);
              setMensaje(null);
              setError(null);
            }} disabled={enviando}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary" disabled={enviando}>
              {enviando ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enviando...</>) : "Agregar Evento"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgregarEvento;