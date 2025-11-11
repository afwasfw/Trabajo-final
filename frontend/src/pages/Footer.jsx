import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <p className="mb-0">
          &copy; {currentYear} Municipalidad Distrital de Yauyos. Todos los derechos reservados.
        </p>
        <p className="mb-0">
          <a href="#" className="text-white-50 me-3">Política de Privacidad</a>
          <a href="#" className="text-white-50">Términos de Servicio</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;