import { useState } from "react";
import { Button, Col, Form, FormGroup, Modal, Row, Spinner, Alert } from "react-bootstrap";
import { register } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Register = () => {
  const [nombre, setUser] = useState("");
  const [correo, setEmail] = useState("");
  const [contraseña, setPassword] = useState("");
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

    try {
      const response = await register(nombre, correo, contraseña);

      if (response.error) {
        setError(response.error);
      } else {
        setExito("✅ Registro exitoso. Redirigiendo a login...");
        setError(null);
        setTimeout(() => {
          setExito(null);
          handleCerrar();
          navigate("/login");
        }, 2000);
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
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Ingresar nombre"
                onChange={(e) => setUser(e.target.value)}
                value={nombre}
                autoFocus
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="email"
                required
                placeholder="Ingresar email"
                onChange={(e) => setEmail(e.target.value)}
                value={correo}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                required
                placeholder="Ingresar contraseña"
                onChange={(e) => setPassword(e.target.value)}
                value={contraseña}
              />
            </FormGroup>
            {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}
            {exito && <Alert variant="success" className="text-center py-2">{exito}</Alert>}
            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={cargando}
                  style={{ minWidth: 140 }}
                >
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