import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Alert, Card, Row, Col, InputGroup, Image, Spinner } from "react-bootstrap";
import { useSesion } from "../../../contexts/sesionContext/SesionContext";
import { getLugares } from "../../../services/api";

const LUGARES_PREDEFINIDOS = [
  { id: 1, nombre: "Teatro Gran Rex", direccion: "Av. Corrientes 857, CABA" },
  { id: 2, nombre: "Luna Park", direccion: "Av. Eduardo Madero 470, CABA" },
  { id: 3, nombre: "Teatro Colón", direccion: "Cerrito 628, CABA" },
  { id: 4, nombre: "Movistar Arena", direccion: "Humboldt 450, CABA" },
  { id: 5, nombre: "Teatro Opera", direccion: "Av. Corrientes 860, CABA" },
  { id: 6, nombre: "Estadio GEBA", direccion: "Av. Figueroa Alcorta 7597, CABA" },
  { id: 7, nombre: "La Trastienda", direccion: "Balcarce 460, CABA" },
  { id: 8, nombre: "Niceto Club", direccion: "Niceto Vega 5510, CABA" },
];

const API_URL = import.meta.env.VITE_API_URL;

const AgregarEvento = ({ OnEventoAdded }) => {
  const { usuario } = useSesion();

  const role = usuario?.role; // "productor" | "superAdmin"
  const isSuperAdmin = role === "superAdmin";

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [disponible, setDisponible] = useState(false);

  const [lugarSeleccionado, setLugarSeleccionado] = useState("");
  const [mostrarNuevoLugar, setMostrarNuevoLugar] = useState(false);
  const [nuevoLugar, setNuevoLugar] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [imagenPreviewError, setImagenPreviewError] = useState(false);

  const [lugares, setLugares] = useState([]);
  const [productores, setProductores] = useState([]);
  const [productorId, setProductorId] = useState(""); // solo superAdmin

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const lugaresObtenidos = await getLugares();
        setLugares(Array.isArray(lugaresObtenidos) ? lugaresObtenidos : []);
      } catch {
        setLugares([]);
      }
    };
    fetchLugares();
  }, []);

  // ✅ Si es superAdmin: traemos productores para asignación
  useEffect(() => {
    const fetchProductores = async () => {
      if (!isSuperAdmin) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/superadmin/productores`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar productores");

        // esperable: { productores: [...] } o [...]
        const list = Array.isArray(data) ? data : Array.isArray(data.productores) ? data.productores : [];
        setProductores(list);

        // default: si no eligió, setear primero
        if (!productorId && list[0]?.id) setProductorId(String(list[0].id));
      } catch (e) {
        console.error(e);
        setProductores([]);
      }
    };

    fetchProductores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  const lugaresSelect = useMemo(() => {
    // si algún día usás "lugares" de DB, podés concatenar acá.
    return LUGARES_PREDEFINIDOS;
  }, []);

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setFecha("");
    setHorario("");
    setPrecio("");
    setImagen("");
    setDisponible(false);
    setLugarSeleccionado("");
    setNuevoLugar("");
    setMostrarNuevoLugar(false);
    setImagenPreviewError(false);
    setMensaje(null);
    setError("");
  };

  const handleAgregarEvento = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setError("");
    setMensaje(null);

    const lugarFinal = mostrarNuevoLugar ? nuevoLugar.trim() : lugarSeleccionado;

    if (!lugarFinal) {
      setError("Seleccioná un lugar o cargá uno nuevo.");
      setEnviando(false);
      return;
    }

    const nuevoEvento = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      fecha,
      horario,
      lugar: lugarFinal,
      precio: Number(precio),
      imagen: imagen.trim(),
      disponible,
      ...(isSuperAdmin && productorId ? { productor_id: Number(productorId) } : {}),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEvento),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Error al agregar evento");
        return;
      }

      setMensaje("✅ Evento agregado correctamente.");
      if (OnEventoAdded) OnEventoAdded();
      resetForm();
      setTimeout(() => setMensaje(null), 2500);
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card
      bg="dark"
      text="light"
      className="mx-auto my-4 p-4"
      style={{
        maxWidth: "600px",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(0,0,0,0.7)",
      }}
    >
      <Card.Body>
        <Card.Title className="mb-4 text-center" style={{ fontWeight: 700, fontSize: "1.8rem" }}>
          Agregar Nuevo Evento
        </Card.Title>

        {mensaje && <Alert variant="success" className="text-center">{mensaje}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form className="formulario-agregar-evento text-dark" onSubmit={handleAgregarEvento} noValidate>
          {/* ✅ SOLO SUPERADMIN: asignar productor */}
          {isSuperAdmin && (
            <Form.Group className="mb-3">
              <Form.Label>Asignar a productor</Form.Label>
              <Form.Select value={productorId} onChange={(e) => setProductorId(e.target.value)}>
                {productores.length === 0 ? (
                  <option value="">(Sin productores cargados)</option>
                ) : (
                  productores.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} - {p.nombre} ({p.correo})
                    </option>
                  ))
                )}
              </Form.Select>
              <Form.Text className="text-muted">
                El evento quedará asociado al productor elegido (productor_id).
              </Form.Text>
            </Form.Group>
          )}

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
              <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </Form.Group>

            <Form.Group as={Col} controlId="horario">
              <Form.Label>Horario</Form.Label>
              <Form.Control type="time" value={horario} onChange={(e) => setHorario(e.target.value)} required />
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
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="imagen" className="mb-4">
            <Form.Label>URL de imagen del evento</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imagen}
              onChange={(e) => {
                setImagen(e.target.value);
                setImagenPreviewError(false);
              }}
              pattern="https?://.+"
            />

            {imagen && !imagenPreviewError && (
              <div className="mt-2 text-center">
                <Image
                  src={imagen}
                  alt="Preview"
                  rounded
                  style={{ maxHeight: 150, maxWidth: "100%", objectFit: "cover" }}
                  onError={() => setImagenPreviewError(true)}
                />
              </div>
            )}

            {imagenPreviewError && (
              <Form.Text className="text-danger">No se pudo cargar la imagen.</Form.Text>
            )}
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
              <Form.Select value={lugarSeleccionado} onChange={(e) => setLugarSeleccionado(e.target.value)}>
                <option value="">Seleccione un lugar</option>
                {lugaresSelect.map((l) => (
                  <option key={l.id} value={l.nombre}>
                    {l.nombre} - {l.direccion}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={resetForm} disabled={enviando}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary" disabled={enviando}>
              {enviando ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                  Enviando...
                </>
              ) : (
                "Agregar Evento"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgregarEvento;