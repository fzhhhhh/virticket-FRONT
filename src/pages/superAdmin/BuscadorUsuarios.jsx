import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const BuscadorUsuarios = ({ valor, onBuscar }) => {
  const limpiarBusqueda = () => onBuscar("");

  return (
    <div className="my-3 text-center">
      <InputGroup className="w-50 mx-auto">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          type="text"
          placeholder="Buscar usuario por nombre o correo..."
          value={valor}
          onChange={(e) => onBuscar(e.target.value)}
          aria-label="Buscar usuario"
        />
        {valor && (
          <Button
            variant="outline-secondary"
            onClick={limpiarBusqueda}
            title="Limpiar búsqueda"
          >
            <FaTimes />
          </Button>
        )}
      </InputGroup>
    </div>
  );
};

export default BuscadorUsuarios;