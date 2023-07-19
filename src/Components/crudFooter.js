import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { URL_INFOEMPRESA, URL_CLOUDINARY } from "../Url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CrudComponent = () => {
  const [logo, setLogo] = useState("");
  const [nombre, setNombre] = useState("");
  const [sobreNosotros, setSobrenosotros] = useState("");
  const [avisoPrivacidad, setAvisoprivacidad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [horario, setHorario] = useState("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [isFormVisible, setFormVisibility] = useState(false);
  const [hasRecords, setHasRecords] = useState(false);
  const [isInserted, setIsInserted] = useState(false);
  const [isInsertionAllowed, setIsInsertionAllowed] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  // Función para cargar la imagen en Cloudinary
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
      setLogo(file.secure_url);
    } catch (error) {
      setError("Error al cargar la imagen");
    }
    setLoading(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    const MySwal = withReactContent(Swal);
    e.preventDefault();
    if (
      !nombre ||
      !sobreNosotros ||
      !avisoPrivacidad ||
      !direccion ||
      !telefono ||
      !correo ||
      !horario
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
      if (isInserted) {
        // Si no se permite la inserción, mostrar mensaje de advertencia
        MySwal.fire({
          title: "Ya se ha realizado una inserción",
          icon: "warning",
          text: "Solo se permite una inserción",
        });
      } else {
        if (editItemId) {
          // Actualizar el elemento existente
          const itemToUpdate = items.find((item) => item._id === editItemId);
          if (!itemToUpdate) {
            setError("El elemento a actualizar no existe");
            setLoading(false);
            return;
          }
          const updatedItem = {
            ...itemToUpdate,
            logo: logo,
            nombre: nombre,
            sobreNosotros: sobreNosotros,
            avisoPrivacidad: avisoPrivacidad,
            direccion: direccion,
            telefono: telefono,
            correo: correo,
            horario: horario,
          };
          await fetch(`${URL_INFOEMPRESA}/${itemToUpdate._id}`, {
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
          setLogo("");
          setNombre("");
          setSobrenosotros("");
          setAvisoprivacidad("");
          setDireccion("");
          setTelefono("");
          setCorreo("");
          setHorario("");
          setEditItemId("");
          MySwal.fire({
            title: "Registro actualizado correctamente",
            icon: "success",
          });
        } else {
          // Agregar un nuevo registro
          const res = await fetch(URL_INFOEMPRESA, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              logo: logo,
              nombre: nombre,
              sobreNosotros: sobreNosotros,
              avisoPrivacidad: avisoPrivacidad,
              direccion: direccion,
              telefono: telefono,
              correo: correo,
              horario: horario,
            }),
          });
          const data = await res.json();
          setItems((prevItems) => [...prevItems, data]);
          setLogo("");
          setNombre("");
          setSobrenosotros("");
          setAvisoprivacidad("");
          setDireccion("");
          setTelefono("");
          setCorreo("");
          setHorario("");
          MySwal.fire({
            title: "Registro agregado correctamente",
            icon: "success",
          });
          setFormVisibility(false);
          setHasRecords(true);
          setIsInsertionAllowed(false); // Se deshabilita la inserción
        }
      }
    } catch (error) {
      MySwal.fire({
        title: "Error al guardar o actualizar el elemento",
        icon: "error",
        text: "Ocurrió un error",
      });
    }
    setLoading(false);
  };

  // Función para manejar la eliminación de un registro
  const handleDelete = async (id, nombre) => {
    setLoading(true);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro que quiere eliminar ${nombre}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${URL_INFOEMPRESA}/${id}`, { method: "DELETE" })
          .then(() => {
            setItems((prevItems) =>
              prevItems.filter((item) => item._id !== id)
            );
            show_alert("Registro eliminado correctamente", "success");
            setIsDeleted(true);
            setIsInsertionAllowed(true); // Se permite la inserción nuevamente
          })
          .catch(() => {
            show_alert("Error al eliminar el registro", "error");
          });
      }
    });
    setLoading(false);
  };

  // Función para manejar la edición de un registro
  const handleEdit = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (!itemToEdit) {
      setError("El elemento a editar no existe");
      return;
    }
    setEditItemId(id);
    setLogo(itemToEdit.logo);
    setNombre(itemToEdit.nombre);
    setSobrenosotros(itemToEdit.sobreNosotros);
    setAvisoprivacidad(itemToEdit.avisoPrivacidad);
    setDireccion(itemToEdit.direccion);
    setTelefono(itemToEdit.telefono);
    setCorreo(itemToEdit.correo);
    setHorario(itemToEdit.horario);
    setFormVisibility(true);
  };

  // Función para obtener los elementos de la empresa desde la API
  useEffect(() => {
    const MySwal = withReactContent(Swal);
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(URL_INFOEMPRESA);
        const data = await res.json();
        setItems(data);
        setHasRecords(data.length > 0);
        setIsInserted(data.length > 0);
      } catch (error) {
        MySwal.fire({
          title: "Error al obtener los elementos",
          icon: "error",
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [URL_INFOEMPRESA]);

  // Función para manejar el botón "Agregar"
  const handleAddButtonClick = () => {
    if (!isInserted) {
      // Verifica si no se ha realizado una inserción antes de mostrar el formulario
      setFormVisibility(true);
      setEditItemId("");
      setLogo("");
      setNombre("");
      setSobrenosotros("");
      setAvisoprivacidad("");
      setDireccion("");
      setTelefono("");
      setCorreo("");
      setHorario("");
    } else {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "No es posible agregar más registros",
        icon: "warning",
        text: "Ya se ha realizado una inserción",
      });
    }
  };

  // Función para manejar el botón "Cancelar"
  const handleCancelButtonClick = () => {
    setFormVisibility(false);
    setError("");
    setIsDeleted(false);
  };

  // Función para mostrar una alerta utilizando SweetAlert2
  const show_alert = (text, icon) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: text,
      icon: icon,
    });
  };

  useEffect(() => {
    setHasRecords(items.length > 0);
  }, [items]);

  return (
    <div>
      <div className="App">
        {/* Encabezado */}
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="row mt-5 ">
              <div className="col-md-4 offset-md-4">
                <div className="d-grid mx-auto">
                  <h1 className="text-center fs-5">Informacion empresa</h1>
                </div>
                {/* Botón Agregar */}
                <div className="d-grid mx-auto">
                  {!hasRecords && !isInserted && !isDeleted && (
                    <Button onClick={handleAddButtonClick} variant="success">
                      Agregar
                    </Button>
                  )}
                </div>
                {error && <p className="text-center text-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-lg-8 offset-0 offset-lg-2">
          <div className="table-responsive">
            {/* Spinner de carga o tabla de elementos */}
            {loading ? (
              <Spinner animation="border" variant="info" />
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Nombre</th>
                    <th>Sobre Nosotros</th>
                    <th>Aviso Privacidad</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Horario</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {/* Renderizar los elementos */}
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {/* Mostrar el logo si existe */}
                        {item.logo && (
                          <img
                            src={item.logo}
                            alt="Logo"
                            className="img-thumbnail"
                            width="50"
                            height="50"
                          />
                        )}
                      </td>
                      <td>{item.nombre}</td>
                      <td>{item.sobreNosotros}</td>
                      <td>{item.avisoPrivacidad}</td>
                      <td>{item.direccion}</td>
                      <td>{item.telefono}</td>
                      <td>{item.correo}</td>
                      <td>{item.horario}</td>
                      <td>
                        {/* Botones de Eliminar y Editar */}
                        <button
                          className="btn btn-danger me-2"
                          onClick={() => handleDelete(item._id, item.nombre)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(item._id)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      <Modal show={isFormVisible} onHide={handleCancelButtonClick}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editItemId ? "Editar" : "Agregar"} Información de la Empresa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <div className="mb-3 ">
              <label htmlFor="logo" className="form-label">
                Logo
              </label>
              <input
                type="file"
                id="logo"
                onChange={uploadImage}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control"
                placeholder="Nombre"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sobre Nosotros</label>
              <input
                type="text"
                value={sobreNosotros}
                onChange={(e) => setSobrenosotros(e.target.value)}
                className="form-control"
                placeholder="Sobre Nosotros"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Aviso Privacidad</label>
              <textarea
                value={avisoPrivacidad}
                onChange={(e) => setAvisoprivacidad(e.target.value)}
                className="form-control"
                placeholder="Aviso Privacidad"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="form-control"
                placeholder="Dirección"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="number"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="form-control"
                placeholder="Teléfono"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="form-control"
                placeholder="Correo"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Horario</label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="form-control"
                placeholder="Horario"
              />
            </div>

            {/* Botones de Guardar/Actualizar y Cancelar */}
            {loading ? (
              <div className="d-grid">
                <Spinner animation="border" variant="info" />
                <Button variant="secondary" onClick={handleCancelButtonClick}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="d-grid">
                <Button type="submit" variant="primary">
                  {editItemId ? "Actualizar" : "Guardar"}
                </Button>
                <Button variant="secondary" onClick={handleCancelButtonClick}>
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CrudComponent;
