import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getMisEntradas } from "../../services/api";

export default function MisEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMisEntradas();
        setEntradas(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Error cargando entradas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container my-4">Cargando mis entradas...</div>;
  if (error) return <div className="container my-4 text-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">🎟️ Mis Entradas</h2>

      {entradas.length === 0 ? (
        <p>No tenés entradas todavía.</p>
      ) : (
        <div className="row">
          {entradas.map((en) => (
            <div className="col-md-6 col-lg-4 mb-3" key={en.id}>
              <div className="card p-3">
                <h5 className="mb-1">{en.nombre}</h5>
                <div className="text-muted" style={{ fontSize: 14 }}>
                  {en.fecha ? new Date(en.fecha).toLocaleDateString("es-AR") : ""}{" "}
                  {en.horario ? `• ${String(en.horario).slice(0, 5)}` : ""}
                </div>
                <div className="text-muted" style={{ fontSize: 14 }}>{en.lugar}</div>

                <div className="mt-2">
                  Estado:{" "}
                  <b className={en.estado === "valida" ? "text-success" : "text-danger"}>
                    {en.estado}
                  </b>
                </div>

                <div className="mt-3 d-flex justify-content-center">
                  <QRCode value={en.codigo_qr} size={160} />
                </div>

                <div className="mt-2 text-center text-muted" style={{ fontSize: 12 }}>
                  Entrada #{en.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

