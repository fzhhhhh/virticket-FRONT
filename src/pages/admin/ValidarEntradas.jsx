import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { validarEntrada } from "../../services/api";

export default function ValidarEntradas() {
  const [codigo, setCodigo] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onValidar = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");

    const c = codigo.trim();
    if (!c) return setErrMsg("Pegá o escaneá un código QR.");

    try {
      setLoading(true);
      const resp = await validarEntrada(c);
      setOkMsg(resp?.mensaje || "✅ Entrada validada");
      setCodigo("");
    } catch (err) {
      setErrMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">📷 Validar Entradas</h2>

      <Card className="p-3">
        {okMsg && <Alert variant="success">{okMsg}</Alert>}
        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        <Form onSubmit={onValidar}>
          <Form.Group className="mb-3">
            <Form.Label>Código QR (token)</Form.Label>
            <Form.Control
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Pegá acá el código del QR"
            />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? "Validando..." : "Validar"}
          </Button>
        </Form>
      </Card>

      <div className="text-muted mt-3" style={{ fontSize: 13 }}>
        Tip: por ahora podés escanear el QR con el celu y copiar el texto. En el próximo paso lo conectamos a la cámara del navegador.
      </div>
    </div>
  );
}