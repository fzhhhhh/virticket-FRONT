import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const Buscador = ({ buscador, OnSearch, compact = false }) => {
  const handleBuscadorEvento = (event) => {
    if (OnSearch) {
      OnSearch(event.target.value);
    }
  };

  const limpiarBusqueda = () => {
    if (OnSearch) OnSearch("");
  };

  if (compact) {
    return (
      <Form.Group className="m-0">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar evento"
            onChange={handleBuscadorEvento}
            value={buscador || ""}
            aria-label="Buscar evento"
            style={{ fontSize: "1rem" }}
          />
          {buscador && (
            <Button
              variant="outline-secondary"
              onClick={limpiarBusqueda}
              title="Limpiar búsqueda"
            >
              <FaTimes />
            </Button>
          )}
        </InputGroup>
      </Form.Group>
    );
  }

  return (
    <Row className="justify-content-center my-3">
      <Col md={10}>
        <Form.Group>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar evento"
              onChange={handleBuscadorEvento}
              value={buscador || ""}
              aria-label="Buscar evento"
              style={{ fontSize: "1.1rem" }}
            />
            {buscador && (
              <Button
                variant="outline-secondary"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default Buscador;