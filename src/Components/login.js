import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faEye, faEyeSlash, } from "@fortawesome/free-solid-svg-icons";
import imagen1 from "../img/Imagen1.png";

import {URL_USUARIOS} from "../Url" 

export default function Login() {
  const histori = useNavigate();
  const {login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(URL_USUARIOS)
      .then((response) => response.json())
      .then((data) => {
        const user = data.find(
          (u) => u.correo === email && u.contraseña === pass
        );
        if (user) {
          login(user); // Guardar usuario en el contexto al iniciar sesión
          
          if (user.rol === "usuario") {
            histori("/perfilUser");
          } else {
            histori("/admin");
          }
        } else {
          setErrorMessage(
            "El correo electrónico o la contraseña son incorrectos"
          );
        }
        //console.log(user);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Hubo un error al iniciar sesión");
      });
  };

  const handleHome = () => {
    histori("/"); // Redirige al inicio 
  };

  return (
    
    <div className="d-flex flex-column min-vh-100 mt-5">
      <main className="flex-grow-1 container mt-3 ">
        <div className="row justify-content-center">
          <div className=" border col-lg-5 p-4 ">
            <div className="text-center">
              <h1 className="text-primary fs-3 mt-5 mb-3">Iniciar sesión</h1>
            </div>
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-primary fs-5">
                  Correo Electronico
                </label>
                <input
                  className="form-control text-secondary  fs-5"
                  type="email"
                  name="Email"
                  value={email}
                  placeholder="Ingrese su correo"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className=" mb-3">
                <label className="form-label text-primary fs-5">
                  Contraseña
                </label>
                <div className="input-group mb-3 ">
                    <input
                      className="form-control fs-5 text-secondary "
                      type={showPassword ? "text" : "password"}
                      name="Password"
                      value={pass}
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
              </div>
              <div className="text-center mt-3">
                <input
                  className="btn btn-primary rounded-5 fs-5"
                  type="submit"
                  value="Iniciar sesión"
                />
              </div>
              <div className="text-center mt-3 mb-3">
                <a className="text-decoration-none fs-5" href="recuperarPass">
                  ¿Se te olvidó la contraseña?
                </a>
              </div>
            </form>
            {errorMessage !== "" && (
              <label className="text-danger text-center fs-5">
                {errorMessage}
              </label>
            )}
          </div>

          <div className="col-lg-5  border-0 d-none d-lg-block">
            <img src={imagen1} width="100%" height="auto" alt=""/>
          </div>
        </div>

        {/*<div className="d-flex justify-content-start m-4">
          <button
            className="btn btn-primary fs-5"
            onClick={handleHome}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
            </div>*/}
      </main>
    </div>
  );
}
