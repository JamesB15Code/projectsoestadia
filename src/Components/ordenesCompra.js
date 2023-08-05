import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { show_alerta } from '../funtions';

function OrdenesDeCompraUsuario() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const history = useNavigate();
    const [ordenesCompra, setOrdenesCompra] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('TODOS'); // Estado inicial 'TODOS'
    const URL_ORDEN_PRODUCTO = "http://localhost/proyectoApi/detallesDeCompra.php";

    useEffect(() => {
        if (user) {
            obtenerOrdenesCompraUsuario(user.idUsuarios);
        }
    }, [user]);
    useEffect(() => {
        if (!isAuthenticated) {
          history('/');
        }
      });

    const obtenerOrdenesCompraUsuario = async (idUsuario) => {
        try {
            const response = await fetch(`${URL_ORDEN_PRODUCTO}?idUsuario=${idUsuario}`);
            const data = await response.json();
            setOrdenesCompra(data);
        } catch (error) {
            console.error("Error al obtener las órdenes de compra:", error);
        }
    };

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate();
        const mes = fechaObj.getMonth() + 1;
        const año = fechaObj.getFullYear();
        return `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    };

    const handleCancelar = async (idOrdenCompra) => {
        const confirmarCancelacion = await Swal.fire({
            title: '¿Estás seguro de que deseas cancelar esta orden de compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });

        if (confirmarCancelacion.isConfirmed) {
            try {
                const response = await fetch(`http://localhost/proyectoApi/detallesDeCompra.php?idOrdenCompra=${idOrdenCompra}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estado: 'CANCELADO' }),
                });

                if (response.ok) {
                    // Actualizar la lista de órdenes después de cancelar
                    //obtenerOrdenesCompraUsuario(user.idUsuarios);
                    show_alerta('Orden de compra cancelada con éxito.', 'success');
                } else {
                    console.log('Error al cancelar la orden.');
                }
            } catch (error) {
                console.error("Error al cancelar la orden:", error);
            }
        }
    };

    // Función para manejar el cambio del select
    const handleFiltroEstado = (e) => {
        setFiltroEstado(e.target.value);
    };

    // Filtrar las órdenes según el estado seleccionado
    const ordenesFiltradas = filtroEstado === 'TODOS' ? ordenesCompra : ordenesCompra.filter(orden => orden.estado === filtroEstado);

    return (
        <div className='container mt-5'>
            <div className='row mt-5'>
                <div className='mt-5 text-center mb-1'>
                    <h2 className='text-center'>Órdenes de Compra de {user && user.nombre}</h2>
                </div>

                <div className='text-center mt-1'>
                    <h2 className='text-center text-dark fs-5 ms-4'>Filtrar por  orden</h2>
                    <select className='form-select' value={filtroEstado} onChange={handleFiltroEstado}>
                        <option value='TODOS'>TODOS</option>
                        <option value='PENDIENTE'>PENDIENTES</option>
                        <option value='CANCELADO'>CANCELADOS</option>
                        <option value='ENVIADO'>EN CAMINO</option>
                        <option value='NO ENVIADO'>NO ENVIADOS</option>
                    </select>
                </div>

                {ordenesFiltradas.length === 0 ? (
                    <h1 className='text-center text-dark fs-5 ms-4'>{user && `${user.nombre} no tienes órdenes de compra ${filtroEstado !== 'TODOS' ? ' ' + filtroEstado : ''}.`}</h1>
                ) : (
                    <div className="row g-4 mt-1 mb-4">
                        {ordenesFiltradas.map((orden, i) => (
                            <div key={orden.idOrdenCompra} className="col-md-4">
                                <div className={`card h-100 border-3d ${orden.estado === 'CANCELADO' ? 'text-danger' : 'text-success'}`}>
                                    <div className="card-body">
                                        <h1 className="text-dark fs-3 text-center mb-3"> {i + 1}. Pedido de {orden.marca} modelo {orden.modelo}</h1>
                                        <h4 className="text-dark fs-5 ms-4">Nombre: {orden.nombre_usuario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Cantidad: {orden.total}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Precio unitario:  ${orden.precio_unitario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Total a pagar de {orden.total}:  ${orden.precio_total_producto}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Fecha: {formatearFecha(orden.fecha_orden)}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Estado:
                                        {
                                        orden.estado === 'CANCELADO' || orden.estado === 'NO ENVIADO' ?
                                        <span className='text-danger'> {orden.estado}</span>
                                        : orden.estado === 'PENDIENTE' ?
                                        <span className='text-primary'> {orden.estado}</span>
                                        :
                                        <span className='text-success'> {orden.estado}</span>
                                        }
                                        </h4>
                                        <div className='text-center'>
                                            {orden.estado === 'PENDIENTE' && <button className='btn btn-danger border-3d' onClick={() => handleCancelar(orden.idOrdenCompra)}>CANCELAR</button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdenesDeCompraUsuario;