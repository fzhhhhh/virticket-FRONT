import { useState } from "react";
import { Button, Col, Form, FormGroup, Modal, Row, Spinner, Alert } from "react-bootstrap";
import { register } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // YYYY-MM-DD
  const [genero, setGenero] = useState("");

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleCerrar = () => setShow(false);
  const handleAbrir = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);

    // validación rápida front
    const dniClean = dni.trim() ? dni.trim().replace(/\D/g, "") : "";
    if (dniClean && (dniClean.length < 7 || dniClean.length > 10)) {
      setCargando(false);
      setError("DNI inválido (7 a 10 dígitos).");
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      correo: correo.trim(),
      contraseña,
      dni: dniClean || null,
      fecha_nacimiento: fechaNacimiento || null,
      genero: genero || null,
    };

    try {
      const response = await register(payload);

      if (response.error) {
        setError(response.error);
      } else {
        setExito("✅ Registro exitoso. Redirigiendo a login...");
        setTimeout(() => {
          setExito(null);
          handleCerrar();
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("❌ Error en registro:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" onClick={handleAbrir}>
        Registrarse
      </Button>

      <Modal className="mt-5 mx-3 p-3 px-5 shadow" show={show} onHide={handleCerrar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrarse</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} autoComplete="on">
            {/* Nombre */}
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Ingresar nombre"
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
                autoFocus
              />
            </FormGroup>

            {/* Apellido (obligatorio ahora) */}
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Ingresar apellido"
                onChange={(e) => setApellido(e.target.value)}
                value={apellido}
              />
            </FormGroup>

            {/* Email */}
            <FormGroup className="mb-3">
              <Form.Control
                type="email"
                required
                placeholder="Ingresar email"
                onChange={(e) => setCorreo(e.target.value)}
                value={correo}
              />
            </FormGroup>

            {/* Contraseña */}
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                required
                placeholder="Ingresar contraseña"
                onChange={(e) => setContraseña(e.target.value)}
                value={contraseña}
              />
            </FormGroup>

            <hr />

            {/* Opcionales */}
            <div className="text-muted mb-2" style={{ fontSize: 13 }}>
              Datos opcionales (para reportes y perfil)
            </div>

            {/* DNI opcional */}
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="DNI (opcional)"
                onChange={(e) => setDni(e.target.value)}
                value={dni}
              />
            </FormGroup>

            {/* Fecha nacimiento opcional */}
            <FormGroup className="mb-3">
              <Form.Label style={{ fontSize: 13, marginBottom: 4 }}>Fecha de nacimiento (opcional)</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setFechaNacimiento(e.target.value)}
                value={fechaNacimiento}
              />
            </FormGroup>

            {/* Género opcional */}
            <FormGroup className="mb-3">
              <Form.Select value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="">Género (opcional)</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </FormGroup>

            {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}
            {exito && <Alert variant="success" className="text-center py-2">{exito}</Alert>}

            <Row>
              <Col className="d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={cargando} style={{ minWidth: 140 }}>
                  {cargando ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Registrando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col className="text-center mt-2">
                <span>¿Ya tienes cuenta?</span>
                <div className="mt-2">
                  <Login />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Register;