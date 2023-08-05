import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [animationClass, setAnimationClass] = useState("");
  //console.log(user);

  let userNombre = localStorage.getItem('nombre');

  useEffect(() => {
    const getCurrentTime = () => {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (currentHour >= 6 && currentHour < 12) {
        setGreeting("Buenos días");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Buenas tardes");
      } else {
        setGreeting("Buenas noches");
      }
    };

    getCurrentTime();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      history("/");
    } else {
      // Agregar una animación suave cuando el componente se monta
      setAnimationClass("animate__animated animate__fadeInUp");
    }
  }, [isAuthenticated, history]);

  return (
    <div className="pt-3">
      <div className="mt-5 mb-4 d-flex justify-content-center">
        {isAuthenticated !== null ? (
          isAuthenticated ? (
            <div className={`col-lg-5 col-md-8 col-sm-10 text-center ${animationClass}`}>
              <div className="row g-0 bg-light rounded p-4 shadow">
                <div className="text-center mt-4">
                  <h2>{greeting}</h2>
                  <FontAwesomeIcon icon={faUser} size="5x" className="text-primary mt-3" />
                </div>
                <div className="col-12">
                  <div className="text-center mb-3">
                    <h4 className="card-title">¡Bienvenido!</h4>
                    <h5 className="text-dark mb-0">{userNombre}</h5>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Admin;
