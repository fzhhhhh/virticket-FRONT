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
import EditarCuenta from "./pages/usuario/EditarCuenta"; // 🔹 NUEVA IMPORTACIÓN
import MisEntradas from "./pages/usuario/MisEntradas"; // 🔹 NUEVA IMPORTACIÓN
import ValidarEntradas from "./pages/admin/ValidarEntradas";

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

            <Route
              path="/admin"
              element={
                <RutaProtegida rolesPermitidos={["admin", "superAdmin"]}>
                  <AdminPanel />
                </RutaProtegida>
              }
            />

            <Route
              path="/agregarEvento"
              element={
                <RutaProtegida rolesPermitidos={["admin", "superAdmin"]}>
                  <AgregarEvento />
                </RutaProtegida>
              }
            />

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

            <Route
              path="/editar-cuenta"
              element={
                <RutaProtegida rolesPermitidos={["user", "admin", "superAdmin"]}>
                  <EditarCuenta />
                </RutaProtegida>
              }
            />

            <Route
              path="/mis-entradas"
              element={
                <RutaProtegida rolesPermitidos={["user", "admin", "superAdmin"]}>
                   <MisEntradas />
                 </RutaProtegida>
              }
            />

            <Route
               path="/validar-entradas"
               element={
                  <RutaProtegida rolesPermitidos={["admin", "superAdmin"]}>
                  <ValidarEntradas />
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