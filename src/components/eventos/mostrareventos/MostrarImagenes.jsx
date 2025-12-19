import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { getEventos } from '../../../services/api';
import { useSesion } from '../../../contexts/sesionContext/SesionContext';
import './mostrarimagenes.css';

function MostrarImagenes() {
  const [index, setIndex] = useState(0);
  const [eventos, setEventos] = useState([]);
  const { usuario } = useSesion();

  const handleSelect = (indexSeleccionado) => {
    setIndex(indexSeleccionado);
  };

  useEffect(() => {
    const cargarEvento = async () => {
      const data = await getEventos();
      const visibles = data.filter(ev => ev.visible);
      setEventos(visibles);
    };
    cargarEvento();
  }, [usuario]); // se recarga cada vez que cambia el usuario

  useEffect(() => {
    if (eventos.length === 0) return;

    const intervalo = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % eventos.length);
    }, 5000); // cambia cada 5 segundos

    return () => clearInterval(intervalo);
  }, [eventos]);

  const formatearFechaHora = (fechaISO, horaStr) => {
    try {
      const fecha = new Date(fechaISO);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = horaStr?.slice(0, 5) || '00:00';
      return `${dia}/${mes}/${año} — ${hora} hs`;
    } catch {
      return `${fechaISO} ${horaStr}`;
    }
  };

  return (
    <Carousel
      className="carousel-mostrar-imagenes"
      activeIndex={index}
      onSelect={handleSelect}
      fade
      interval={null}
    >
      {eventos.map((evento) => (
        <Carousel.Item key={evento.id}>
        <img
  className="hero-image d-block w-100"
  src={evento.imagen}
  alt={evento.nombre}
 />
          <Carousel.Caption>
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '10px 20px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              <h5 style={{ color: 'white', marginBottom: 4 }}>{evento.nombre}</h5>
              <p style={{ color: 'white', margin: 0 }}>
                {evento.lugar} — {formatearFechaHora(evento.fecha, evento.horario)}
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MostrarImagenes;