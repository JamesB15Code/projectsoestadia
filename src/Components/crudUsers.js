import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { URL_USERS } from "../Url";

const CrudUser = () => {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [isFormVisible, setFormVisibility] = useState(false);

  const handleSubmit = async (e) => {
    const MySwal = withReactContent(Swal);
    e.preventDefault();
    if (!nombre || !username || !contraseña || !email || !rol) {
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
          nombre: nombre,
          username: username,
          contraseña: contraseña,
          email: email,
          rol: rol,
        };
        await fetch(`${URL_USERS}/${itemToUpdate._id}`, {
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
        setNombre("");
        setUsername("");
        setContraseña("");
        setEmail("");
        setRol("");
        setEditItemId("");
        MySwal.fire({
          title: "Registro actualizado correctamente",
          icon: "success",
        });
      } else {
        const res = await fetch(URL_USERS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre,
            username: username,
            contraseña: contraseña,
            email: email,
            rol: rol,
          }),
        });
        const newItem = await res.json();
        setItems((prevItems) => [...prevItems, newItem]);
        setNombre("");
        setUsername("");
        setContraseña("");
        setEmail("");
        setRol("");

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
    setNombre(itemToEdit.nombre);
    setUsername(itemToEdit.username);
    setContraseña(itemToEdit.contraseña);
    setEmail(itemToEdit.email);
    setRol(itemToEdit.rol);
    setEditItemId(itemId);
    setFormVisibility(true);
  };

  const handleDelete = async (itemId, nombre) => {
    const MySwal = withReactContent(Swal);
    const itemToDelete = items.find((item) => item._id === itemId);
    if (!itemToDelete) {
      setError("El elemento a eliminar no existe");
      return;
    }
    MySwal.fire({
      title: "¿Estás seguro de eliminar " + nombre + " ?",
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
          await fetch(`${URL_USERS}/${itemToDelete._id}`, {
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
        const res = await fetch(URL_USERS);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        setError("Error al cargar los registros");
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchItems(); // Vuelve a llamar a la función fetchItems para actualizar los datos
    }, 5000); // Actualiza cada 5 segundos (ajusta el intervalo según tus necesidades)

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente

    async function fetchItems() {
      try {
        const res = await fetch(URL_USERS);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        setError("Error al cargar los registros");
      }
    }
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
                  <div className="row mb-3 ">
                    <div className="col ">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="form-control"
                        placeholder="nombre"
                        name="Nombre"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Contraseña</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={contraseña}
                          onChange={(e) => setContraseña(e.target.value)}
                          className="form-control"
                          placeholder="Contraseña"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Nombre usuario</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        placeholder="Nombre usuario"
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col">
                      <label className="form-label">Correo</label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Correo"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Rol</label>
                      <select
                        id="rol"
                        type="text"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="form-control"
                        placeholder="Rol"
                      >
                        <option value="">Seleciona rol</option>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                  >
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
            Agregar un nuevo admin
          </button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Username</th>
            <th scope="col">Contraseña</th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.nombre}</td>
              <td>{item.username}</td>
              <td>{item.contraseña}</td>
              <td>{item.email}</td>
              <td>{item.rol}</td>
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
                  onClick={() => handleDelete(item._id, item.nombre)}
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

export default CrudUser;
