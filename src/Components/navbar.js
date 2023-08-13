import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faShoppingCart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Navbarr() {
  const history = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [infEmpresa, setInfEmpresa] = useState({ logo: "../img/logo.png" });
  const URL_INFEMPRESA = "http://localhost/proyectoApi/apiEmpresa.php";

  let userNombre = localStorage.getItem('nombre');
  let userCorreo = localStorage.getItem('correo');
  let rol = localStorage.getItem('rol'); 

  useEffect(() => {
    getInformacionEmpresa();
  }, []);

  const getInformacionEmpresa = async () => {
    try {
      const response = await axios.get(URL_INFEMPRESA);
      setInfEmpresa(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const Salir = () => {
    logout();
    history("/login");
  };

  if(rol === 'admin'){
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
              <Nav.Link className="text-light" as={Link} to="/admin">
                Inicio
              </Nav.Link>
              <Nav.Link className="text-light" as={Link} to="/ordenesCompraAdmin">
                Ordenes
              </Nav.Link>
              <NavDropdown
                className=""
                title="Registro de datos"
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item
                  className="text-secondary"
                  as={Link}
                  to="/crudProducts"
                >
                  Gestión de productos
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-secondary"
                  as={Link}
                  to="/crudUsers"
                >
                  Gestión de usuarios
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-secondary"
                  as={Link}
                  to="/crudEmpresa"
                >
                  Gestión de empresa
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-secondary"
                  as={Link}
                  to="/crudLogos"
                >
                  Gestión de Logo
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-secondary"
                  as={Link}
                  to="/crudSlider"
                >
                  Gestión del Slider
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
  
            <Dropdown>
              {isAuthenticated !== null ? (
                isAuthenticated ? (
                  <>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-menu-admin"
                      className="btn btn-light me-2 "
                    >
                      <FontAwesomeIcon
                        size="2x"
                        className="fs-3 "
                        icon={faCircleUser}
                      />
                      <span className="ms-2">{userNombre}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="row justify-content-center ">
                      <div className="border-bottom">
                        <Dropdown.Item as={Link}>
                          <FontAwesomeIcon
                            size="2x"
                            className="fs-3 me-4"
                            icon={faCircleUser}
                          />
                          {userNombre}
                          <div>{userCorreo}</div>
                        </Dropdown.Item>
                      </div>
  
                      <Dropdown.Item as={Link} to="/perfilAdmin">
                        <FontAwesomeIcon
                          className="fs-5 me-1 mt-1"
                          icon={faCircleUser}
                        />
                        Perfil
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} onClick={Salir}>
                        <FontAwesomeIcon
                          className="fs-5 me-1 mt-1"
                          icon={faSignOutAlt}
                        />
                        salir
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} onClick={Salir}>
                      <FontAwesomeIcon
                        className="fs-5 me-1 mt-1"
                        icon={faSignOutAlt}
                      />
                      salir
                    </Dropdown.Item>
                  </>
                )
              ) : null}
            </Dropdown>
            
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }else {
    return (
      <Navbar
        className="navbar navbar-expand-sm navbar-dark fixed-top"
        expand="lg"
        fixed="top"
        style={{ backgroundColor: "#0554F2" }}
      >
        <div className="container">
          <Navbar.Brand as={Link} to="/">
            <div className="d-flex ms-2 me-3">
              <div>
                {infEmpresa && infEmpresa.logo ? (
                  <img width="50" src={infEmpresa.logo} alt="" />
                ) : (
                  <img width="50" src={infEmpresa} alt="" />
                )}
              </div>
              <div className="mt-2 h4">
                {infEmpresa && infEmpresa.nombre ? (
                  infEmpresa.nombre
                ) : (
                  <span>M&G INNOVACIONES</span>
                )}
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto fs-5">
              <Nav.Link className="text-light" as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link className="text-light" as={Link} to="/showphones">
                Telefonos
              </Nav.Link>
              <Nav.Link className="text-light" as={Link} to="/showtablets">
                Tabletas
              </Nav.Link>
              <Nav.Link className="text-light" as={Link} to="/showAudio">
                Audio
              </Nav.Link>
              <Nav.Link className="text-light " as={Link} to="/showAcesorios">
                Accesorios
              </Nav.Link>
            </Nav>

            <Dropdown>
              {isAuthenticated !== null ? (
                isAuthenticated ? (
                  <div>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-menu-admin"
                      className="btn btn-light me-2 "
                    >
                      <FontAwesomeIcon
                        size="2x"
                        className="fs-3 "
                        icon={faCircleUser}
                      />
                      <span className="ms-2">{userNombre}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="row justify-content-center ">
                      <div className="border-bottom">
                        <Dropdown.Item as={Link}>
                          <FontAwesomeIcon
                            size="2x"
                            className="fs-3 me-4"
                            icon={faCircleUser}
                          />
                          {userNombre}
                          <div>{userCorreo}</div>
                        </Dropdown.Item>
                      </div>
                      <Dropdown.Item as={Link} to="/ordenesCompra">
                        <FontAwesomeIcon
                          className="fs-5 mt-1"
                          icon={faShoppingCart}
                        />{" "}
                        Pedidos
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/perfilUser">
                        <FontAwesomeIcon
                          className="fs-5 me-1 mt-1"
                          icon={faCircleUser}
                        />
                        Perfil
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} onClick={Salir} to="/login">
                        <FontAwesomeIcon
                          className="fs-5 me-1 mt-1"
                          icon={faSignOutAlt}
                        />
                        salir
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center">
                    <Link
                      className="btn btn-light me-2 text-primary  "
                      to="/login"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      className="btn btn-light me-2 text-primary "
                      to="/registro"
                    >
                      Registrate
                    </Link>
                  </div>
                )
              ) : null}
            </Dropdown>
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }
}
