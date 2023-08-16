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
import { Button, Modal } from "react-bootstrap";

import {URL_EMPRESA, URL_REDES_SOCIALES} from "../Url" 

function Footer() {
  const [redes, setRedes] = useState([]);
  const [infEmpresa, setInfEmpresa] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    getRedes();
    getInformacionEmpresa();
  }, []);

  const getRedes = async () => {
    try {
      const response = await axios.get(URL_REDES_SOCIALES);
      setRedes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInformacionEmpresa = async () => {
    try {
      const response = await axios.get(URL_EMPRESA);
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

  const handleCloseModal = () => {
    setShowModal2(false);
  };

  const handleOpenModal = () => {
    setShowModal2(true);
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
            <div className="text-center">
              <h6
                className=""
                style={{ cursor: "pointer" }}
                onClick={handleOpenModal}
              >
                <FontAwesomeIcon icon={faFile} className="me-2" />
                Departamento de TIC
              </h6>
            </div>
          </div>

          {showModal && (
            <div id="ModalReg" className="modal fade show" style={{ display: "block",backgroundColor: "rgba(0,0,0,0.6)" }}>
              <div
                className="modal-dialog modal-dialog-centered modal-lg
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
          <Modal show={showModal2} onHide={handleCloseModal} size="md">
            <Modal.Header closeButton>
              <Modal.Title className="">Departamento de TIC</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <div className=" text-primary m-2 border-3d text-center">
                    <h3 className="modal-title">
                      Supervisores del proyecto
                    </h3>
                    <div className="m-2 text-start">
                      <p className="align-items-center mb-1">
                        <span>M.T.I. Carlos Andrés Rodríguez Argüelles</span>
                      </p>
                      <p className="align-items-center mb-1">
                        <span>ING. José de Jesús González Torres</span>
                      </p>
                      <p className="align-items-center mb-1">
                        <span>M.A. Ricardo García Morales</span>
                      </p>
                      <p className="align-items-center mb-1">
                        <span>I.S.C. Gadiel Ramos Hernández</span>
                      </p>
                      <p className="align-items-center mb-1">
                        <span>M.T.I Juvencio Mendoza Castelán</span>
                      </p>
                    </div>
                </div>
                <div className=" text-primary mt-2 text-center">
                  <div className="text-center">
                    <h3 className="modal-title">Desarrollador</h3>
                    <div className="">
                      <p className="align-items-center">
                        <span className="fs-5">T.S.U. James Brian Hernández Hernández </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

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
                  : "M&G INNOVACIONES"}
                {". "}
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
