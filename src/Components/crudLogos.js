import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { show_alerta } from "../funtions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

import {URL_REDES_SOCIALES} from "../Url" 

const CrudLogos = () => {
  const [redessociales, setRedesSociales] = useState([]);
  const [idR, setId] = useState("");

  const [tipo, setTipo] = useState("");
  const [enlace, setEnlace] = useState("");

  const [opcion, setOpcion] = useState("");
  const [titulo, setTitulo] = useState("");
  

  useEffect(() => {
    getRedesSociales();
  }, []);

  const getRedesSociales = async () => {
    const res = await axios.get(URL_REDES_SOCIALES);
    setRedesSociales(res.data);
  };

  const openEditor = (op, idRedes, tipo, enlace) => {
    setId("");
    setTipo("");
    setEnlace("");
    setOpcion(op);
    if (op === 1) {
      setTitulo("Registrar");
    } else if (op === 2) {
      setTitulo("Editar");
      setId(idRedes);
      setTipo(tipo);
      setEnlace(enlace);
    }
    window.setTimeout(function () {
      document.getElementById("tipo").focus();
      const modalregistro= document.getElementById("ModalReg");
      modalregistro.style.display="block";
    }, 500);
  };

  const validar = () => {
    if (!tipo || !enlace) {
      show_alerta("Completa todos los campos", "warning");
      return;
    }

    const parametros1 = {
      tipo: tipo,
      enlace: enlace,
    };
    const parametros = {
      tipo: tipo,
      enlace: enlace,
    };

    if (opcion === 1) {
      guardar(parametros1);
    } else {
      editar(parametros, idR);
    }
  };

  const guardar = async (parametros1) => {
    try {
      await axios.post(URL_REDES_SOCIALES, parametros1);
      show_alerta("Guardado", "success");
      const modalreg= document.getElementById("ModalReg");
      modalreg.style.display="none";
      getRedesSociales();
    } catch (error) {
      show_alerta("Error al guardar", "error");
      console.log(error);
    }
  };

  const editar = async (parametros, idRedes) => {
    try {
      await axios.put(`${URL_REDES_SOCIALES}?idRedes=${idRedes}`, parametros);
      show_alerta("Actualizado", "success");
      const modalreg= document.getElementById("ModalReg");
      modalreg.style.display="none";
      getRedesSociales();
    } catch (error) {
      show_alerta("Error al editar", "error");
      console.log(error);
    }
  };

  const eliminar = (idRedes, tipo) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar la red social de ${tipo}?`,
      text: "Esta acción no se puede revertir",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${URL_REDES_SOCIALES}?idRedes=${idRedes}`);
          show_alerta("Eliminado", "success");
          getRedesSociales();
        } catch (error) {
          show_alerta("Error al eliminar", "error");
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="App">
        <div className="container-fluid ">
          <div className="row mt-5 ">
            <div className="col-md-3 offset-md-4 mt-4">
              <div className="d-grid mx-auto mt-4">
                <h5 className="text-center fs-5">
                  {" "}
                  Agrega tus redes sociales{" "}
                </h5>
                <button
                  className="btn btn-success"
                  onClick={() => openEditor(1)}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-3 d-flex justify-content-center">
            <div className="col-lg-9 offset-0 offset-lg-0">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Tipo de red social</th>
                      <th>Enlace</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider text-center">
                    {redessociales.map(({ idRedes, tipo, enlace }, i) => (
                      <tr key={idRedes}>
                        <td>{i + 1}</td>
                        <td>{tipo}</td>
                        <td>{enlace}</td>
                        <td className="d-flex justify-content-center">
                          <button
                            onClick={() => openEditor(2, idRedes, tipo, enlace)}
                            className="btn btn-primary"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-danger"
                            onClick={() => eliminar(idRedes, tipo)}
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

      {opcion !== "" && (
        <div id="ModalReg" className="modal fade show" style={{ display: "block",backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{titulo}</label>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpcion("")}
                ></button>
              </div>
              <div className="modal-body">
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
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese link del enlace"
                    value={enlace}
                    onChange={(e) => setEnlace(e.target.value)}
                  />
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button className="btn btn-success" onClick={() => validar()}>
                    Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpcion("")}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudLogos;
