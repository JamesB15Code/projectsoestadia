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
  const [infEmpresa, setInfEmpresa] = useState({});

  useEffect(() => {
    getInformacionEmpresa();
  }, []);

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
            <Nav.Link className="text-light" as={Link} to="/crudUsers">
              Valores
            </Nav.Link>

            <NavDropdown
              className=""
              title="Información"
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/crudPhones"
              >
                Informacion de telefonos
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/crudUsers"
              >
                Informacion de usuarios
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/crudFooter"
              >
                Informacion de empresa
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/crudLogos"
              >
                Informacion de Logo
              </NavDropdown.Item>
              <NavDropdown.Item
                className="text-secondary"
                as={Link}
                to="/"
              >
                Cliente
              </NavDropdown.Item>
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
                    Cerrar sesión
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
