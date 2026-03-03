import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import NavBar from "./components/layout/NavBar";
import PiePagina from "./components/layout/piePag";
import MostrarEventos from "./components/eventos/mostrareventos/mostrarEventos";
import Detalles from "./components/eventos/mostrareventos/Detalles";
import AgregarEvento from "./components/eventos/agregarevento/agregarEvento";
import FormularioRoles from "./pages/superAdmin/FormularioRoles";
import GestionUsuarios from "./pages/superAdmin/GestionUsuarios";
import GestionEventos from "./pages/superAdmin/GestionEventos";
import { CarritoProvider } from "./contexts/carritoContext/CarritoContext";
import Carrito from "./components/carrito/carrito";
import AdminPanel from "./components/auth/AdminPanel";
import RutaProtegida from "./routes/RutaProtegida";
import MostrarImagenes from "./components/eventos/mostrareventos/MostrarImagenes";
import EditarCuenta from "./pages/usuario/EditarCuenta";
import MisEntradas from "./pages/usuario/MisEntradas";
import ValidarEntradas from "./pages/admin/ValidarEntradas";
import ReportesEventos from "./pages/admin/ReportesEventos";
import CheckoutEvento from "./components/eventos/mostrareventos/CheckoutEvento";
import GestionarStaff from "./pages/productor/GestionarStaff";

function App() {
  const [buscar, setBuscar] = useState("");

  return (
    <CarritoProvider>
      <BrowserRouter>
        <NavBar buscar={buscar} setBuscar={setBuscar} />
        <div className="main-content" style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/mostrarEvento" />} />

            <Route
              path="/mostrarEvento"
              element={
                <>
                  <MostrarImagenes />
                  <MostrarEventos buscar={buscar} />
                </>
              }
            />

            <Route path="/evento/:id" element={<Detalles />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* Panel (si lo usás como dashboard general) */}
            <Route
              path="/admin"
              element={
                <RutaProtegida rolesPermitidos={["productor", "superAdmin"]}>
                  <AdminPanel />
                </RutaProtegida>
              }
            />

            {/* Crear evento: productor o superAdmin */}
            <Route
              path="/agregarEvento"
              element={
                <RutaProtegida rolesPermitidos={["productor", "superAdmin"]}>
                  <AgregarEvento />
                </RutaProtegida>
              }
            />

            {/* SuperAdmin */}
            <Route
              path="/roles"
              element={
                <RutaProtegida rolesPermitidos={["superAdmin"]}>
                  <FormularioRoles />
                </RutaProtegida>
              }
            />

            <Route
              path="/usuarios"
              element={
                <RutaProtegida rolesPermitidos={["superAdmin"]}>
                  <GestionUsuarios />
                </RutaProtegida>
              }
            />

            <Route
              path="/eventos"
              element={
                <RutaProtegida rolesPermitidos={["superAdmin"]}>
                  <GestionEventos />
                </RutaProtegida>
              }
            />

            {/* Cuenta: cualquier logueado */}
            <Route
              path="/editar-cuenta"
              element={
                <RutaProtegida rolesPermitidos={["user", "productor", "superAdmin"]}>
                  <EditarCuenta />
                </RutaProtegida>
              }
            />

            {/* Checkout: solo user (y si querés productor/superAdmin también, lo abrimos) */}
            <Route
              path="/checkout/:id"
              element={
                <RutaProtegida rolesPermitidos={["user"]}>
                  <CheckoutEvento />
                </RutaProtegida>
              }
            />

            <Route
              path="/mis-entradas"
              element={
                <RutaProtegida rolesPermitidos={["user"]}>
                  <MisEntradas />
                </RutaProtegida>
              }
            />

            {/* Operación: productor y superAdmin */}
           <Route
  path="/validar-entradas"
  element={
    <RutaProtegida rolesPermitidos={["staff", "productor", "superAdmin"]}>
      <ValidarEntradas />
    </RutaProtegida>
  }
/>

            <Route
              path="/reportes-eventos"
              element={
                <RutaProtegida rolesPermitidos={["productor", "superAdmin"]}>
                  <ReportesEventos />
                </RutaProtegida>
              }
            />

          <Route
  path="/staff"
  element={
    <RutaProtegida rolesPermitidos={["productor", "superAdmin"]}>
      <GestionarStaff />
    </RutaProtegida>
  }
/>

          </Routes>

        </div>
        <PiePagina />
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;