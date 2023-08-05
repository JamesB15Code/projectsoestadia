import { useContext, useEffect} from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const history = useNavigate();

  let userNombre = localStorage.getItem('nombre');
  let userCorreo = localStorage.getItem('correo');
  let userName = localStorage.getItem('username');
  let userPregunta = localStorage.getItem('pregunta');
  let userRespuesta = localStorage.getItem('respuesta');
  let userRol = localStorage.getItem('rol');

  useEffect(() => {
    if (!isAuthenticated) {
      history("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="mt-5 d-flex justify-content-center">
      {isAuthenticated !== null ? (
        isAuthenticated ? (
          <div className="mt-3 mb-4 col-lg-6 col-md-8 col-sm-10 text-center">
            <div className="row g-0 bg-light rounded p-4 shadow">
              <div className="mb-4">
                <FontAwesomeIcon icon={faUser} size="5x" className="text-primary" />
              </div>
              <div>
                <h4 className="card-title mb-2">¡Bienvenido!</h4>
                <div className="mb-2">
                  <span className="text-dark h5">{userNombre}</span>
                </div>
                <div className="mb-2">
                  <span className="text-secondary">Usuario:</span>{" "}
                  <span className="text-dark">{userName}</span>
                </div>
                <div className="mb-2">
                  <span className="text-secondary">Correo:</span>{" "}
                  <span className="text-dark">{userCorreo}</span>
                </div>
                <div className="mb-2">
                  <span className="text-secondary">Pregunta:</span>{" "}
                  <span className="text-dark">{userPregunta}</span>
                </div>
                <div className="mb-2">
                  <span className="text-secondary">Respuesta:</span>{" "}
                  <span className="text-dark">{userRespuesta}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )
      ) : null}
    </div>
  );
};

export default Admin;
