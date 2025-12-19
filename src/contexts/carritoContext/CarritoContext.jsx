import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  // Carga inicial desde localStorage
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarCarrito = (eventoNuevo) => {
    // Normalizar disponibilidad recibida
    const disponibleNormalized = !(
      eventoNuevo.disponible === false ||
      eventoNuevo.disponible === 0 ||
      eventoNuevo.disponible === "0" ||
      String(eventoNuevo.disponible).toLowerCase() === "false"
    );

    if (!disponibleNormalized) {
      console.warn("No se agregó al carrito: evento no disponible", eventoNuevo.id ?? eventoNuevo.idEvento);
      return false;
    }

    // Normalizar campos esperados
    const nuevo = {
      id: eventoNuevo.id ?? eventoNuevo.idEvento,
      nombre: eventoNuevo.nombre ?? eventoNuevo.nombreEvento,
      precio: Number(eventoNuevo.precio ?? eventoNuevo.precioEvento ?? 0),
      imagen: eventoNuevo.imagen ?? eventoNuevo.imagenEvento ?? null,
      disponible: eventoNuevo.disponible ?? true,
    };

    setCarrito((carritoAnterior) => {
      const indexExistente = carritoAnterior.findIndex((item) => item.id === nuevo.id);

      if (indexExistente !== -1) {
        return carritoAnterior.map((item, index) =>
          index === indexExistente ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [...carritoAnterior, { ...nuevo, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (eventoId, cantidad) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.map((item) =>
        item.id === eventoId ? { ...item, cantidad: Math.max(item.cantidad + cantidad, 1) } : item
      )
    );
  };

  const eliminarDelCarrito = (eventoId) => {
    setCarrito((carritoAnterior) => carritoAnterior.filter((item) => item.id !== eventoId));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Devuelve el total del carrito (usa precio normalizado)
  const totalCarrito = carrito.reduce((total, item) => total + (Number(item.precio) || 0) * item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCart = () => useContext(CarritoContext);