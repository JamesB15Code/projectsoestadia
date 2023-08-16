import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function OrdenesDeCompraAdministrador() {
    const [ordenesCompra, setOrdenesCompra] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('TODAS LAS ORDENES');
    const [fechaBusqueda, setFechaBusqueda] = useState('');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    useEffect(() => {
        obtenerTodasLasOrdenesCompra();
    }, []);

    const obtenerTodasLasOrdenesCompra = async () => {
        try {
            const response = await fetch('https://mginnovaviones.website/proyectoApi/detallesDeCompra.php');
            const data = await response.json();
            setOrdenesCompra(data);
        } catch (error) {
            console.error("Error al obtener las órdenes de compra:", error);
        }
    };

    const handleCambiarEstado = async (idOrdenCompra, nuevoEstado) => {
        const confirmarCambioEstado = await Swal.fire({
            title: `¿Estás seguro de registrar como "${nuevoEstado}"?`,
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

                    const response = await fetch(`https://mginnovaviones.website/proyectoApi/apiProducto.php?idProducto=${orden.idProducto}`);
                    const producto = await response.json();
                    const existenciaActual = producto.existencia;
                    const existencia = existenciaActual - orden.total;
                    
                const updateResponse = await fetch(`https://mginnovaviones.website/proyectoApi/addExistencia.php?idProducto=${orden.idProducto}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ existencia: existencia }),
                    });

                    if (!updateResponse.ok) {
                        console.log('Error al actualizar la existencia del producto.');
                        return;
                    }
                }

                const response = await fetch(`https://mginnovaviones.website/proyectoApi/detallesDeCompra.php?idOrdenCompra=${idOrdenCompra}`, {
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
      
    const estadosOrden = ['TODAS LAS ORDENES', 'ENVIADO', 'NO ENVIADO', 'CANCELADO', 'PENDIENTE'];

    const filtrarOrdenesPorTermino = () => {
        if (!terminoBusqueda) {
          return filtrarOrdenesPorEstado();
        } else {
          // Filtrar por el término de búsqueda en algunas propiedades relevantes
          return filtrarOrdenesPorEstado().filter((orden) =>
            orden.marca.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            orden.modelo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            orden.nombre_usuario.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            orden.correo.toLowerCase().includes(terminoBusqueda.toLowerCase()) 
          );
        }
    };

    const filtrarOrdenesPorEstado = () => {
        const ordenesFiltradasPorEstado = filtroEstado === 'TODAS LAS ORDENES' ? ordenesCompra : ordenesCompra.filter((orden) => orden.estado === filtroEstado);
      
        if (fechaBusqueda === '') {
          return ordenesFiltradasPorEstado;
        } else {
          // Filtrar por la fecha seleccionada
          return ordenesFiltradasPorEstado.filter((orden) => orden.fecha_orden === fechaBusqueda);
        }
    };      

    const ordenarPorFechaYHora = (ordenes) => {
        // Compara dos fechas y horas en formato "YYYY-MM-DD HH:mm"
        const compararFechas = (fechaHoraA, fechaHoraB) => {
            return new Date(fechaHoraB) - new Date(fechaHoraA);
        };
    
        // Ordena las órdenes por fecha y hora
        return ordenes.sort((a, b) => compararFechas(`${a.fecha_orden} ${a.hora_orden}`, `${b.fecha_orden} ${b.hora_orden}`));
    };

    const handleFechaBusqueda = (e) => {
        setFechaBusqueda(e.target.value);
    };

    const handleTerminoBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
    };
    

    return (
        <div className='container mt-3'>
            <div className='row mt-3 mb-5'>
                <div className='mt-5 text-center'>
                    <h2 className='text-center'>Órdenes de Compra</h2>
                </div>

                <div className="mb-3 text-center d-flex ">
                    <label className="form-label fs-5 ms-4 me-2">Filtrar por estado:</label>
                    <select
                        className="form-select form-select-sm "
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        style={{ width: '180px'  }}
                    >
                        {estadosOrden.map((estado) => (
                        <option key={estado} value={estado}>
                            {estado}
                        </option>
                        ))}
                    </select>
                    <label className="form-label ms-4 me-2 fs-5 ">Filtrar por fecha:</label>
                    <div className="input-group input-group-sm w-50 mx-auto">
                        <input
                        type="date"
                        className="form-control text-center"
                        value={fechaBusqueda}
                        onChange={handleFechaBusqueda}
                        />
                    </div>
                </div>
                <div className="mb-3 text-center">
                    <label className="form-label fs-5">Buscar por término:</label>
                    <div className="input-group input-group-sm w-50 mx-auto">
                        <input
                        type="text"
                        placeholder='Buscador'
                        className="form-control form-control-sm text-center"
                        value={terminoBusqueda}
                        onChange={handleTerminoBusqueda}
                    />
                    </div>
                    
                </div>

                <div className="row g-4 mt-1">
                    {filtrarOrdenesPorTermino().length === 0 ? (
                        <h1 className='text-center text-dark fs-5 ms-4'>No hay órdenes de compra registradas con el estado seleccionado.</h1>
                    ) : (
                        ordenarPorFechaYHora(filtrarOrdenesPorTermino()).map((orden, i) => (
                            <div key={orden.idOrdenCompra} className="col-md-4">
                                <div className="card h-100 ">
                                    <div className="card-body ">
                                        <h1 className="text-dark fs-3 text-center ">Pedido de {orden.marca} </h1>
                                        <h2 className="text-dark fs-3 text-center ms-4">{orden.modelo} </h2>
                                        <h4 className="text-dark fs-5 ms-4">Nombre: {orden.nombre_usuario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Cantidad: {orden.total}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Precio unitario:  ${orden.precio_unitario}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Total a pagar:  ${orden.precio_total_producto}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Correo: {orden.correo}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Fecha: {orden.fecha_orden}</h4>
                                        <h4 className="text-dark fs-5 ms-4">Hora: {orden.hora_orden}</h4>
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