import { FaGithub, FaUser } from "react-icons/fa";

const PiePagina = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="piePagina text-center bg-black text-light ">
      <h5 className="mb-4">virTicket Desarrolladores</h5>

      <div
        className="d-flex justify-content-center mb-4 flex-wrap"
        style={{ gap: "1rem" }}
      >
        
        <span className="d-flex align-items-center gap-2">
          <FaUser /> Federico
        </span>
        
        

        <a
          href="https://github.com/fzhhhhh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light d-flex align-items-center gap-2"
          style={{ textDecoration: "underline" }}
        >
          <FaGithub size={22} />
          GitHub
        </a>
      </div>

      <p className="mb-0">© {anio} Todos los derechos reservados</p>
    </footer>
  );
};

export default PiePagina;