import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";

export default function RecupararContraseña() {
  const URL_USER = "http://localhost/proyectoApi/apiUsuario.php";
  const histori = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogout = () => {
    histori("/login");
  };

  const recuperarContraseñaUser = (e) => {
    e.preventDefault();
    fetch(URL_USER)
      .then((response) => response.json())
      .then((data) => {
        const user = data.find(
          (u) => u.correo === email && u.respuesta === respuesta
        );
        if (user) {
          login(user);
          if (user.rol === "usuario") {
            histori("/perfilUser");
          } else {
            histori("/admin");
          }
        } else {
          setErrorMessage("El correo electrónico o respuesta son incorrectos");
        }
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Hubo un error al recuperar contraseña");
      });
  };

  return (
    <div>
      <main className="container pt-5">
        <div className="row mt-5 justify-content-center">
          <div className=" border col-lg-5 p-4 ">
              <div className="text-center">
                <h1 className="text-primary fs-3 mt-5 mb-3">Recuperar Contraseña</h1>
              </div>
              <form onSubmit={recuperarContraseñaUser}>
                <div className="mb-3">
                  <label className="form-label text-primary fs-5 mb-1">
                    Correo Electronico
                  </label>
                  <input
                    className="form-control text-secondary fs-5"
                    type="email"
                    placeholder="Correo Electronico"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-primary fs-5 mb-1">
                    Respuesta
                  </label>
                  <input
                    className="form-control text-secondary fs-5"
                    type="text"
                    placeholder="Respuesta"
                    onChange={(e) => setRespuesta(e.target.value)}
                  />
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-success fs-5" type="submit">
                    Enviar
                  </button>
                </div>
              </form>
              {errorMessage !== "" && (
                <label className="text-danger text-center fs-5">
                  {errorMessage}
                </label>
              )}
          </div>
        </div>
        <div className="">
          <button
            className="btn btn-primary fs-5 float-start m-4 "
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
        </div>
      </main>
    </div>
  );
}
