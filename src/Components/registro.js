import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn"; // Importa la biblioteca zxcvbn para la validación de contraseñas

export default function Registro() {
  const url = "http://localhost/proyectoApi/apiUsuario.php"; //aqui va tu api
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [username, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [contraseña2, setContraseña2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    if (!zxcvbn(contraseña).score >= 2) {
      setErrorMessage(
        "La contraseña debe ser más fuerte. Asegúrate de que tenga al menos 8 caracteres y contenga letras mayúsculas, minúsculas, números y símbolos."
      );
      return;
    }
    if (contraseña !== contraseña2) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    // Validar el correo electrónico
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Ingresa un correo electrónico válido");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(nombre)) {
      setErrorMessage("El nombre solo debe tener letras");
      return;
    } else {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const userr = data.find(
            (u) => u.email === email && u.username === username
          );
          if (userr) {
            setErrorMessage("El usuario o correo ya existen");
          } else {
            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nombre: nombre,
                username: username,
                contraseña: contraseña,
                email: email,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                navigate("/login");
              })
              .catch((error) => {
                console.error(error);
                setErrorMessage("Hubo un error al registrar");
              });
          }
        });
    }
  };

  return (
    <div>
      <main id="main" className="d-flex w-100 mt-5 mb-3 ">
        <div className="container d-flex flex-column mt-5">
          <div className="row mt-5 ">
            <div className="col-lg-5 mx-auto d-table h-100 ">
              <div className="d-table-cell align-middle">
                <div className="card card-login rounded-5 bg-light  ">
                  <div className="card-body">
                    <div className="text-center text-primary mb-1">
                      <h1 className="fs-4 ">Registrate</h1>
                      <hr />
                    </div>
                    {errorMessage !== "" && (
                      <label className=" text-center">{errorMessage}</label>
                    )}
                    <form onSubmit={handleRegistro}>
                      <div className="">
                        <label className="form-label fs-5 text-primary ms-3">
                          Nombre
                        </label>
                        <input
                          className="form-control fs-6 form-control-lg input-login  text-black rounded-5"
                          type="text"
                          name="inp_usario"
                          required
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Introduce tu nombre"
                        />
                      </div>
                      <div className="">
                        <label className="form-label fs-5 text-primary ms-3">
                          Usuario
                        </label>
                        <input
                          className="form-control fs-6 form-control-lg input-login  text-black rounded-5"
                          type="text"
                          name="inp_usario"
                          required
                          onChange={(e) => setNameUser(e.target.value)}
                          placeholder="Introduce tu usuario"
                        />
                      </div>
                      <div className="">
                        <label className="form-label fs-5 text-primary ms-3">
                          Correo electrónico
                        </label>
                        <input
                          className="form-control fs-6 form-control-lg input-login  text-black rounded-5"
                          type="email"
                          name="inp_email"
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Introduce tu correo electrónico"
                          required
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="password"
                          className="form-label fs-5 text-primary ms-3"
                        >
                          Contraseña
                        </label>
                        <div className="input-group">
                          <input
                            id="password"
                            className="form-control fs-6 form-control-lg input-login rounded-5"
                            type={showPassword ? "text" : "password"}
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                          />
                        </div>
                      </div>

                      <div className="">
                        <div>
                          <label className="form-label fs-5 text-primary ms-3">
                            Verificar contraseña
                          </label>
                        </div>
                        <div>
                          <input
                            className="form-control fs-6 form-control-lg input-login  text-black rounded-5"
                            type={showPassword ? "text" : "password"}
                            value={contraseña2}
                            name="inp_verf_password"
                            onChange={(e) => setContraseña2(e.target.value)}
                            placeholder=" Verificar tu contraseña"
                            id="pass2"
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn mt-2 btn-primary rounded-5"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>

                      <div className="text-center mt-2">
                        <button
                          type="submit"
                          className="btn text-primary fs-4 btn-sm  rounded-5"
                        >
                          Crear cuenta
                        </button>
                      </div>
                    </form>
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
