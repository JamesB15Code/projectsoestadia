import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../funtions";

const CrudUser = () => {
  const url = "http://localhost/proyectoApi/apiUsuario.php";
  const [users, setUsers] = useState([]);
  const [idU, setId] = useState("");
  const [opcion, setOpcion] = useState("");
  const [titulo, setTitulo] = useState("");

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [correo, setCorreo] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [rol, setRol] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(url);
      setUsers(res.data);
    } catch (error) {
      show_alerta("Error al obtener los usuarios", "error");
      console.log(error);
    }
  };

  const openModal = (
    op,
    idUsuarios,
    nombre,
    username,
    contraseña,
    correo,
    pregunta,
    respuesta,
    rol
  ) => {
    setId("");
    setNombre("");
    setUsername("");
    setContraseña("");
    setCorreo("");
    setPregunta("");
    setRespuesta("");
    setRol("");
    setOpcion(op);
    if (op === 1) {
      setTitulo("Registrar");
    } else if (op === 2) {
      setTitulo("Editar");
      setId(idUsuarios);
      setNombre(nombre);
      setUsername(username);
      setContraseña(contraseña);
      setCorreo(correo);
      setPregunta(pregunta);
      setRespuesta(respuesta);
      setRol(rol);
      console.log("ID:", idUsuarios);
    }

    setShowModal(true);
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const validar = () => {
    if (
      !nombre ||
      !contraseña ||
      !correo ||
      !username ||
      !pregunta ||
      !respuesta
    ) {
      show_alerta("Completa todos los campos", "warning");
      return;
    }

    const parametros = {
      nombre: nombre,
      username: username,
      contraseña: contraseña,
      correo: correo,
      pregunta: pregunta,
      respuesta: respuesta,
      idRol: rol,
    };
    console.log("Parámetros:", parametros, "ID:", idU);

    if (opcion === 1) {
      guardar(parametros);
    } else if (opcion === 2) {
      editar(parametros, idU);
    }
  };

  const guardar = async (parametros) => {
    try {
      await axios.post(url, parametros);
      show_alerta("Guardado", "success");
      document.getElementById("btncerrar").click();
      getUser();
    } catch (error) {
      show_alerta("Error al guardar " + error.messagge + " error");
      console.log(error);
    }
  };

  const editar = async (parametros, idUsuarios) => {
    try {
      const editUrl = `${url}/${idUsuarios}`;
      console.log("URL:", editUrl);
      await axios.put(editUrl, parametros);
      show_alerta("Actualizado", "success");
      document.getElementById("btncerrar").click();
      getUser();
    } catch (error) {
      show_alerta("Error al editar", "error");
      console.log(error);
    }
  };

  const eliminar = (idUsuarios, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Desea eliminar a ${nombre}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}?idUsuarios=${idUsuarios}`);
          show_alerta("Se eliminó correctamente", "success");
          getUser();
        } catch (error) {
          if (error.response) {
            show_alerta(
              `Error ${error.response.status}: ${error.response.data}`,
              "error"
            );
          } else if (error.request) {
            show_alerta("Error de solicitud", "error");
          } else {
            show_alerta("Error al eliminar el usuario", "error");
          }
          console.log(error);
        }
      } else {
        show_alerta("No se eliminó", "info");
      }
    });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row mt-5 mb-4">
          <div className="col-md-3 offset-md-2">
            <div className="d-grid mx-auto">
              <button className="btn btn-info" onClick={() => openModal(1)}>
                Agregar
              </button>
            </div>
          </div>
        </div>
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Username</th>
              <th scope="col">Contraseña</th>
              <th scope="col">Correo</th>
              <th scope="col">Pregunta</th>
              <th scope="col">Respuesta</th>
              <th scope="col">Rol</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map(
              (
                {
                  idUsuarios,
                  nombre,
                  username,
                  contraseña,
                  correo,
                  pregunta,
                  respuesta,
                  rol,
                },
                index
              ) => (
                <tr key={idUsuarios}>
                  <td>{index + 1}</td>
                  <td>{nombre}</td>
                  <td>{username}</td>
                  <td>{contraseña}</td>
                  <td>{correo}</td>
                  <td>{pregunta}</td>
                  <td>{respuesta}</td>
                  <td>{rol}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() =>
                        openModal(
                          2,
                          idUsuarios,
                          nombre,
                          username,
                          contraseña,
                          correo,
                          pregunta,
                          respuesta,
                          rol
                        )
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminar(idUsuarios, nombre)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div
        id="modalUser"
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        aria-modal="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-3 ">
                <div className="col">
                  <label className="form-label">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="form-control"
                    placeholder="nombre"
                    name="Nombre"
                    required
                  />
                </div>

                <div className="col">
                  <label className="form-label">Nombre usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="Nombre usuario"
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Correo</label>
                  <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="form-control"
                    placeholder="Correo"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Pregunta</label>
                  <div className="input-group">
                    <select
                      id="pregunta"
                      value={pregunta}
                      onChange={(e) => setPregunta(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="" disabled hidden>
                        Selecciona una pregunta
                      </option>
                      <option value="mascota">
                        ¿Cuál es tu mascota favorito?
                      </option>
                      <option value="color">¿Cuál es tu color favorito?</option>
                      <option value="comida">
                        ¿Cuál es tu comida favorita?
                      </option>
                    </select>
                    <div className="input-group-append"></div>
                  </div>
                </div>
                <div className="col">
                  <label className="form-label">Respuesta</label>
                  <input
                    type="text"
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    className="form-control"
                    placeholder="Respuesta"
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <label htmlFor="rol" className="form-label">
                    Selecciona rol
                  </label>
                  <div className="input-group">
                    <select
                      id="rol"
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="" disabled hidden>
                        Selecciona un rol
                      </option>
                      <option value="1">Usuario</option>
                      <option value="2">Admin</option>
                    </select>
                    <div className="input-group-append">
                    </div>
                  </div>
                </div>

                <div className="col">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      className="form-control"
                      placeholder="Contraseña"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button className="btn btn-success" onClick={validar}>
                  Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                id="btncerrar"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CrudUser;
