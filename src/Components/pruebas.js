import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { show_alerta } from "../funtions";
import "../Css/prodPreview.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import img4 from "../img/razr22.png";
import img41 from "../img/razr22-pantalla.png";
import img42 from "../img/razr22-show.png";
import img43 from "../img/razr22-plegable.png";

const ProdPreview = () => {
  const products = [
    {
      images: [img4, img41, img42, img43],
      title: "Título del producto 3",
      description: "Descripción del producto 3",
      id: 4,
    },
    
  ];

  const [cantidad, setCantidad] = useState(0);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (id, title, description, images) => {
    setModalData({ id, title, description, images });
    setSelectedImage(images[0]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const comprar = () => {
    if (user) {
      // Resto del código de la función comprar...
    } else {
      show_alerta("No puede agregar al carrito, regístrese", "warning");
    }
  };

  return (
    <section className="portafolio">
      <div className="contenedor">
        <h2 className="text-center">{`Productos nuevos`}</h2>
        <hr className="border-3 opacity-100 " style={{ color: "#ffff" }} />

        <div className="galeria-port ">
          {products.map((product) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 ms-1"
              key={product.id}
              onClick={() =>
                openModal(
                  product.id,
                  product.title,
                  product.description,
                  product.images
                )
              }
              style={{ cursor: "pointer" }}
            >
              <motion.div
                className="card-img-container m-1"
                key={product.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card>
                  <Card.Img
                    src={product.images[0]}
                    alt="..."
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                  <Card.Body>
                    <Card.Title style={{ color: "#044D8C" }}>
                      {product.title}
                    </Card.Title>
                    <Card.Text className="descProducto">
                      {product.description}
                    </Card.Text>
                    <Link className="btnvermas" to={`/producto/${product.id}`}>
                      Ver más
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton className="text-primary">
          <Modal.Title className="fs-4" style={{ fontFamily: "Arial" }}>
            Comprar Producto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="d-flex flex-column align-items-center">
                {modalData.images &&
                  modalData.images.map((image, index) => (
                    <motion.img
                      key={index}
                      src={image}
                      className={`img-thumbnail my-2 ${
                        selectedImage === image ? "selected" : ""
                      }`}
                      alt={modalData.title}
                      style={{ width: "80px", height: "auto",cursor: "pointer" }}
                      
                      onClick={() => handleThumbnailClick(image)}
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-center align-items-center">
                <motion.img
                  src={selectedImage}
                  className="img-fluid"
                  alt={modalData.title}
                  whileHover={{ scale: 1.1 }}
                />
              </div>
              <h2 className="text-primary" style={{ fontFamily: "Arial" }}>
                {modalData.title}
              </h2>
              <p>{modalData.description}</p>
              <div className="form-group">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  min="0"
                  tabIndex="2"
                  placeholder="0"
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
              <hr />
              <div className="d-grid col-6 mx-auto mt-4">
                <Button
                  className="btn btn-primary rounded-5"
                  onClick={comprar}
                >
                  <i className="fa-solid fa-floppy-disk"></i> Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ProdPreview;
