import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { show_alerta } from "../funtions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const CrudUsarios = () => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [rol, setRol] = useState("");
  const [opcion, setOpcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const url = "http://localhost/proyectoApi/apiUsuario.php";

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await axios.get(url);
    setUsers(res.data);
  };

  const openEditor = (op, idUsuarios, nombre, username, contraseña, correo, pregunta, respuesta, rol) => {
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
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const validar = () => {
    if (!nombre || !contraseña || !correo || !username || !pregunta || !respuesta || !rol) {
      show_alerta("Completa todos los campos", "warning");
      return;
    }

    const parametros1 = {
      nombre: nombre,
      username: username,
      contraseña: contraseña,
      correo: correo,
      pregunta: pregunta,
      respuesta: respuesta,
      idRol: rol
    };
    const parametros = {
      nombre: nombre,
      username: username,
      contraseña: contraseña,
      correo: correo,
      pregunta: pregunta,
      respuesta: respuesta,
      idRol: rol
    };

    if (opcion === 1) {
      guardar(parametros1);
    } else {
      editar(parametros, id);
    }
  };

  const guardar = async (parametros1) => {
    try {
      const response = await axios.post(url, parametros1);
      show_alerta("Guardado", "success");
      getUser();
    } catch (error) {
      show_alerta("Error al guardar", "error");
      console.log(error);
    }
  };

  const editar = async (parametros, idUsuarios) => {
    try {
      await axios.put(`${url}?idUsuarios=${idUsuarios}`, parametros);
      show_alerta("Actualizado", "success");
      getUser();
    } catch (error) {
      show_alerta("Error al editar", "error");
      console.log(error);
    }
  };

  const eliminar = (idUsuarios, username) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar a ${username}?`,
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
          await axios.delete(`${url}?idUsuarios=${idUsuarios}`);
          show_alerta("Eliminado", "success");
          getUser();
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
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="col-md-3 offset-md-4 mt-4">
              <div className="d-grid mx-auto mt-4">
              <h5 className="text-center fs-5">Gestión de usuarios</h5>
                <button className="btn btn-success" onClick={() => openEditor(1)}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
          <div className="row mt-3">
          <div className="col-lg-12 ">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Nombre</th>
                    <th>Username</th>
                    <th>contraseña</th>
                    <th>correo</th>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {users.map(({ idUsuarios, nombre, username, contraseña, correo, pregunta, respuesta, idRol }, i) => (
                    <tr key={idUsuarios}>
                      <td>{(i + 1)}</td>
                      <td>{nombre}</td>
                      <td>{username}</td>
                      <td>{contraseña}</td>
                      <td>{correo}</td>
                      <td>{pregunta}</td>
                      <td>{respuesta}</td>
                      { (idRol === '2') ? <td>admin</td> : <td>usuario</td> }
                      <td className="d-flex justify-content-center">
                        <button
                          onClick={() => openEditor(2, idUsuarios, nombre, username, contraseña, correo, pregunta, respuesta, idRol)}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => eliminar(idUsuarios, username)}
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
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
              <label className="h5">{titulo}</label>
              <button type="button" className="btn-close" onClick={() => setOpcion("")}></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="contraseña"
                  placeholder="Contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                /><button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </button>
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <select className="form-control" id="pregunta" value={pregunta} onChange={(e) => setPregunta(e.target.value)}>
                  <option value="">selecciona una pregunta</option>
                  <option value="¿Cúal es tu color favorito?">¿Cúal es tu color favorito?</option>
                  <option value="¿cúal es tu comida favorita?">¿cúal es tu comida favorita?</option>
                </select>
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Respuesta"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <select className="form-control" id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                  <option value="">Selecciona rol</option>
                  <option value="1">usuario</option>
                  <option value="2">admin</option>
                </select>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button className="btn btn-success" onClick={() => validar()}>
                  Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setOpcion("")}>
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

export default CrudUsarios;