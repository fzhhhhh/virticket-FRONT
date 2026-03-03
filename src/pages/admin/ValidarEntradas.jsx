import { useEffect, useRef, useState } from "react";
import { Card, Button, Alert, Form, Spinner } from "react-bootstrap";
import { Html5Qrcode } from "html5-qrcode";
import { validarEntrada } from "../../services/api"; // ajustá la ruta según tu proyecto

export default function ValidarEntradas() {
  const qrRef = useRef(null);          // instancia Html5Qrcode
  const runningRef = useRef(false);    // cámara corriendo
  const lockRef = useRef(false);       // anti doble-scan

  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [codigoManual, setCodigoManual] = useState("");
  const [okMsg, setOkMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const limpiarMensajes = () => {
    setOkMsg(null);
    setErrMsg(null);
  };

  const doValidar = async (codigo_qr) => {
    if (!codigo_qr) return;

    // evita que dispare 10 veces el mismo QR
    if (lockRef.current) return;
    lockRef.current = true;

    setLoading(true);
    limpiarMensajes();

    try {
      const res = await validarEntrada(codigo_qr.trim());
      setOkMsg(res?.mensaje || "✅ Entrada validada");
      setCodigoManual("");
    } catch (e) {
      setErrMsg(e.message || "Error al validar");
    } finally {
      setLoading(false);
      // pequeño cooldown para permitir otro escaneo
      setTimeout(() => {
        lockRef.current = false;
      }, 1500);
    }
  };

  const iniciarCamara = async () => {
    try {
      setStarting(true);
      limpiarMensajes();

      if (!qrRef.current) {
        qrRef.current = new Html5Qrcode("qr-reader");
      }

      if (runningRef.current) return;

      // cámara trasera (environment)
      await qrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
        },
        async (decodedText) => {
          // decodedText suele ser tu uuid token (codigo_qr)
          await doValidar(decodedText);
        },
        () => {
          // onScanFailure: lo dejamos silencioso
        }
      );

      runningRef.current = true;
    } catch (e) {
      setErrMsg(
        e?.message ||
          "No se pudo iniciar la cámara. Probá en HTTPS o aceptá permisos."
      );
    } finally {
      setStarting(false);
    }
  };

  const detenerCamara = async () => {
    try {
      limpiarMensajes();
      if (qrRef.current && runningRef.current) {
        await qrRef.current.stop();
        await qrRef.current.clear();
      }
    } catch {
      // ignore
    } finally {
      runningRef.current = false;
    }
  };

  useEffect(() => {
    // cleanup al salir de la pantalla
    return () => {
      detenerCamara();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onValidarManual = async (e) => {
    e.preventDefault();
    await doValidar(codigoManual);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">📷 Validar Entradas</h2>

      <Card className="p-3 mb-3">
        {okMsg && <Alert variant="success">{okMsg}</Alert>}
        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        <div className="d-flex gap-2 flex-wrap mb-3">
          <Button onClick={iniciarCamara} disabled={starting}>
            {starting ? "Iniciando cámara..." : "Iniciar cámara"}
          </Button>

          <Button variant="secondary" onClick={detenerCamara}>
            Detener cámara
          </Button>

          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Validando...</span>
            </div>
          )}
        </div>

        {/* Acá se renderiza el video */}
        <div
          id="qr-reader"
          style={{
            width: "100%",
            maxWidth: 420,
            margin: "0 auto",
            borderRadius: 12,
            overflow: "hidden",
          }}
        />
      </Card>

      {/* Fallback manual por si el celu no da permisos */}
      <Card className="p-3">
        <Form onSubmit={onValidarManual}>
          <Form.Group className="mb-3">
            <Form.Label>Código QR (manual)</Form.Label>
            <Form.Control
              value={codigoManual}
              onChange={(e) => setCodigoManual(e.target.value)}
              placeholder="Pegá acá el token del QR"
            />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            Validar manual
          </Button>
        </Form>

        <div className="text-muted mt-3" style={{ fontSize: 13 }}>
          Tip: si no abre la cámara, probá con HTTPS (ngrok) o revisá permisos del navegador.
        </div>
      </Card>
    </div>
  );
}