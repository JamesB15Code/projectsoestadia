import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Spinner from "react-bootstrap/Spinner";

import { URL_CLOUDINARY, URL_PRODUCT } from "../Url";

const CrudComponent = () => {
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [isFormVisible, setFormVisibility] = useState(false);
  const [modelo, setModelo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [existencia, setExistencia] = useState("");

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "innovaciones");
    setLoading(true);
    try {
      const res = await fetch(URL_CLOUDINARY, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      setImage(file.secure_url);
    } catch (error) {
      setError("Error al cargar la imagen");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    const MySwal = withReactContent(Swal);
    e.preventDefault();
    if (
      !marca ||
      !descripcion ||
      !cantidad ||
      !categoria ||
      !precio ||
      !existencia
    ) {
      MySwal.fire({
        title: "Campos incompletos",
        icon: "error",
        text: "Por favor complete todos los campos del formulario",
      });
      return;
    }
    setLoading(true);
    try {
      if (editItemId) {
        const itemToUpdate = items.find((item) => item._id === editItemId);
        if (!itemToUpdate) {
          setError("El elemento a actualizar no existe");
          setLoading(false);
          return;
        }
        const updatedItem = {
          ...itemToUpdate,
          marca: marca,
          descripcion: descripcion,
          imagen: image,
          modelo: modelo,
          cantidad: cantidad,
          categoria: categoria,
          precio: precio,
          existencia: existencia,
        };
        await fetch(`${URL_PRODUCT}/${itemToUpdate._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        });
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItemId ? updatedItem : item
          )
        );
        setMarca("");
        setDescripcion("");
        setImage("");
        setModelo("");
        setCantidad("");
        setCategoria("");
        setPrecio("");
        setExistencia("");
        setEditItemId("");
        MySwal.fire({
          title: "Registro actualizado correctamente",
          icon: "success",
        });
      } else {
        const res = await fetch(URL_PRODUCT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marca: marca,
            descripcion: descripcion,
            imagen: image,
            modelo: modelo,
            cantidad: cantidad,
            categoria: categoria,
            precio: precio,
            existencia: existencia,
          }),
        });
        const newItem = await res.json();
        setItems((prevItems) => [...prevItems, newItem]);
        setMarca("");
        setDescripcion("");
        setImage("");
        setModelo("");
        setCantidad("");
        setCategoria("");
        setPrecio("");
        setExistencia("");
        MySwal.fire({
          title: "Registro agregado correctamente",
          icon: "success",
        });
      }
    } catch (error) {
      setError("Error al guardar el registro");
    }
    setLoading(false);
  };

  const handleEdit = (itemId) => {
    const itemToEdit = items.find((item) => item._id === itemId);
    if (!itemToEdit) {
      setError("El elemento a editar no existe");
      return;
    }
    setMarca(itemToEdit.marca);
    setDescripcion(itemToEdit.descripcion);
    setImage(itemToEdit.imagen);
    setModelo(itemToEdit.modelo);
    setCantidad(itemToEdit.cantidad);
    setCategoria(itemToEdit.categoria);
    setPrecio(itemToEdit.precio);
    setExistencia(itemToEdit.existencia);
    setEditItemId(itemId);
    setFormVisibility(true);
  };

  const handleDelete = async (itemId, marca, modelo) => {
    const MySwal = withReactContent(Swal);
    const itemToDelete = items.find((item) => item._id === itemId);
    if (!itemToDelete) {
      setError("El elemento a eliminar no existe");
      return;
    }
    MySwal.fire({
      title: "¿Estás seguro de eliminar " + marca + " " + modelo + " ?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${URL_PRODUCT}/${itemToDelete._id}`, {
            method: "DELETE",
          });
          setItems((prevItems) =>
            prevItems.filter((item) => item._id !== itemId)
          );
          MySwal.fire({
            title: "Registro eliminado correctamente",
            icon: "success",
          });
        } catch (error) {
          setError("Error al eliminar el registro");
        }
      }
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(URL_PRODUCT);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        setError("Error al cargar los registros");
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="container mt-5">
      {error && <p>{error}</p>}
      {isFormVisible ? (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Agregar/Editar Registro</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setFormVisibility(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row mb-3 mt-5">
                    <div className="col">
                      <label className="form-label">Marca</label>
                      <input
                        type="text"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        className="form-control"
                        placeholder="Marca"
                        name="marca"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Modelo</label>
                      <input
                        type="text"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        className="form-control"
                        placeholder="Modelo"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Descripción</label>
                      <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="form-control"
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="text"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="form-control"
                        placeholder="Cantidad"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Categoría</label>
                      <input
                        type="text"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="form-control"
                        placeholder="Categoría"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Precio</label>
                      <input
                        type="text"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="form-control"
                        placeholder="Precio"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Existencia</label>
                      <input
                        type="text"
                        value={existencia}
                        onChange={(e) => setExistencia(e.target.value)}
                        className="form-control"
                        placeholder="Existencia"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Imagen</label>
                      <input
                        type="file"
                        onChange={uploadImage}
                        className="form-control"
                      />
                    </div>
                  </div>
                  {loading ? (
                    <Spinner animation="border" variant="info" />
                  ) : (
                    <div className="mb-3">
                      {image && (
                        <img
                          src={image}
                          alt="Product"
                          style={{ width: "200px" }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary me-2">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormVisibility(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-2 mt-5">
          <button
            type="button"
            className="btn btn-primary mt-5"
            onClick={() => setFormVisibility(true)}
          >
            Agregar Registro
          </button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Marca</th>
            <th scope="col">Descripción</th>
            <th scope="col">Imagen</th>
            <th scope="col">Modelo</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Existencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.marca}</td>
              <td>{item.descripcion}</td>
              <td>
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt="Product"
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>{item.modelo}</td>
              <td>{item.cantidad}</td>
              <td>{item.categoria}</td>
              <td>{item.precio}</td>
              <td>{item.existencia}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(item._id)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    handleDelete(item._id, item.marca, item.modelo)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudComponent;
