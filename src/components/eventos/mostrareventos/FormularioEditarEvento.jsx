import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const FormularioEditarEvento = ({ evento, onGuardar, onCancelar }) => {
  const [form, setForm] = useState({ ...evento });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" || type === "switch" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataBackend = {
      id: form.id,
      nombre: form.nombreEvento,
      descripcion: form.descripcion,
      fecha: form.fechaEvento,
      horario: form.horarioEvento,
      lugar: form.lugarEvento,
      precio: form.precioEvento,
      imagen: form.imagenEvento,
      disponible: form.disponible,
    };

    console.log("📨 Enviando al backend:", dataBackend);
    onGuardar(dataBackend);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombreEvento"
          value={form.nombreEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="fechaEvento"
          value={form.fechaEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Horario</Form.Label>
        <Form.Control
          type="time"
          name="horarioEvento"
          value={form.horarioEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Lugar</Form.Label>
        <Form.Control
          name="lugarEvento"
          value={form.lugarEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          name="precioEvento"
          value={form.precioEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Imagen</Form.Label>
        <Form.Control
          type="url"
          name="imagenEvento"
          value={form.imagenEvento}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Check
        type="switch"
        name="disponible"
        checked={form.disponible}
        onChange={handleChange}
        label={form.disponible ? "Disponible" : "No disponible"}
      />
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Guardar cambios
        </Button>
      </div>
    </Form>
  );
};

export default FormularioEditarEvento;