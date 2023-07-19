import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { show_alerta } from "../funtions";
import { motion } from "framer-motion";
import axios from "axios";
import "../Css/prodPreview.css";
import { URL_PRODUCT } from "../Url";

export default function Showphones() {
  const [products, setProducts] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(URL_PRODUCT);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (
    id,
    marca,
    modelo,
    descripcion,
    existencia,
    categoria,
    precio,
    imagen
  ) => {
    setModalData({
      id,
      marca,
      modelo,
      descripcion,
      existencia,
      categoria,
      precio,
      imagen,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const comprar = () => {
    if (user) {
      // Resto del código de la función comprar...
    } else {
      show_alerta("No puede agregar al carrito, regístrese", "warning");
    }
  };

  return (
    <div className="mt-5 pt-5 contenedor">
      <div className="d-flex justify-content-center">
        <section id="galeria" className="container">
          <div className="galeria-port ">
            {products.map((product) => (
              <div
                className="col-lg-3 col-md-4 col-sm-6"
                key={product._id}
                onClick={() =>
                  openModal(
                    product._id,
                    product.marca,
                    product.modelo,
                    product.descripcion,
                    product.existencia,
                    product.categoria,
                    product.precio,
                    product.imagen
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <motion.div
                  className="card-img-container p-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card mb-3">
                    <img
                      src={product.imagen}
                      alt={product.marca}
                      className="card-img"
                    />
                    <div className="card-body text-center">
                      <h2
                        id="marca"
                        className="text-dark"
                        style={{ fontFamily: "Arial" }}
                      >
                        {product.marca}
                      </h2>
                      <p className="card-text ">{product.modelo}</p>
                      <p className="card-text fs-5">Desde ${product.precio}</p>

                      <button
                        className="btn btn btn-primary rounded-5"
                        id="btn-Agregar"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header text-primary">
                <h5
                  className="modal-title fs-4"
                  style={{ fontFamily: "Arial" }}
                >
                  Comprar Producto
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <img
                      src={modalData.imagen}
                      className="img-fluid"
                      alt={modalData.marca}
                    />
                  </div>
                  <div className="col-md-8">
                    <h2
                      id="marca"
                      className="text-primary"
                      style={{ fontFamily: "Arial" }}
                    >
                      {modalData.marca}
                    </h2>
                    <p>{modalData.modelo}</p>
                    <p>Desde: ${modalData.precio}</p>
                    <p>{modalData.descripcion}</p>
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
                      <button
                        className="btn btn-primary rounded-5"
                        onClick={comprar}
                      >
                        <i className="fa-solid fa-floppy-disk "></i> Agregar al
                        carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  id="btncerrar"
                  type="button"
                  className="btn btn-secondary "
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
