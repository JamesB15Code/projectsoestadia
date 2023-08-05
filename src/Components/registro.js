import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Registro() {
  const URL_USER = "http://localhost/proyectoApi/apiUsuario.php"; // Reemplaza con la URL de tu API de registro
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const histori = useNavigate();

  const RegistroUsuario = async (e) => {
    e.preventDefault();
    if (!nombre || !user || !email || !pass) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(nombre)) {
      setErrorMessage("El nombre solo debe tener letras");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Ingresa un correo electrónico válido");
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(pass)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número para ser aceptada"
      );
      return;
    }

    try {
      const users = await axios.get(URL_USER);
      if (users.data.find((u) => u.username === user || u.correo === email)) {
        setErrorMessage("El usuario o correo ya existe");
        return;
      }

      const response = await axios.post(URL_USER, {
        nombre: nombre,
        username: user,
        contraseña: pass,
        correo: email,
        pregunta: pregunta,
        respuesta: respuesta,
      });
      console.log(response.data);
      setNombre("");
      setUser("");
      setEmail("");
      setPass("");
      setPregunta("");
      setRespuesta("");
      setErrorMessage("");
      histori("/login");
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un error al registrar");
    }
  };

  const handleLogout = () => {
    histori("/");
  };

  // Si el usuario ha sido registrado, redirigirlo a la página de inicio de sesión

  return (
    <div>
      <main className="container ">
        <div className="row justify-content-center mt-4">
          <div className="col-lg-5 mb-2">
            <div className="">
              <div class="card shadow p-3 ">
                <div className="text-center">
                  <h1 className="text-primary fs-4 mb-2">Registrate</h1>
                </div>
                {errorMessage !== "" && (
                  <label className="text-danger text-center fs-5">
                    {errorMessage}
                  </label>
                )}
                <form onSubmit={RegistroUsuario}>
                  <div className="">
                    <label className="form-label text-primary fs-5 mb-1 ms-3">
                      Nombre
                    </label>
                    <input
                      className="form-control text-secondary rounded-5 "
                      type="text"
                      name="inp_usario"
                      placeholder="Introduce tu nombre"
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label className="form-label text-primary fs-5 mb-1 ms-3">
                      Usuario
                    </label>
                    <input
                      className="form-control text-secondary rounded-5"
                      type="text"
                      name="inp_usario"
                      placeholder="Introduce tu usuario"
                      onChange={(e) => setUser(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label className="form-label text-primary fs-5 mb-1 ms-3">
                      Correo Electronico
                    </label>
                    <input
                      className="form-control text-secondary rounded-5"
                      type="email"
                      name="inp_email"
                      placeholder="Introduce tu correo"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="form-label text-primary fs-5 mb-1 ms-3">
                      Contraseña
                    </label>
                  </div>
                  <div className="input-group mb-3 ">
                    <input
                      className="form-control text-secondary "
                      type={showPassword ? "text" : "password"}
                      name="inp_password"
                      placeholder="Introduce tu contraseña"
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </button>
                  </div>
                  <div className="input-group mb-3">
                    <select
                      className="form-control text-secondary rounded-5"
                      id="pregunta"
                      onChange={(e) => setPregunta(e.target.value)}
                    >
                      <option value="">selecciona una pregunta</option>
                      <option value="¿Cúal es tu color favorito?">
                        ¿Cúal es tu color favorito?
                      </option>
                      <option value="¿cúal es tu comida favorita?">
                        ¿cúal es tu comida favorita?
                      </option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control text-secondary rounded-5"
                      placeholder="Respuesta"
                      onChange={(e) => setRespuesta(e.target.value)}
                    />
                  </div>
                  <div className="row justify-content-evenly">
                    <div className="text-center ">
                      <button
                        className="btn btn-primary  rounded-5"
                        type="submit"
                      >
                        Registrar
                      </button>
                    </div>
                    <div className="text-center mt-2">
                      <a className="fs-5  text-decoration-none" href="login">
                        iniciar sesión
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="">
            <button
              className="btn btn-primary fs-5 float-start"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faHouse} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
