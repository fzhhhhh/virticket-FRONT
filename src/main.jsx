import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import App from './App.jsx';
import { SesionProvider } from './contexts/sesionContext/SesionContext'; // Contexto global de sesión

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SesionProvider>
        <App />
      </SesionProvider>
    </StrictMode>
  );
} else {
  console.error("❌ No se encontró el elemento root en el HTML.");
}