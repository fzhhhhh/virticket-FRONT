import { FaGithub, FaUser } from "react-icons/fa";
import "./piepagina.css";

const PiePagina = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <h5 className="app-footer__title">virTicket Desarrolladores</h5>

      <div className="app-footer__links">
        <span className="app-footer__item">
          <FaUser /> Federico
        </span>

        <a
          href="https://github.com/fzhhhhh"
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer__link"
        >
          <FaGithub size={22} />
          GitHub
        </a>
      </div>

      <p className="app-footer__copy">© {anio} Todos los derechos reservados</p>
    </footer>
  );
};

export default PiePagina;