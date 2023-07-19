import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Navbar, Nav, Button } from "react-bootstrap";
import { URL_INFOEMPRESA } from "../Url";
import axios from "axios";


export default function Navbarr() {
  
  useEffect(() => {
    getInformacionEmpresa();
  }, []);
  
  const [infEmpresa, setInfEmpresa] = useState({ logo: "../img/logo.png" });

  const getInformacionEmpresa = async () => {
    try {
      const response = await axios.get(URL_INFOEMPRESA);
      setInfEmpresa(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const history = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const Salir = () => {
    logout();
    history("/login");
  };

  return (
    <Navbar
      className="navbar navbar-expand-sm navbar-dark fixed-top"
      expand="lg"
      fixed="top"
      style={{ backgroundColor: "#0554F2" }}
    >
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          {infEmpresa && infEmpresa.logo ? (
            <img width="50" src={infEmpresa.logo} alt="" />
          ) : (
            <img width="50" src={infEmpresa} alt="" />
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto fs-5">
            <Nav.Link className="text-light" as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/showphones">
              Smartphone
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/buscar">
              Tablets
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/somos">
              Audio
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/ayuda">
              Accesorios
            </Nav.Link>
            <NavDropdown className="" title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/admin"
              >
                Admin
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/prueba"
              >
                Prueba
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/pruebas"
              >
                Pruebas
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
          </Nav>
          <div className="d-flex justify-content-center">
            {isAuthenticated !== null ? (
              isAuthenticated ? (
                <div>
                  <Button variant="success" className="me-2" onClick={Salir}>
                    Cerrar sesión
                  </Button>
                  <Link className="btn btn-success" to="/perfil">
                    Perfil
                  </Link>
                </div>
              ) : (
                <div>
                  <Link className="btn btn-secondary me-2" to="/login">
                    Iniciar sesión
                  </Link>
                  <Link className="btn btn-secondary me-2" to="/registro">
                    Registrate
                  </Link>
                  <Link className="btn btn-success me-2" to="/registro">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                  </Link>
                </div>
              )
            ) : null}
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
