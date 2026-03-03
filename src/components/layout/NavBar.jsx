import { Button, Offcanvas } from "react-bootstrap";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Buscador from "../eventos/buscador/buscador";
import Login from "../auth/Login";
import { useSesion } from "../../contexts/sesionContext/SesionContext";
import "./navbar.css";
import logo from "../../assets/logo/logoestiradooo.png";
import {
  FaUserShield,
  FaPlus,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaUsers,
} from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

const NavBar = ({ buscar, setBuscar }) => {
  const location = useLocation();
  const { usuario, logoutUsuario } = useSesion();
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const role = usuario?.role; // "user" | "productor" | "superAdmin" | "staff"
  const isProductor = role === "productor";
  const isSuper = role === "superAdmin";
  const isStaff = role === "staff";
  const isUser = role === "user";

  const mostrarBuscador = location.pathname === "/mostrarEvento";
  const cerrarMenu = () => setMostrarMenu(false);

  return (
    <>
      <nav className="navegacion">
        <div className="navbar-inner">
          {/* IZQUIERDA */}
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <img src={logo} alt="virTicket Logo" />
            </Link>
          </div>

          {/* CENTRO */}
          <div className="navbar-center">
            {mostrarBuscador && (
              <Buscador buscador={buscar} OnSearch={setBuscar} />
            )}
          </div>

          {/* DERECHA */}
          <div className="navbar-right">
            {!usuario && <Login />}

            {usuario && (
              <Button
                variant="outline-light"
                onClick={() => setMostrarMenu(true)}
              >
                <FaBars />
              </Button>
            )}
          </div>
        </div>
      </nav>

      <Offcanvas
        placement="end"
        show={mostrarMenu}
        onHide={cerrarMenu}
        backdrop
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column gap-3">
          {usuario ? (
            <>
              <div className="text-muted fw-semibold">
                <FaUserShield className="me-1" />
                Bienvenido, {usuario?.nombre || "Usuario"}{" "}
                <span className="ms-2 badge bg-secondary">{role}</span>
              </div>

              {/* PRODUCTOR o SUPERADMIN */}
              {(isProductor || isSuper) && (
                <>
                  <Link to="/agregarEvento" onClick={cerrarMenu}>
                    <Button variant="success" className="w-100">
                      <FaPlus className="me-2" />
                      Agregar Evento
                    </Button>
                  </Link>

                  <Link to="/staff" onClick={cerrarMenu}>
                    <Button variant="outline-primary" className="w-100">
                      👥 Gestionar Staff
                    </Button>
                  </Link>

                  <Link to="/validar-entradas" onClick={cerrarMenu}>
                    <Button variant="outline-primary" className="w-100">
                      📷 Validar Entradas
                    </Button>
                  </Link>

                  <Link to="/reportes-eventos" onClick={cerrarMenu}>
                    <Button variant="success" className="w-100">
                      <FaChartBar className="me-2" />
                      Reportes de Eventos
                    </Button>
                  </Link>
                </>
              )}

              {/* STAFF */}
              {isStaff && (
                <>
                  <Link to="/validar-entradas" onClick={cerrarMenu}>
                    <Button variant="outline-primary" className="w-100">
                      📷 Validar Entradas
                    </Button>
                  </Link>
                </>
              )}

              {/* SOLO SUPERADMIN */}
              {isSuper && (
                <>
                  <Link to="/roles" onClick={cerrarMenu}>
                    <Button variant="info" className="w-100">
                      <FaUserShield className="me-2" />
                      Asignar Roles
                    </Button>
                  </Link>

                  <Link to="/usuarios" onClick={cerrarMenu}>
                    <Button variant="danger" className="w-100">
                      <FaUsers className="me-2" />
                      Gestionar Usuarios
                    </Button>
                  </Link>

                  <Link to="/eventos" onClick={cerrarMenu}>
                    <Button variant="danger" className="w-100">
                      <FaUsers className="me-2" />
                      Gestionar Eventos
                    </Button>
                  </Link>
                </>
              )}

              {/* SOLO USER */}
              {isUser && (
                <>
                  <Link to="/carrito" onClick={cerrarMenu}>
                    <Button variant="outline-primary" className="w-100">
                      <FaShoppingCart className="me-2" />
                      Carrito
                    </Button>
                  </Link>

                  <Link to="/mis-entradas" onClick={cerrarMenu}>
                    <Button variant="outline-primary" className="w-100">
                      <FaTicketAlt className="me-2" />
                      Mis QRs
                    </Button>
                  </Link>
                </>
              )}

              {/* CUALQUIER LOGUEADO */}
              <Link to="/editar-cuenta" onClick={cerrarMenu}>
                <Button variant="outline-primary" className="w-100">
                  <FaUserShield className="me-2" />
                  Editar cuenta
                </Button>
              </Link>

              <Button
                variant="danger"
                className="w-100"
                onClick={() => {
                  logoutUsuario();
                  cerrarMenu();
                }}
              >
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <div className="d-md-none">
              <Login />
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavBar;