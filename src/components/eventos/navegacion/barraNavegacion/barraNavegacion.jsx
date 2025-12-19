import { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Buscador from "../../buscador/buscador";
import { useSesion } from "../../../../contexts/sesionContext/SesionContext";
import { ROLES } from "../../../../data/roles";


const BarraNavegacion = () => {
  const [buscar, setBuscar] = useState("");
  const { usuario, logoutUsuario } = useSesion();
  const navigate = useNavigate();

  const handleBuscar = (value) => {
    setBuscar(value);
  };

  const handleLogout = () => {
    logoutUsuario();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4 shadow">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          🎟️ EntradasApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/mostrarEvento">
              Eventos
            </Nav.Link>
            {usuario?.role === ROLES.ADMIN && (
              <Nav.Link as={Link} to="/admin">
                Panel Admin
              </Nav.Link>
            )}
            {usuario?.role === ROLES.SUPER_ADMIN && (
              <Nav.Link as={Link} to="/superadmin">
                SuperAdmin
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/carrito">
              Carrito
            </Nav.Link>
          </Nav>
          <Buscador buscador={buscar} OnSearch={handleBuscar} />
          <div className="d-flex align-items-center ms-3">
            {usuario ? (
              <>
                <span className="text-white me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  Bienvenido, {usuario.nombre || usuario.correo}
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                as={Link}
                to="/login"
                className="ms-2"
              >
                Ingresar
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;