import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../funtions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const CrudProducts = () => {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [existencia, setExistencia] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagen2, setImagen2] = useState("");
  const [imagen3, setImagen3] = useState("");
  const [imagen4, setImagen4] = useState("");

  const [opcion, setOpcion] = useState("");
  const [title, setTitle] = useState("");
  const [selectedProduct, setSelectedProducts] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    imagen: "",
    imagen2: "",
    imagen3: "",
    imagen4: "",
  });

  const URL_PRODUCTOS_SELECT = "http://localhost/proyectoApi/selectProduct.php";
  const urlCloudinary =
    "https://api.cloudinary.com/v1_1/dchgfutbv/image/upload";
  const URL_PRODUCTOS = "http://localhost/proyectoApi/apiProducto.php";

  useEffect(() => {
    getProducts();
    getSelectedProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(URL_PRODUCTOS);
      setProducts(response.data);
    } catch (error) {
      show_alerta("Error fetching products", "error");
      console.log(error);
    }
  };

  const getSelectedProducts = async () => {
    try {
      const response = await axios.get(URL_PRODUCTOS_SELECT);
      setSelectedProducts(response.data.map((product) => product.idProducto));
    } catch (error) {
      console.error("Error fetching selected products:", error);
    }
  };

  const uploadImage = async (e, imageNumber) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "innovaciones");
    try {
      const res = await fetch(urlCloudinary, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      switch (imageNumber) {
        case 1:
          setImagen(file.secure_url);
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            imagen: URL.createObjectURL(files[0]),
          }));
          break;
        case 2:
          setImagen2(file.secure_url);
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            imagen2: URL.createObjectURL(files[0]),
          }));
          break;
        case 3:
          setImagen3(file.secure_url);
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            imagen3: URL.createObjectURL(files[0]),
          }));
          break;
        case 4:
          setImagen4(file.secure_url);
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            imagen4: URL.createObjectURL(files[0]),
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      show_alerta("Error al cargar la imagen");
    }
  };

  const openModal = (op, product) => {
    setId("");
    setMarca("");
    setModelo("");
    setColor("");
    setDescripcion("");
    setCategoria("");
    setExistencia("");
    setPrecio("");
    setImagen("");
    setImagen2("");
    setImagen3("");
    setImagen4("");
    setImagePreviews({
      imagen: "",
      imagen2: "",
      imagen3: "",
      imagen4: "",
    });
    setOpcion(op);
    if (op === 1) {
      setTitle("Registar producto");
    } else if (op === 2 && product) {
      setTitle("Editar producto");
      setId(product.idProducto);
      setMarca(product.marca);
      setModelo(product.modelo);
      setColor(product.color);
      setDescripcion(product.descripcion);
      setCategoria(product.categoria);
      setExistencia(product.existencia);
      setPrecio(product.precio);
      setImagen(product.imagen);
      setImagen2(product.imagen2);
      setImagen3(product.imagen3);
      setImagen4(product.imagen4);
      setImagePreviews({
        imagen: product.imagen,
        imagen2: product.imagen2,
        imagen3: product.imagen3,
        imagen4: product.imagen4,
      });
    }

    window.setTimeout(function () {
      document.getElementById("marca").focus();
      const modalregistro = document.getElementById("ModalReg");
      modalregistro.style.display = "block";
    }, 500);
  };

  const validar = () => {
    if (marca === "") {
      show_alerta("Introduce la marca del producto", "warning");
    } else if (modelo === "") {
      show_alerta("Introduce la modelo del producto", "warning");
    } else if (color === "") {
      show_alerta("Introduce la color del productor", "warning");
    } else if (descripcion === "") {
      show_alerta("Introduce la descripción del producto", "warning");
    } else if (categoria === "") {
      show_alerta("Introduce la categoria del producto", "warning");
    } else if (existencia === "") {
      show_alerta("Introduce la existencia del producto", "warning");
    } else if (precio === "") {
      show_alerta("Introduce la precio del producto", "warning");
    } else {
      const productData = {
        marca: marca,
        modelo: modelo,
        color: color,
        descripcion: descripcion,
        categoria: categoria,
        existencia: existencia,
        precio: precio,
        imagen: imagen,
        imagen2: imagen2,
        imagen3: imagen3,
        imagen4: imagen4,
      };

      if (opcion === 1) {
        guardar(productData);
      } else {
        editar(productData, id);
      }
    }
  };

  const guardar = async (productData) => {
    // Verificar si el producto ya existe en la lista de productos
    const isDuplicate = products.some(
      (product) =>
        product.marca === productData.marca &&
        product.modelo === productData.modelo
    );

    if (isDuplicate) {
      show_alerta("El producto ya existe en la lista.", "warning");
      return;
    }
    try {
      await axios.post(URL_PRODUCTOS, productData);
      show_alerta("Guardado", "success");
      const modalreg = document.getElementById("ModalReg");
      modalreg.style.display = "none";

      getProducts();
    } catch (error) {
      show_alerta("Error al guardar", "error");
      console.log(error);
    }
  };

  const editar = async (productData, idProducto) => {
    try {
      await axios.put(`${URL_PRODUCTOS}?idProducto=${idProducto}`, productData);
      show_alerta("Producto actualizado correctamente", "success");
      const modalreg = document.getElementById("ModalReg");
      modalreg.style.display = "none";
      getProducts();
    } catch (error) {
      show_alerta("Error al actualizar el producto", "error");
      console.log(error);
    }
  };

  const eliminar = (idProducto) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Estas seguro de eliminar este producto?",
      icon: "question",
      text: "Esta accion es irreversible.",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${URL_PRODUCTOS}?idProducto=${idProducto}`)
          .then(function () {
            show_alerta("Producto eliminado correctamente", "success");
            getProducts();
          })
          .catch(function (error) {
            show_alerta("Error al actuzaliar el producto", "error");
            console.log(error);
          });
      } else {
        show_alerta("El producto no se elimino", "info");
      }
    });
  };

  const toggleProductSelection = async (productId) => {
    if (selectedProduct.includes(productId)) {
      // Deselection
      try {
        await axios.delete(`${URL_PRODUCTOS_SELECT}?idSelect=${productId}`);
        setSelectedProducts((prevSelectedProducts) =>
          prevSelectedProducts.filter((idSelect) => idSelect !== productId)
        );
        show_alerta("Producto deseleccionado y eliminado.", "success");
      } catch (error) {
        show_alerta("Error al deseleccionar el producto.", "error");
        console.error(error);
      }
    } else {
      // Selection
      if (selectedProduct.length >= 3) {
        show_alerta("Solo puedes elegir 3 productos.", "warning");
        return;
      }
      try {
        await axios.post(URL_PRODUCTOS_SELECT, { idProducto: productId });
        setSelectedProducts((prevSelectedProducts) => [
          ...prevSelectedProducts,
          productId,
        ]);
        show_alerta("Producto seleccionado.", "success");
      } catch (error) {
        show_alerta("Error al seleccionar el producto.", "error");
        console.error(error);
      }
    }
  };

  

  const getBrandAndModel = (productId) => {
    const selectedProduct = products.find(
      (product) => product.idProducto === productId
    );
    return selectedProduct
      ? `${selectedProduct.marca} - ${selectedProduct.modelo}`
      : "";
  };

  return (
    <div className="">
      <div className="App">
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="row mt-5 ">
              <div className="col-md-4 offset-md-4 d-flex">
                <div className="d-grid mx-auto">
                  <h5 className="text-center fs-5">Gestión de productos</h5>
                  <button
                    onClick={() => openModal(1)}
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#modalProducts"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 offset-md-1 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Productos seleccionados:</h5>
                  <ul>
                    {selectedProduct.map((productId) => (
                      <li key={productId}>
                        Producto: {getBrandAndModel(productId)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 col-md-12 offset-0 offset-lg-0">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Color</th>
                      <th>Descripción</th>
                      <th>Categoria</th>
                      <th>Existencia</th>
                      <th>Precio</th>
                      <th>Imagen</th>
                      <th>Imagen 2</th>
                      <th>Imagen 3</th>
                      <th>Imagen 4</th>
                      <th>Aciones</th>
                      <th>Selecciona</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {products.map((product, i) => (
                      <tr key={product.idProducto}>
                        <td>{i + 1}</td>
                        <td>{product.marca}</td>
                        <td>{product.modelo}</td>
                        <td>{product.color}</td>
                        <td>{product.descripcion}</td>
                        <td>{product.categoria}</td>
                        <td>{product.existencia}</td>
                        <td>{product.precio}</td>
                        <td>
                          <div className="w-50">
                            <img
                              src={product.imagen}
                              className="img-fluid w-100 h-100"
                              alt="Product"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="w-50">
                            <img
                              src={product.imagen2}
                              className="img-fluid w-100 h-100"
                              alt="Product"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="w-50">
                            <img
                              src={product.imagen3}
                              className="img-fluid w-100 h-100"
                              alt="Product"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="w-50">
                            <img
                              src={product.imagen4}
                              className="img-fluid w-100 h-100"
                              alt="Product"
                            />
                          </div>
                        </td>
                        <td className="d-flex">
                          <button
                            onClick={() => openModal(2, product)}
                            className="btn btn-warning"
                            data-bs-toggle="modal"
                            data-bs-target="#modalProducts"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          &nbsp;
                          <button
                            onClick={() => eliminar(product.idProducto)}
                            className="btn btn-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                        <td>
                          {selectedProduct.includes(product.idProducto) ? (
                            <p
                              className=""
                              
                            >
                              Selecionado
                            </p>
                          ) : (
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                toggleProductSelection(product.idProducto)
                              }
                            >
                              Add
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {opcion !== "" && (
        <div
          id="ModalReg"
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpcion("")}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6 ">
                      <div className="form-group">
                        <label htmlFor="marca">Marca</label>
                        <input
                          type="text"
                          id="marca"
                          className="form-control"
                          placeholder="Ingrese la marca"
                          value={marca}
                          onChange={(e) => setMarca(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 ">
                      <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <input
                          type="text"
                          id="color"
                          className="form-control"
                          placeholder="Ingrese el color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 ">
                      <label htmlFor="modelo">Modelo</label>
                      <input
                        type="text"
                        id="modelo"
                        className="form-control"
                        placeholder="Ingrese el modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 ">
                      <label htmlFor="categoria">Categoria</label>
                      <select
                        id="tipo"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Selecciona categoria</option>
                        <option value="Smartphone">Smartphone</option>
                        <option value="Tablets">Tablets</option>
                        <option value="Audio">Audio</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                      type="text"
                      id="descripcion"
                      className="form-control"
                      placeholder="Ingrese la descripción"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 ">
                      <label htmlFor="precio">Precio</label>
                      <input
                        type="number"
                        id="precio"
                        className="form-control"
                        placeholder="Ingrese precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 ">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="existencia">Existencia</label>
                          <input
                            type="number"
                            id="existencia"
                            className="form-control"
                            placeholder="Ingrese existencia"
                            value={existencia}
                            onChange={(e) => setExistencia(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="imagen">Imagen</label>
                      <input
                        type="file"
                        onChange={(e) => uploadImage(e, 1)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="imagen2">Imagen 2</label>
                      <input
                        type="file"
                        onChange={(e) => uploadImage(e, 2)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="imagen3">Imagen 3</label>
                      <input
                        type="file"
                        onChange={(e) => uploadImage(e, 3)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="imagen4">Imagen 4</label>
                      <input
                        type="file"
                        onChange={(e) => uploadImage(e, 4)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="form-group mb-2 d-flex w-50 ">
                {imagePreviews.imagen && (
                  <img
                    src={imagePreviews.imagen}
                    alt="Product"
                    className="img-fluid w-50 h-50"
                  />
                )}
                {imagePreviews.imagen2 && (
                  <img
                    src={imagePreviews.imagen2}
                    alt="Product"
                    className="img-fluid w-50 h-50"
                  />
                )}
                {imagePreviews.imagen3 && (
                  <img
                    src={imagePreviews.imagen3}
                    alt="Preview"
                    className="img-fluid w-50 h-50"
                  />
                )}
                {imagePreviews.imagen4 && (
                  <img
                    src={imagePreviews.imagen4}
                    alt="Preview"
                    className="img-fluid w-50 h-50"
                  />
                )}
              </div>
              <div className="modal-footer">
                <button onClick={() => validar()} className="btn btn-success">
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpcion("")}
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
};

export default CrudProducts;
