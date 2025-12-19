import { useState } from "react";
import { Button, Col, Form, FormGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import Register from "./Register";
import { useSesion } from "../../contexts/sesionContext/SesionContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { loginUsuario } = useSesion();

  const [show, setShow] = useState(false);
  const handleCerrar = () => setShow(false);
  const handleAbrir = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const response = await login(email, password);

      if (response.error) {
        setError(response.error);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        loginUsuario(response);
        localStorage.setItem("token", response.token);
        setError(null);
        handleCerrar();
        navigate("/mostrarEvento");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("❌ Error en login:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="boton-agregar"
        onClick={handleAbrir}
        style={{ fontWeight: "bold", letterSpacing: "1px" }}
      >
        INGRESAR
      </Button>

      <Modal
        className="mt-5 mx-3 p-3 px-5 shadow"
        show={show}
        onHide={handleCerrar}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Inicio de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} autoComplete="on">
            <FormGroup className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Ingresar email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoFocus
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Ingresar contraseña"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormGroup>

            {error && (
              <div className="alert alert-danger text-center py-2" role="alert">
                {error}
              </div>
            )}

            <Row className="mb-2">
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
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </Col>
            </Row>
            <hr />
            <Row className="mt-2">
              <Col className="text-center">
                <span>¿No tienes cuenta?</span>
                <div className="mt-2">
                  <Register />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;