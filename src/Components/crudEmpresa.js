import React, { useEffect, useState } from "react";
import axios from "axios";
import { show_alerta } from "../funtions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

const ProductManagement = () => {
  const [empresa, setEmpresa] = useState([]);
  const [id, setId] = useState("");

  const [logo, setLogo] = useState("");
  const [nombre, setNombre] = useState("");
  const [sobreNosotros, setSobreNosotros] = useState("");
  const [avisoPrivacidad, setAvisoPrivacidad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [horario, setHorario] = useState("");

  const [titulo, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  const urlCloudinary = "https://api.cloudinary.com/v1_1/dchgfutbv/image/upload";
  const URL_INFEMPRESA = "http://localhost/proyectoApi/apiEmpresa.php";

  useEffect(() => {
    getInfoEmpresa();
  }, []);

  const getInfoEmpresa = async () => {
    try {
      const response = await axios.get(URL_INFEMPRESA);
      console.log(response.data);
      setEmpresa(response.data);
    } catch (error) {
      show_alerta("Error al obtener productos", "error");
      console.log(error);
    }
  };

  const handleShowModal = (info) => {
    setTitle("Actualizar información de empresa");
    setId(info.idEmpresa);
    setLogo(info.logo);
    setNombre(info.nombre);
    setSobreNosotros(info.sobreNosotros);
    setAvisoPrivacidad(info.avisoPrivacidad);
    setDireccion(info.direccion);
    setTelefono(info.telefono);
    setCorreo(info.correo);
    setHorario(info.horario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validar = () => {
    if (
      !logo ||
      !nombre ||
      !sobreNosotros ||
      !avisoPrivacidad ||
      !direccion ||
      !telefono ||
      !correo ||
      !horario
    ) {
      show_alerta("Completa todos los campos", "warning");
      return;
    } else {
      const informacionDeEmpresa = {
        logo: logo,
        nombre: nombre,
        sobreNosotros: sobreNosotros,
        avisoPrivacidad: avisoPrivacidad,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        horario: horario,
      };

      ActualizarInformacionEmpresa(informacionDeEmpresa, id);
    }
  };

  const ActualizarInformacionEmpresa = async (
    informacionDeEmpresa,
    idEmpresa
  ) => {
    try {
      await axios.put(
        `${URL_INFEMPRESA}?idEmpresa=${idEmpresa}`,
        informacionDeEmpresa
      );
      show_alerta("Información actualizada con éxito", "success");
      setShowModal(false);
      getInfoEmpresa();
    } catch (error) {
      show_alerta("Error al actualizar producto", "error");
      console.log(error);
    }
  };

  const uploadLogo = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "innovaciones");
    try {
      const res = await fetch(urlCloudinary, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      setLogo(file.secure_url);
      show_alerta("Imagen cargada con éxito", "success");
    } catch (error) {
      show_alerta("Error al cargar la imagen", "error");
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="App">
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="row mt-5">
              <div className="col-md-4 offset-md-4">
                <div className="d-grid mx-auto">
                  <h5 className="text-center">
                    Gestión de información de empresa
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-9 col-lg-12 offset-0 offset-lg-0">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>sobreNosotros</th>
                      <th>AvisoPrivacidad</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Horario</th>
                      <th>Logo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {empresa.map((info) => (
                      <React.Fragment key={info.idEmpresa}>
                        <tr>
                          <td>{info.nombre}</td>
                          <td>{info.sobreNosotros}</td>
                          <td>{info.avisoPrivacidad}</td>
                          <td>{info.direccion}</td>
                          <td>{info.telefono}</td>
                          <td>{info.correo}</td>
                          <td>{info.horario}</td>
                          <td>
                            {info.logo ? (
                              <img
                                src={info.logo}
                                alt="Logo"
                                width="50"
                                height="50"
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleShowModal(info)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && id && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body">
              <div className="row mb-3 ">
                <div className="col">
                  <label className="form-label d-flex justify-content-center h5">
                    Logo
                  </label>
                  {logo && (
                    <img
                      src={logo}
                      alt="Logo de la empresa"
                      className="img-thumbnail mb-3 "
                      style={{ maxWidth: "100px" }}
                    />
                  )}
                  <input
                    type="file"
                    onChange={uploadLogo}
                    className="form-control "
                  />
                </div>
              </div>
              <div className="col">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">Sobre nosotros</label>
                <input
                  type="text"
                  className="form-control"
                  value={sobreNosotros}
                  onChange={(e) => setSobreNosotros(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">Aviso de privacidad</label>
                <input
                  type="text"
                  className="form-control"
                  value={avisoPrivacidad}
                  onChange={(e) => setAvisoPrivacidad(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="col">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Horario</label>
              <input
                type="text"
                className="form-control"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
            </div>

            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="success" onClick={validar}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProductManagement;
