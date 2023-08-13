import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { show_alerta } from "../funtions";
import { AuthContext } from "../Auth/AuthProvider";
import axios from "axios";

import "../Css/prodPreview.css";

function ProductPrewie() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const { user } = useContext(AuthContext);

  let userName = localStorage.getItem('username');
  let userIdUsuario = localStorage.getItem('idUsuario');

  const now = new Date();

  const URL_PRODUCTOS = "http://localhost/proyectoApi/apiProducto.php";
  const URL_ORDEN_PRODUCTO =
    "http://localhost/proyectoApi/detallesDeCompra.php";

  // Obtenemos la fecha en formato constante (yyyy-mm-dd)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const fechaOrden = `${year}-${month}-${day}`;

  // Obtenemos la hora en formato constante (hh:mm:ss)
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const horaOrden = `${hours}:${minutes}:${seconds}`;
  const estado = "PENDIENTE";

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(URL_PRODUCTOS);
      setProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedImage(product.imagen);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCompra = async () => {
    if (userName === "" && userName === null ) {
      show_alerta("Debe iniciar sesión para realizar una compra.", 'warning');
      return;
    }

    if (!selectedProduct) {
      show_alerta("Por favor, seleccione un producto antes de comprar.", 'warning');
      return;
    }

    if (selectedProduct.existencia === 0) {
      show_alerta('Lo sentimos producto agotado', 'warning');
      return;
    }

    if (cantidad > selectedProduct.existencia) {
      show_alerta('Cantidad no disponible', 'warning');
      return;
    }

    const precioTotal = selectedProduct.precio * cantidad;

    fetch(URL_ORDEN_PRODUCTO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: userIdUsuario,
        idProducto: selectedProduct.idProducto,
        fecha_orden: fechaOrden,
        estado: estado,
        precio_unitario: selectedProduct.precio,
        precio_total_producto: precioTotal,
        total: cantidad,
        hora_orden: horaOrden
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      show_alerta("¡Compra realizada con éxito!");
    })
    .catch(error => {
      console.error(error);
      show_alerta("Hubo un error al procesar la compra. Por favor, intenta nuevamente más tarde.", 'error');
    });
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const filteredProducts = products.filter((product) => {
    const searchTermLC = searchTerm.toLowerCase();
    const marcaLC = product.marca.toLowerCase();
    const modeloLC = product.modelo.toLowerCase();
    const colorLC = product.color.toLowerCase();

    return (
      marcaLC.includes(searchTermLC) ||
      modeloLC.includes(searchTermLC) ||
      colorLC.includes(searchTermLC)
    );
  });

  return (
    <div className="contenedor">
      <div className="row  d-flex justify-content-center">
      <h2 className="text-center ">Nuestros productos </h2>
      
        <div className="row  d-flex justify-content-center ">
          <hr className="border-3 opacity-100 mt-2" style={{ color: "#ffff" }} />
          {filteredProducts.map((product) => (
            <div
              key={product.idProducto}
              className="col-md-4 mt-3 mb-4 d-flex justify-content-center"
            >
              <div className=" bg-white p-4 ">
                <img
                  src={product.imagen}
                  alt="Producto"
                  width="100%"
                  height="300px"
                />
                <div className="card-body flex-column align-items-center ">
                  <h3 className="card-title text-center text-primary ">{product.marca}</h3>
                  <div className=" text-center text-primary mt-2 ">
                    <p>{product.modelo}</p>
                    <p> {product.color}</p>
                    <p>Existencia: {product.existencia}</p>
                  </div>
                  <button
                    className="align-items-center btn btn-primary text-center "
                    onClick={() => openModal(product)}
                  >
                    Detalles de producto
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <div className="row d-flex justify-content-center">
                <div className="col-md-7 ">
                  <motion.img
                    src={selectedImage}
                    className="img-fluid  h-100 w-100"
                    alt={selectedProduct.marca}
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <div className="col-md-4">
                  <div className="d-flex flex-column align-items-center">
                    {selectedProduct.imagen && (
                      <motion.img
                        src={selectedProduct.imagen}
                        className={`img-thumbnail my-2 ${
                          selectedImage === selectedProduct.imagen
                            ? "selected"
                            : ""
                        }`}
                        alt={selectedProduct.marca}
                        style={{
                          width: "80px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleThumbnailClick(selectedProduct.imagen)
                        }
                        whileHover={{ scale: 1.1 }}
                      />
                    )}
                    {selectedProduct.imagen2 && (
                      <motion.img
                        src={selectedProduct.imagen2}
                        className={`img-thumbnail my-2 ${
                          selectedImage === selectedProduct.imagen2
                            ? "selected"
                            : ""
                        }`}
                        alt={selectedProduct.marca}
                        style={{
                          width: "80px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleThumbnailClick(selectedProduct.imagen2)
                        }
                        whileHover={{ scale: 1.1 }}
                      />
                    )}
                    {selectedProduct.imagen3 && (
                      <motion.img
                        src={selectedProduct.imagen3}
                        className={`img-thumbnail my-2 ${
                          selectedImage === selectedProduct.imagen3
                            ? "selected"
                            : ""
                        }`}
                        alt={selectedProduct.marca}
                        style={{
                          width: "80px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleThumbnailClick(selectedProduct.imagen3)
                        }
                        whileHover={{ scale: 1.1 }}
                      />
                    )}
                    {selectedProduct.imagen4 && (
                      <motion.img
                        src={selectedProduct.imagen4}
                        className={`img-thumbnail my-2 ${
                          selectedImage === selectedProduct.imagen4
                            ? "selected"
                            : ""
                        }`}
                        alt={selectedProduct.marca}
                        style={{
                          width: "80px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleThumbnailClick(selectedProduct.imagen4)
                        }
                        whileHover={{ scale: 1.1 }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <h2 className="text-primary" style={{ fontFamily: "Arial" }}>
                  {selectedProduct.marca}
                </h2>
                <p>{selectedProduct.modelo}</p>
                <p>{selectedProduct.descripcion}</p>
                <p>Color {selectedProduct.color}</p>
                <p>Precio: ${selectedProduct.precio}</p>
                <p>Existencia: {selectedProduct.existencia}</p>
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input
                    type="number"
                    id="no2"
                    min="1"
                    tabIndex="2"
                    defaultValue="1" // Establecer valor predeterminado a 1
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {userName ? ( // Verificar si el usuario ha iniciado sesión
              <div className="d-grid col-4 mx-auto mt-2">
                <Button
                  className="btn btn-primary rounded-5"
                  onClick={handleCompra}
                >
                  <i className="fa-solid fa-floppy-disk"></i> Comprar
                </Button>
              </div>
            ) : (
              <div className="text-center mt-5">
                <p className="fs-5">Inicia sesión para poder realizar una compra.</p>
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductPrewie;
