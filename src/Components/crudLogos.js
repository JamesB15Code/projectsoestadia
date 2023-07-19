import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { show_alerta } from "../funtions";
import { URL_REDES } from "../Url";

const AddRedesEmpresa = () => {
  const [red, setRed] = useState([]);
  const [id, setId] = useState("");
  const [tipo, setTipo] = useState("");
  const [enlace, setEnlace] = useState("");
  const [operacion, setOperacion] = useState(1);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    getRedSocial();
  }, []);

  const getRedSocial = async () => {
    const respuest = await axios.get(URL_REDES);
    setRed(respuest.data);
  };

  const openEditForm = (id, tipo, enlace) => {
    setId(id);
    setTipo(tipo);
    setEnlace(enlace);
    setOperacion(2);
    setModalTitle("Editar Red Social");
    setShowModal(true);
  };

  const openAddForm = () => {
    setId("");
    setTipo("");
    setEnlace("");
    setOperacion(1);
    setModalTitle("Registrar Red Social");
    setShowModal(true);
  };

  const validar = () => {
    if (tipo === "") {
      show_alerta("Selecciona el tipo de red social", "warning");
    } else if (enlace === "") {
      show_alerta("Ingresa el Link de tu Red Social", "warning");
    } else {
      if (operacion === 1) {
        enviarSolicitudGuardar("POST", { tipo, enlace });
      } else {
        enviarSolicitudEditar("PUT", { tipo, enlace }, id);
      }
    }
  };

  const enviarSolicitudGuardar = async (metodo, parametros) => {
    try {
      await axios({ method: metodo, url: URL_REDES, data: parametros });
      show_alerta("Se Agregó correctamente", "success");
      getRedSocial();
      setShowModal(false);
    } catch (error) {
      show_alerta("Error en la solicitud", "error");
      console.log(error);
    }
  };

  const enviarSolicitudEditar = async (metodo, parametros, id) => {
    try {
      await axios({
        method: metodo,
        url: URL_REDES + "/" + id,
        data: parametros,
      });
      show_alerta("Se actualizó correctamente", "success");
      getRedSocial();
      setShowModal(false);
    } catch (error) {
      show_alerta("Error en la solicitud", "error");
      console.log(error);
    }
  };

  const deleteProduct = (id, tipo) => {
    setShowModal(false);
    setShowModal(true);
    setModalTitle("Eliminar Red Social");
    setTipo(tipo);
    setId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios({ method: "DELETE", url: URL_REDES + "/" + id });
      show_alerta("Se eliminó correctamente", "success");
      getRedSocial();
      setShowModal(false);
    } catch (error) {
      show_alerta("Error en la solicitud", "error");
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle("");
  };

  return (
    <div>
      <div className="App">
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="row mt-5 mb-4">
              <div className="col-md-4 offset-md-4">
                <div className="d-grid mx-auto">
                  <h5 className="text-center fs-5">Registrar red social</h5>
                  <button onClick={openAddForm} className="btn btn-success">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-lg-8 offset-0 offset-lg-2">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Tipo</th>
                      <th>Enlace</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {red.map(({ _id, tipo, enlace }, i) => (
                      <tr key={_id}>
                        <td>{i + 1}</td>
                        <td>{tipo}</td>
                        <td>{enlace}</td>
                        <td>
                          <button
                            onClick={() => openEditForm(_id, tipo, enlace)}
                            className="btn btn-warning"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          &nbsp;
                          <button
                            onClick={() => deleteProduct(_id, tipo)}
                            className="btn btn-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fa-solid fa-gift"></i>
            </span>
            <select
              id="tipo"
              className="form-control"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecciona una red social</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="tikTok">TikTok</option>
              <option value="pinterest">Pinterest</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fa-solid fa-comment"></i>
            </span>
            <input
              type="text"
              id="enlace"
              className="form-control"
              placeholder="Enlace de tu Red Social"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Cerrar
          </button>
          <button className="btn btn-success" onClick={validar}>
            Guardar
          </button>
          {modalTitle === "Eliminar Red Social" && (
            <button className="btn btn-danger" onClick={confirmDelete}>
              Eliminar
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddRedesEmpresa;
