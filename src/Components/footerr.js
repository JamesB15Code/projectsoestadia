import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faFile,
  faHome,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  YouTubeIcon,
  LinkedInIcon,
  TikTokIcon,
  PinterestIcon,
  RedditIcon,
  InstagramIcon,
} from "../iconos";

import { URL_REDES, URL_INFOEMPRESA } from "../Url";

function Footer() {
  const [redes, setRedes] = useState([]);
  const [infEmpresa, setInfEmpresa] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    getRedes();
    getInformacionEmpresa();
  }, []);

  const getRedes = async () => {
    try {
      const response = await axios.get(URL_REDES);
      setRedes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInformacionEmpresa = async () => {
    try {
      const response = await axios.get(URL_INFOEMPRESA);
      setInfEmpresa(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "facebook":
        return <FacebookIcon />;
      case "whatsapp":
        return <WhatsappIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "linkedin":
        return <LinkedInIcon />;
      case "youtube":
        return <YouTubeIcon />;
      case "tiktok":
        return <TikTokIcon />;
      case "pinterest":
        return <PinterestIcon />;
      case "instagram":
        return <InstagramIcon />;
      case "reddit":
        return <RedditIcon />;
      default:
        return null;
    }
  };

  const handleModalOpen = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <footer className=" " style={{ backgroundColor: "#044D8C" }}>
      <div className="container ">
        <div className="row justify-content-evenly ">
          <div className="col-sm-4 col-md-4 mt-4">
            <h3 className="text-center text-white">Sitio Oficial</h3>
            <div className="d-flex flex-column align-items-center ">
              <div className="col-10">
                <div className="text-center text-white">
                  <h4 className="m-2 align-items-center">
                    {infEmpresa && infEmpresa.nombre ? (
                      infEmpresa.nombre
                    ) : (
                      <span>M&G INNOVACIONES</span>
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4 col-md-4 mt-3">
            <h3 className="text-center text-white">Redes Sociales</h3>
            <div className="d-flex flex-column align-items-center ">
              <div className="col-10">
                <ul className="list-unstyled btn-group d-flex justify-content-center flex-wrap">
                  {redes.map((red, index) => (
                    <li key={index}>
                      <a
                        className="btn btn-outline-light  m-2 bg-light"
                        href={red.enlace}
                      >
                        {getIcon(red.tipo)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 text-white ">
            <hr className="border-3 opacity-100" style={{ color: "#fff" }} />
            <div className="text-center">
              <h4 className="">Información</h4>
              {infEmpresa && infEmpresa.sobreNosotros && (
                <h6
                  onClick={() =>
                    handleModalOpen({
                      title: "Sobre nosotros",
                      content: infEmpresa.sobreNosotros,
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faFile} className="me-2" />
                  Sobre nosotros
                </h6>
              )}

              {infEmpresa && infEmpresa.avisoPrivacidad && (
                <h6
                  onClick={() =>
                    handleModalOpen({
                      title: "Aviso de privacidad",
                      content: infEmpresa.avisoPrivacidad,
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faFile} className="me-2" />
                  Aviso de privacidad
                </h6>
              )}
            </div>
          </div>
          {showModal && (
            <div className="modal" style={{ display: "block" }}>
              <div
                className="modal-dialog modal-dialog-centered
              "
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{modalData.title}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleModalClose}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>{modalData.content}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-md-4 text-white ">
            <hr className="border-3 opacity-100" style={{ color: "#fff" }} />
            <div className="text-center ">
              <h3 className="">Contacto </h3>
              <div className="">
                <div className="text-center">
                  <p className=" align-items-center">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    {infEmpresa && infEmpresa.telefono ? (
                      infEmpresa.telefono
                    ) : (
                      <span>Agrega tu telefono</span>
                    )}
                  </p>
                  <p className=" align-items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    {infEmpresa && infEmpresa.correo ? (
                      infEmpresa.correo
                    ) : (
                      <span>agerag tu correo</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 text-white">
            <hr className="border-3 opacity-100" style={{ color: "#fff" }} />
            <div className="text-center ">
              <h3 className="">Horario de atención</h3>
              <div className="">
                <div className="text-center">
                  <p className=" align-items-center">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    {infEmpresa && infEmpresa.horario ? (
                      infEmpresa.horario
                    ) : (
                      <span>Agrega un horario</span>
                    )}
                  </p>
                  <p className=" align-items-center">
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    {infEmpresa && infEmpresa.direccion ? (
                      infEmpresa.direccion
                    ) : (
                      <span>Agrega tu direccion</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light text-secondary text-center mt-3 py-4">
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="mb-0">
                &copy; 2023{" "}
                {infEmpresa && infEmpresa.nombre
                  ? infEmpresa.nombre
                  : "M&G INNOVACIONES"}{". "}
                Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
