import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";
import logo from "../img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const url = "https://innovaciones-apis.vercel.app/api/users";
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const foundUser = data.find(
          (u) =>
            u.email === email &&
            u.contraseña === contraseña &&
            u.username === username
        );
        if (foundUser) {
          login(foundUser);
          if (foundUser.rol[0].rol === "Usuario") {
            navigate("/perfil");
          } else {
            navigate("/admin");
          }
        } else {
          setErrorMessage(
            "El correo electrónico o la contraseña son incorrectos"
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Hubo un error al iniciar sesión");
      });
  };

  return (
    <div className="">
      <main id="main" className="d-flex w-100 mt-5 mb-3 align-items-center">
        <div className="container d-flex flex-column mt-5">
          <div className="row mt-5">
            <div className="col-lg-5 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="card card-login rounded-5 bg-light">
                  <div className="card-body">
                    <div className="m-sm-1">
                      <div className="text-center mb-2">
                        <img
                          src={logo}
                          alt="Logo"
                          className="img-fluid"
                          width="100"
                        />
                      </div>
                      {errorMessage !== "" && (
                        <label className="color-red text-center">
                          {errorMessage}
                        </label>
                      )}
                      <form onSubmit={handleLogin}>
                        <div className="mb-2">
                          <label
                            htmlFor="email"
                            className="form-label mb-1 text-primary ms-3"
                          >
                            Correo electrónico
                          </label>
                          <input
                            id="email"
                            className="form-control form-control-lg input-login rounded-5"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu correo electrónico"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="password"
                            className="form-label mb-1 text-primary ms-3"
                          >
                            Contraseña
                          </label>
                          <div className="input-group">
                            <input
                              id="password"
                              className="form-control form-control-lg input-login rounded-5"
                              type={showPassword ? "text" : "password"}
                              value={contraseña}
                              onChange={(e) => setContraseña(e.target.value)}
                              placeholder="Ingresa tu contraseña"
                              required
                            />
                            <button
                              type="button"z
                              className="btn"
                              onClick={togglePasswordVisibility}
                            >
                              <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>
                          {passwordError !== "" && (
                            <label className="color-red text-center">
                              {passwordError}
                            </label>
                          )}
                        </div>

                        <div className="text-center mt-3">
                          <input
                            type="submit"
                            className="btn btn-primary rounded-5"
                            value="Iniciar sesión"
                          />
                        </div>

                        <div className="account fs-5">
                          <div className="mt-2 d-flex justify-content-evenly align-items-center">
                            <a
                              href="/recuperacion"
                              className="text-decoration-none"
                            >
                              ¿Se te olvidó tu contraseña?
                            </a>
                            <a
                              href="/registro"
                              className="text-decoration-none"
                            >
                              Registrate
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
