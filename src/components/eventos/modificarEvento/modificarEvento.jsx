import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const LUGARES_PREDEFINIDOS = [
  { id: 1, nombre: "Teatro Gran Rex", direccion: "Av. Corrientes 857, CABA" },
  { id: 2, nombre: "Luna Park", direccion: "Av. Eduardo Madero 470, CABA" },
  { id: 3, nombre: "Teatro Colón", direccion: "Cerrito 628, CABA" },
  { id: 4, nombre: "Movistar Arena", direccion: "Humboldt 450, CABA" },
  { id: 5, nombre: "Teatro Opera", direccion: "Av. Corrientes 860, CABA" },
];

const ModificarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [lugar, setLugar] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const resp = await fetch(`http://localhost:3001/api/eventos/${id}`);
        if (!resp.ok) throw new Error("Error al cargar el evento");
        const evento = await resp.json();

        setNombre(evento.nombre || "");
        setDescripcion(evento.descripcion || "");
        setFecha(evento.fecha ? evento.fecha.split("T")[0] : "");
        setHorario(evento.horario || "");
        setLugar(evento.lugar || "");
        setPrecio(evento.precio || "");
      } catch (err) {
        console.error(err);
      }
    };

    if (id) cargarEvento();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/eventos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          fecha,
          horario,
          lugar,
          precio: Number(precio),
        }),
      });

      if (!response.ok) throw new Error("Error al modificar");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Modificar Evento</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Horario</Form.Label>
          <Form.Control
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lugar</Form.Label>
          <Form.Select
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
          >
            <option value="">Seleccione un lugar</option>
            {LUGARES_PREDEFINIDOS.map((l) => (
              <option key={l.id} value={l.nombre}>
                {l.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </Form>
    </div>
  );
};

export default ModificarEvento;