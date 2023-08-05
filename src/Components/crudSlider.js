import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../funtions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const CrudSlider = () => {
  const [slider, setSlider] = useState([]);
  const [id, setId] = useState("");

  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const [opcion, setOpcion] = useState("");
  const [title, setTitle] = useState("");

  const urlCloudinary = "https://api.cloudinary.com/v1_1/dchgfutbv/image/upload";
  const URL_SLIDER = "http://localhost/proyectoApi/apiSlider.php";

  useEffect(() => {
    getSlider();
  }, []);

  const getSlider = async () => {
    try {
      const response = await axios.get(URL_SLIDER);
      setSlider(response.data);
    } catch (error) {
      show_alerta("Error fetching products", "error");
      console.log(error);
    }
  };

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "innovaciones");
    try {
      const res = await fetch(urlCloudinary, {
        method: 'POST',
        body: data,
      });
      const file = await res.json();
      setImagen(file.secure_url);
      show_alerta('Cargado');
    } catch (error) {
      show_alerta('Error al cargar la imagen');
    }
  };

  const openModal = (op, product) => {
    setId("");
    setDescripcion("");
    setImagen("");
    setOpcion(op);
    if (op === 1) {
      setTitle("Registar datos del slider");
    } else if (op === 2 && product) {
      setTitle("Editar datos del slider");
      setId(product.idProducto);
      setDescripcion(product.descripcion);
      setImagen(product.imagen);
    }

    window.setTimeout(function () {
      document.getElementById("descripcion").focus();
    }, 500);
  };

  const validar = () => {
    if (descripcion === "") {
      show_alerta("Introduce la descripcion del producto", "warning"); 
    } else {
      const productData = {
        descripcion: descripcion,
        imagen: imagen,
      };

      if (opcion === 1) {
        guardar(productData);
      } else {
        editar(productData, id);
      }
    }
  };

  const guardar = async (productData) => {
    try {
      await axios.post(URL_SLIDER, productData);
      show_alerta("Guardado", "success");
      document.getElementById("btncerrar").click();
      getSlider();
    } catch (error) {
      show_alerta("Error al guardar", "error");
      console.log(error);
    }
  };

  const editar = async (productData, idSlider) => {
    try {
      await axios.put(`${URL_SLIDER}?idSlider=${idSlider}`, productData);
      show_alerta("Producto actualizado correctamente", "success");
      document.getElementById("btncerrar").click();
      getSlider();
    } catch (error) {
      show_alerta("Error al actuzaliar el producto", "error");
      console.log(error);
    }
  };

  const eliminar = (idSlider) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Estas seguro de eliminar los datos del slider?",
      icon: "question",
      text: "Esta accion es irreversible.",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${URL_SLIDER}?idSlider=${idSlider}`)
          .then(function () {
            show_alerta("Datos del slider eliminado correctamente", "success");
            getSlider();
          })
          .catch(function (error) {
            show_alerta("Error al actuzaliar datos slider", "error");
            console.log(error);
          });
      } else {
        show_alerta("Los datos del slider no se elimino", "info");
      }
    });
  };

  return (
    <div className="container">
      <div className="App">
        <div className="container-fluid ">
          <div className="row mt-5">
            <div className="row mt-5 mb-4">
              <div className="col-md-4 offset-md-4">
                <div className="d-grid mx-auto">
                  <h5 className="text-center fs-5">Gestion de productos</h5>
                  <button onClick={() => openModal(1)} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalProducts">
                    Ingresa datos al Slider
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 d-flex justify-content-center">
            <div className="col-9 col-lg-9 offset-0 offset-lg-0">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Descripción</th>
                      <th>Imagen</th>
                      <th>Aciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {slider.map((product) => (
                      <tr key={product.idSlider}>
                        <td>{product.idSlider}</td>
                        <td >{product.descripcion}</td>
                        <td>
                        {product.imagen ? (
                              <img
                                src={product.imagen}
                                alt="Logo"
                                width="50"
                                height="50"
                              />
                            ) : (
                              "-"
                            )}
                        </td>
                        <td className="d-flex justify-content-center">
                          <button onClick={() => openModal(2, product)} className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalProducts">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          &nbsp;
                          <button onClick={() => eliminar(product.idProducto)} className="btn btn-danger">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {opcion !== "" && (
           <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}>
           <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{title}</label>
                <button type="button" className="btn-close" onClick={() => setOpcion("")}></button>
              </div>
              <div className="modal-body">
                
                <div className="input-group mb-3">
                  <span className="input-group-text">Descripción</span>
                  <input type="text" id="descripcion" className="form-control" placeholder="Ingrese la descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Imagen</label>
                  <input type="file" onChange={uploadImage} className="form-control" />
                </div>
        
                <div className="d-grid col-6 mx-auto">
                  <button onClick={() => validar()} className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setOpcion("")}>
                Cerrar
              </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CrudSlider;