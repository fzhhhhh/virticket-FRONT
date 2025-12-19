import { getEventos } from "../services/api";

// Devuelve la lista de eventos con todos los campos relevantes
const obtenerListaEventos = async () => {
  try {
    const eventos = await getEventos(); 
    return eventos.map(evento => ({
      id: evento.id,
      nombreEvento: evento.nombre,
      fechaEvento: evento.fecha,
      horarioEvento: evento.horario,
      imagenEvento: evento.imagen || "https://via.placeholder.com/400x300",
      descripcion: evento.descripcion,
      lugarEvento: evento.lugar,
      precioEvento: evento.precio,
      disponible: evento.disponible,
    }));
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error);
    return [];
  }
};

export default obtenerListaEventos;