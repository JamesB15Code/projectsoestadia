import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function OrdenesDeCompraAdministrador() {
    const [ordenesCompra, setOrdenesCompra] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('TODAS LAS ORDENES');

    useEffect(() => {
        obtenerTodasLasOrdenesCompra();
    }, []);

    const obtenerTodasLasOrdenesCompra = async () => {
        try {
            const response = await fetch('http://localhost/proyectoApi/detallesDeCompra.php');
            const data = await response.json();
            setOrdenesCompra(data);
        } catch (error) {
            console.error("Error al obtener las órdenes de compra:", error);
        }
    };

    const handleCambiarEstado = async (idOrdenCompra, nuevoEstado) => {
        const confirmarCambioEstado = await Swal.fire({
            title: `¿Estás seguro de realizar el "${nuevoEstado}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'success',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        });
    
        if (confirmarCambioEstado.isConfirmed) {
            try {
                if (nuevoEstado === 'ENVIADO') {
                    const orden = filtrarOrdenesPorEstado().find((orden) => orden.idOrdenCompra === idOrdenCompra);
                    if (!orden) {
                        console.log('No se encontró la orden de compra asociada al ID proporcionado.');
                        return;
                    }
                
                    
                    const response = await fetch(`http://localhost/proyectoApi/apiProducto.php?idProducto=${orden.idProducto}`);
                    const producto = await response.json();
                    const existenciaActual = producto.existencia;
                    const existenciaRestante = existenciaActual - orden.total;
    
                    const updateResponse = await fetch(`http://localhost/proyectoApi/apiProducto.php?idProducto=${orden.idProducto}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ existencia: existenciaRestante }),
                    });
    
                    if (!updateResponse.ok) {
                        console.error("Error al actualizar la existencia del producto.");
                        return;
                    }
                }
    
                const response = await fetch(`http://localhost/proyectoApi/detallesDeCompra.php?idOrdenCompra=${idOrdenCompra}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
    
                if (response.ok) {
                    obtenerTodasLasOrdenesCompra();
                } else {
                    console.log('Error al cambiar el estado de la orden.');
                }
            } catch (error) {
                console.error("Error al cambiar el estado de la orden:", error);
            }
        }
    };
    

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate();
        const mes = fechaObj.getMonth() + 1;
        const año = fechaObj.getFullYear();
        return `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    };

    const estadosOrden = ['TODAS LAS ORDENES', 'ENVIADO', 'NO ENVIADO', 'CANCELADO', 'PENDIENTE'];

    const filtrarOrdenesPorEstado = () => {
        if (filtroEstado === 'TODAS LAS ORDENES') {
            return ordenesCompra;
        } else {
            return ordenesCompra.filter((orden) => orden.estado === filtroEstado);
        }
    };

    return (
        <div className='container mt-3'>
            <div className='row mt-3 mb-5'>
                <div className='mt-5 text-center'>
                    <h2 className='text-center'>Todas las Órdenes de Compra</h2>
                </div>

                <div className='mb-1 text-center'>
                    <label className='form-label fs-5 ms-4'>Filtrar por estado:</label>
                    <select className='form-select ' value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        {estadosOrden.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>

                <div className="row g-4 mt-1">
                    {filtrarOrdenesPorEstado().length === 0 ? (
                        <h1 className='text-center text-dark fs-5 ms-4'>No hay órdenes de compra registradas con el estado seleccionado.</h1>
                    ) : (
                        filtrarOrdenesPorEstado().map((orden, i) => (
                            <div key={orden.idOrdenCompra} className="col-md-4">
                                <div className="card h-100 ">
                                    <div className="card-body">
                                        <h1 className="text-dark fs-3 text-center "> {i + 1}. Pedido de {orden.total} {orden.marca} </h1>
                                        <h2 className="text-dark fs-3 text-center ms-4">{orden.modelo} </h2>
                                        <h4 className="text-dark fs-5 ms-4">Id: {orden.idUsuario}, nombre {orden.nombre_usuario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Precio unitario:  ${orden.precio_unitario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Total a pagar  {orden.total}:  ${orden.precio_total_producto}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Correo: {orden.correo}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Fecha: {formatearFecha(orden.fecha_orden)}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Estado:
                                            {orden.estado === 'CANCELADO' || orden.estado === 'NO ENVIADO' ?
                                                <span className='text-danger'> { orden.estado}</span>
                                            : orden.estado === 'PENDIENTE' ?
                                                <span className='text-primary'> { orden.estado}</span>
                                            :
                                                <span className='text-success'> { orden.estado}</span>
                                            }
                                        </h4>
                                        <div className='text-center'>
                                            {orden.estado === 'PENDIENTE' && (
                                                <>
                                                    <button className='btn btn-success  me-2' onClick={() => handleCambiarEstado(orden.idOrdenCompra, 'ENVIADO')}>ENVIAR</button>
                                                    <button className='btn btn-danger ' onClick={() => handleCambiarEstado(orden.idOrdenCompra, 'NO ENVIADO')}>NO ENVIAR</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrdenesDeCompraAdministrador;