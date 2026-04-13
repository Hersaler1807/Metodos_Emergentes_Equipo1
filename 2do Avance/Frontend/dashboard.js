document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    //                  RECUPERACION DE DATOS
    // ---------------------------------------------------------
    const nombre = localStorage.getItem('usuarioNombre');
    const rol = localStorage.getItem('usuarioRol');
    const area = localStorage.getItem('usuarioArea');

    // ---------------------------------------------------------
    //                  ELEMENTOS DEL HTML
    // ---------------------------------------------------------
    const welcomeName = document.getElementById('welcome-name');
    const welcomeDetail = document.getElementById('welcome-detail');
    const footerName = document.getElementById('footer-name');
    const footerRole = document.getElementById('footer-role');
    const menu = document.getElementById('menu-links');
    const statusContainer = document.getElementById('status-container');
    const bottomTitle = document.getElementById('bottom-title');
    const btnLogout = document.getElementById('btn-logout');



    // Seguridad: Si no hay nombre, al login
    if (!nombre) {
        window.location.href = 'index.html';
        return;
    }

    // Llenar datos básicos
    welcomeName.innerText = nombre;
    footerName.innerText = nombre;

    // 3. Lógica por ROL
    if (rol === 'admin') {
        welcomeDetail.innerText = " | Administrador";
        footerRole.innerText = "Admin";
        
        // Menú Administrador
        menu.innerHTML = `
            <li id="btn-menu-inicio" class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio Admin</li>
            <li id="btn-menu-usuarios"><img src="assets/iconos/IconoUsuario.png" class="menu-icon"> Gestión Usuarios</li>
            <li id="btn-menu-total"><img src="assets/iconos/TotalPanel.png" class="menu-icon"> Todos los Reportes</li>
        `;
        
        // Tarjetas Admin (Puede ver lo mismo que el técnico en inicio)
        statusContainer.innerHTML = `
            <div class="card"><img src="assets/iconos/TotalPanel.png" class="stat-icon"><h3>Total de reportes</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/EnProceso.png" class="stat-icon"><h3>En proceso</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/Pendientes.png" class="stat-icon"><h3>Pendientes</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/Resueltos.png" class="stat-icon"><h3>Resueltos</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Reportes recientes";

    } else if (rol === 'tecnico') {
        welcomeDetail.innerText = " | Técnico";
        footerRole.innerText = "Técnico";

        // Menú Técnico
        menu.innerHTML = `
            <li id="btn-menu-inicio" class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio Técnico</li>
            <li id="btn-menu-total"><img src="assets/iconos/TotalPanel.png" class="menu-icon"> Total de reportes</li>
            <li id="btn-menu-proceso"><img src="assets/iconos/EnProcesoPanel.png" class="menu-icon"> En proceso</li>
            <li id="btn-menu-pendientes"><img src="assets/iconos/PendientesPanel.png" class="menu-icon"> Pendientes</li>
            <li id="btn-menu-resueltos"><img src="assets/iconos/ResueltosPanel.png" class="menu-icon"> Resueltos</li>
        `;

        // Tarjetas Técnico
        statusContainer.innerHTML = `
            <div class="card"><img src="assets/iconos/Total.png" class="stat-icon"><h3>Total de reportes</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/EnProceso.png" class="stat-icon"><h3>En proceso</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/Pendientes.png" class="stat-icon"><h3>Pendientes</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/Resueltos.png" class="stat-icon"><h3>Resueltos</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Reportes recientes";

    } else {
        let areaFormateada = "Departamento"; 
        if (area && area !== "null" && area !== "undefined") {
            areaFormateada = area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        welcomeDetail.innerText = ` | ${areaFormateada}`;
        footerRole.innerText = areaFormateada;

        // Menú Usuario
        menu.innerHTML = `
            <li id="btn-menu-inicio" class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio</li>
            <li id="btn-menu-crear"><img src="assets/iconos/CrearReporte.png" class="menu-icon"> Crear reporte</li>
            <li id="btn-menu-mis-reportes"><img src="assets/iconos/MisReportes.png" class="menu-icon"> Mis reportes</li>
            <li><img src="assets/iconos/NuestrosTecnicos.png" class="menu-icon"> Nuestros técnicos</li>
        `;

        // Tarjetas Usuario
        statusContainer.innerHTML = `
            <div class="card-u"><h3>Pendientes</h3><p>0</p></div>
            <div class="card-u"><h3>En proceso</h3><p>0</p></div>
            <div class="card-u"><h3>Finalizado</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Próximos mantenimientos";
    }

    // Botón cerrar sesión
    if (btnLogout) {
        btnLogout.innerHTML = `<img src="assets/iconos/CerrarSesion.png" class="menu-icon"> Cerrar Sesión`;
        btnLogout.onclick = () => {
            localStorage.clear();
            window.location.href = 'index.html';
        };
    }

    // ---------------------------------------------------------
    //                  LÓGICA DE NAVEGACIÓN
    // ---------------------------------------------------------
    
    // 1. Atrapar todas las vistas y el contenedor de la tabla
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaCrearReporte = document.getElementById('vista-crear-reporte');
    const vistaMisReportes = document.getElementById('vista-mis-reportes');
    const vistaGestionReportes = document.getElementById('vista-gestion-reportes'); // <-- ¡YA AGREGAMOS LA VISTA DEL TÉCNICO!
    const vistaAdminUsuarios = document.getElementById('vista-admin-usuarios');
    const tablaBody = document.getElementById('tabla-mis-reportes-body');
    
    // Función para ocultar todo y mostrar solo lo que necesitamos
    function mostrarVista(vistaAMostrar, botonActivo) {
        // Ocultar absolutamente todas las vistas
        if (vistaInicio) vistaInicio.style.display = 'none';
        if (vistaCrearReporte) vistaCrearReporte.style.display = 'none';
        if (vistaMisReportes) vistaMisReportes.style.display = 'none';
        if (vistaGestionReportes) vistaGestionReportes.style.display = 'none'; 
        if (vistaAdminUsuarios) vistaAdminUsuarios.style.display = 'none';
        
        // Quitar la clase "active" de todos los botones del menú
        const todosLosBotones = document.querySelectorAll('#menu-links li');
        todosLosBotones.forEach(btn => btn.classList.remove('active'));
        
        // Mostrar la vista que nos pidieron
        if (vistaAMostrar) vistaAMostrar.style.display = 'block';
        
        // Ponerle el fondo gris (active) al botón que se presionó
        if (botonActivo) {
            botonActivo.classList.add('active');
        }
    }

    // 2. Darle órdenes a los botones del menú (Solo si existen)
    const btnInicio = document.getElementById('btn-menu-inicio');
    const btnCrear = document.getElementById('btn-menu-crear');
    const btnMisReportes = document.getElementById('btn-menu-mis-reportes');
    const btnMenuTotal = document.getElementById('btn-menu-total'); 

    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            mostrarVista(vistaInicio, btnInicio);
            cargarEstadisticasInicio(); 
        });
    }

    if (btnCrear) {
        btnCrear.addEventListener('click', () => mostrarVista(vistaCrearReporte, btnCrear));
    }

    if (btnMisReportes) {
        btnMisReportes.addEventListener('click', () => {
            mostrarVista(vistaMisReportes, btnMisReportes);
            cargarMisReportes();
        });
    }

    // Al hacer clic en Total de Reportes (Menú del Técnico)
    if (btnMenuTotal) {
        btnMenuTotal.addEventListener('click', () => {
            mostrarVista(vistaGestionReportes, btnMenuTotal);
            cargarTodosLosReportes();
        });
    }


    // ---------------------------------------------------------
    //   FUNCIÓN: CARGAR MIS REPORTES DESDE LA BASE DE DATOS
    // ---------------------------------------------------------
    async function cargarMisReportes() {
        // Obtener el ID del usuario de la memoria
        const usuarioId = localStorage.getItem('usuarioId');
        
        if (!usuarioId) {
            alert("Error: No se encontró tu sesión. Por favor cierra sesión y vuelve a entrar.");
            return;
        }

        // Limpiar la tabla y mostrar mensaje de carga
        tablaBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando tus reportes...</td></tr>';

        try {
            // Pedir los reportes a Python usando el ID del usuario
            const respuesta = await fetch(`http://localhost:5000/reports/mis_reportes/${usuarioId}`);
            const resultado = await respuesta.json();

            // ¿Qué pasa si sale bien o mal?
            if (respuesta.ok) {
                const reportes = resultado.reportes;

                // Si no hay reportes, mostrar mensaje amigable
                if (reportes.length === 0) {
                    tablaBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No tienes reportes registrados. ¡Usa el botón "Crear reportes" para empezar!</td></tr>';
                    return;
                }

                // Si hay reportes, limpiar y empezar a dibujar filas
                tablaBody.innerHTML = '';

                reportes.forEach(reporte => {
                    // Crear una fila 
                    const fila = document.createElement('tr');

                    // Definir el color de la etiqueta de estado
                    let claseEstado = 'estado-pendiente';
                    if (reporte.estado === 'en_proceso') claseEstado = 'estado-en_proceso';
                    if (reporte.estado === 'resuelto') claseEstado = 'estado-resuelto';

                    // Llenar la fila con las celdas (td)
                    fila.innerHTML = `
                        <td>T-${String(reporte.id).padStart(3, '0')}</td> <td>${reporte.fecha_formateada}</td>
                        <td>${reporte.asunto}</td>
                        <td style="text-transform: capitalize;">${reporte.categoria.replace('_', ' ')}</td>
                        <td><span class="badge-estado ${claseEstado}">${reporte.estado.replace('_', ' ')}</span></td>
                    `;

                    // Agregar la fila al cuerpo de la tabla
                    tablaBody.appendChild(fila);
                });

            } else {
                tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">❌ Error: ${resultado.error}</td></tr>`;
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            tablaBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">❌ Ocurrió un error al conectar con el servidor.</td></tr>';
        }
    }

    // ---------------------------------------------------------
    //                  ENVIAR NUEVO REPORTE
    // ---------------------------------------------------------
    const formNuevoReporte = document.getElementById('formNuevoReporte');
    
    if (formNuevoReporte) {
        formNuevoReporte.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página parpadee o se recargue al enviar
            
            // Recolectar datos
            const asunto = document.getElementById('repAsunto').value;
            const equipo_id = document.getElementById('repEquipo').value;
            const categoria = document.getElementById('repCategoria').value;
            const prioridad = document.getElementById('repPrioridad').value;
            const descripcion = document.getElementById('repDescripcion').value;
            
            // Obtener el ID del usuario de la memoria
            const usuario_id = localStorage.getItem('usuarioId'); 
            
            // Validación de seguridad
            if (!usuario_id) {
                alert("Error: No se encontró tu sesión. Por favor cierra sesión y vuelve a entrar.");
                return;
            }

            // Empaquetar los datos para Python
            const datosReporte = {
                usuario_id: usuario_id,
                asunto: asunto,
                equipo_id: equipo_id,
                categoria: categoria,
                prioridad: prioridad,
                descripcion: descripcion,
                evidencia: null 
            };

            try {
                // Recuperamos la pulsera de seguridad de la memoria
            const token = localStorage.getItem('token');
            
            // Envia el paquete a nuestra nueva ruta en Python
            const respuesta = await fetch('http://localhost:5000/reports/crear_reporte', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(datosReporte)
            });

                const resultado = await respuesta.json();

                // ¿Qué pasa si sale bien o mal?
                if (respuesta.ok) {
                    alert("✅ " + resultado.mensaje + " (Folio asignado: " + resultado.reporte_id + ")");
                    
                    formNuevoReporte.reset(); 
                    mostrarVista(vistaInicio, btnInicio); 
                    
                } else {
                    alert("❌ Error: " + resultado.error);
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("❌ Ocurrió un error al intentar enviar el reporte al servidor.");
            }
        });
    }

    // ---------------------------------------------------------
    // CARGAR ESTADÍSTICAS EN LA PANTALLA DE INICIO (CON ÍCONOS)
    // ---------------------------------------------------------
    async function cargarEstadisticasInicio() {
        const usuarioId = localStorage.getItem('usuarioId');
        const rol = localStorage.getItem('usuarioRol');
        const statusContainer = document.getElementById('status-container');
        
        if (!usuarioId || !statusContainer) return;

        try {
            // SI ES TÉCNICO: 4 Tarjetas
            if (rol === 'tecnico') {
                const respuesta = await fetch(`http://localhost:5000/reports/estadisticas_globales`);
                if (respuesta.ok) {
                    const stats = await respuesta.json();
                    
                    statusContainer.innerHTML = `
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/Total.png" alt="Total" style="width: 40px; margin-bottom: 15px;">
                            <h3>Total de reportes</h3>
                            <p class="status-number" style="color: #333;">${stats.total}</p>
                        </div>
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/EnProceso.png" alt="Proceso" style="width: 40px; margin-bottom: 15px;">
                            <h3>En proceso</h3>
                            <p class="status-number" style="color: #1D4ED8;">${stats.en_proceso}</p>
                        </div>
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/Pendientes.png" alt="Pendientes" style="width: 40px; margin-bottom: 15px;">
                            <h3>Pendientes</h3>
                            <p class="status-number" style="color: #D97706;">${stats.pendiente}</p>
                        </div>
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/Resueltos.png" alt="Resueltos" style="width: 40px; margin-bottom: 15px;">
                            <h3>Resueltos</h3>
                            <p class="status-number" style="color: #15803D;">${stats.resuelto}</p>
                        </div>
                    `;
                    statusContainer.style.gridTemplateColumns = "repeat(4, 1fr)";

                    cargarReportesRecientes();
                }
            } 
            // SI ES USUARIO BÁSICO: 3 Tarjetas
            else {
                const respuesta = await fetch(`http://localhost:5000/reports/estadisticas/${usuarioId}`);
                if (respuesta.ok) {
                    const stats = await respuesta.json();
                    
                    statusContainer.innerHTML = `
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/Pendientes.png" alt="Pendientes" style="width: 40px; margin-bottom: 15px;">
                            <h3>Pendientes</h3>
                            <p class="status-number" style="color: #D97706;">${stats.pendiente}</p>
                        </div>
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/EnProceso.png" alt="Proceso" style="width: 40px; margin-bottom: 15px;">
                            <h3>En Proceso</h3>
                            <p class="status-number" style="color: #1D4ED8;">${stats.en_proceso}</p>
                        </div>
                        <div class="status-card" style="text-align: left;">
                            <img src="assets/iconos/Resueltos.png" alt="Resueltos" style="width: 40px; margin-bottom: 15px;">
                            <h3>Resueltos</h3>
                            <p class="status-number" style="color: #15803D;">${stats.resuelto}</p>
                        </div>
                    `;
                    statusContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
                }
            }
        } catch (error) {
            console.error("Error al cargar las estadísticas:", error);
        }
    }
    // Ejecutamos la función inmediatamente al cargar la página
    cargarEstadisticasInicio();

    // ---------------------------------------------------------
    // VISTA DEL TÉCNICO: CARGAR TODOS LOS REPORTES
    // ---------------------------------------------------------
    const tablaGestionBody = document.getElementById('tabla-gestion-body');

    // Función para pedir los datos a Python y dibujar la tabla
    // Le ponemos 'todos' por defecto por si no le enviamos ningún filtro
    async function cargarTodosLosReportes(filtro = 'todos') {
        if (!tablaGestionBody) return;
        
        tablaGestionBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando reportes del sistema...</td></tr>';

        try {
            const respuesta = await fetch('http://localhost:5000/reports/todos_los_reportes');
            const resultado = await respuesta.json();

            if (respuesta.ok) {
                const reportes = resultado.reportes;

                // Creamos una nueva lista solo con los que coincidan con el botón
                const reportesFiltrados = reportes.filter(reporte => {
                    if (filtro === 'todos') return true; // Si pidió todos, pasan todos
                    return reporte.estado === filtro;    // Si no, solo pasa si el estado coincide
                });

                if (reportesFiltrados.length === 0) {
                    tablaGestionBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay ningún reporte en esta categoría.</td></tr>';
                    return;
                }

                tablaGestionBody.innerHTML = ''; // Limpiamos la tabla

                // Dibujamos cada fila usando la lista ya filtrada
                reportesFiltrados.forEach(reporte => {
                    const fila = document.createElement('tr');

                    let claseEstado = 'estado-pendiente';
                    if (reporte.estado === 'en_proceso') claseEstado = 'estado-en_proceso';
                    if (reporte.estado === 'resuelto') claseEstado = 'estado-resuelto';

                    fila.innerHTML = `
                        <td>T-${String(reporte.id).padStart(3, '0')}</td>
                        <td><strong>${reporte.asunto}</strong><br><small>Por: ${reporte.nombre_usuario}</small></td>
                        <td>${reporte.equipo_id}</td>
                        <td style="text-transform: capitalize;">${reporte.prioridad}</td>
                        <td><span class="badge-estado ${claseEstado}">${reporte.estado.replace('_', ' ')}</span></td>
                        <td>
                            <button class="btn-main" style="padding: 5px 10px; font-size: 0.8rem;" onclick="atenderReporte(${reporte.id})">Atender</button>
                        </td>
                    `;
                    tablaGestionBody.appendChild(fila);
                });
            } else {
                tablaGestionBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error: ${resultado.error}</td></tr>`;
            }
        } catch (error) {
            console.error("Error al cargar todos los reportes:", error);
            tablaGestionBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Ocurrió un error de conexión con el servidor.</td></tr>';
        }
    }

    // ---------------------------------------------------------
    // LÓGICA DE LOS BOTONES DEL MENÚ LATERAL (TÉCNICO)
    // ---------------------------------------------------------
    const btnMenuProceso = document.getElementById('btn-menu-proceso');
    const btnMenuPendientes = document.getElementById('btn-menu-pendientes');
    const btnMenuResueltos = document.getElementById('btn-menu-resueltos');

    // Botón: Total de reportes 
    if (btnMenuTotal) {
        btnMenuTotal.addEventListener('click', () => {
            mostrarVista(vistaGestionReportes, btnMenuTotal);
            cargarTodosLosReportes('todos'); 
        });
    }

    // Botón: En Proceso 
    if (btnMenuProceso) {
        btnMenuProceso.addEventListener('click', () => {
            mostrarVista(vistaGestionReportes, btnMenuProceso);
            cargarTodosLosReportes('en_proceso'); 
        });
    }

    // Botón: Pendientes 
    if (btnMenuPendientes) {
        btnMenuPendientes.addEventListener('click', () => {
            mostrarVista(vistaGestionReportes, btnMenuPendientes);
            cargarTodosLosReportes('pendiente'); 
        });
    }

    // Botón: Resueltos 
    if (btnMenuResueltos) {
        btnMenuResueltos.addEventListener('click', () => {
            mostrarVista(vistaGestionReportes, btnMenuResueltos);
            cargarTodosLosReportes('resuelto'); 
        });
    }

    // ---------------------------------------------------------
    // LÓGICA DEL MODAL PARA ATENDER REPORTES (TÉCNICO)
    // ---------------------------------------------------------
    const modalEstado = document.getElementById('modal-estado');
    const btnCancelarEstado = document.getElementById('btn-cancelar-estado');
    const btnGuardarEstado = document.getElementById('btn-guardar-estado');
    const modalReporteId = document.getElementById('modal-reporte-id');
    const modalFolioText = document.getElementById('modal-folio-text');
    const modalNuevoEstado = document.getElementById('modal-nuevo-estado');

    // Función para abrir la ventanita
    window.atenderReporte = function(id) {
        // Guardamos el ID secreto en el input oculto
        modalReporteId.value = id;
        // Ponemos el folio bonito en el título
        modalFolioText.innerText = `T-${String(id).padStart(3, '0')}`;
        // Mostramos el modal oscuro
        modalEstado.style.display = 'flex';
    };

    // 2. Función para cerrar la ventanita si se arrepiente
    if (btnCancelarEstado) {
        btnCancelarEstado.addEventListener('click', () => {
            modalEstado.style.display = 'none';
        });
    }

    // 3. Función para enviar el nuevo estado a Python
    if (btnGuardarEstado) {
        btnGuardarEstado.addEventListener('click', async () => {
            const id = modalReporteId.value;
            const nuevoEstado = modalNuevoEstado.value;

            // Cambiamos el texto del botón temporalmente
            btnGuardarEstado.innerText = "Guardando...";
            btnGuardarEstado.disabled = true;

            try {
                // Hacemos la petición PUT a la nueva ruta de Python
                const respuesta = await fetch(`http://localhost:5000/reports/actualizar_estado/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: nuevoEstado })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    alert("✅ " + resultado.mensaje);
                    modalEstado.style.display = 'none'; // Cerramos el modal
                    
                    cargarTodosLosReportes();
                    cargarEstadisticasInicio(); 

                } else {
                    alert("❌ Error: " + resultado.error);
                }

            } catch (error) {
                console.error("Error al actualizar:", error);
                alert("❌ Ocurrió un error de conexión.");
            } finally {
                btnGuardarEstado.innerText = "Guardar Cambios";
                btnGuardarEstado.disabled = false;
            }
        });
    }

    // ---------------------------------------------------------
    // CARGAR LOS ÚLTIMOS 5 REPORTES EN EL INICIO (TÉCNICO)
    // ---------------------------------------------------------
    async function cargarReportesRecientes() {
        const bottomList = document.getElementById('bottom-list');
        const bottomTitle = document.getElementById('bottom-title');
        
        if (!bottomList) return;

        // Cambiamos el título
        if(bottomTitle) bottomTitle.innerText = "Reportes recientes";
        bottomList.innerHTML = '<p style="padding: 20px;">Cargando últimos reportes...</p>';

        try {
            // Reutilizamos tu ruta de Python que ya trae todo ordenado
            const respuesta = await fetch('http://localhost:5000/reports/todos_los_reportes');
            const resultado = await respuesta.json();

            if (respuesta.ok) {
                const reportes = resultado.reportes;

                if (reportes.length === 0) {
                    bottomList.innerHTML = '<p style="padding: 20px; color: #666;">No hay reportes recientes registrados.</p>';
                    return;
                }

                // Tomamos únicamente los primeros 3 de la lista
                const ultimosReportes = reportes.slice(0, 3);
                
                bottomList.innerHTML = ''; // Limpiamos el contenedor

                // Dibujamos cada uno de los 3 reportes
                ultimosReportes.forEach(reporte => {
                    let colorEstado = '#D97706'; // Naranja/Ambar para pendiente
                    if (reporte.estado === 'en_proceso') colorEstado = '#1D4ED8'; // Azul
                    if (reporte.estado === 'resuelto') colorEstado = '#15803D'; // Verde

                    const item = document.createElement('div');
                    item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #eee;";
                    
                    item.innerHTML = `
                        <div>
                            <strong style="font-size: 1.1rem; color: #333;">T-${String(reporte.id).padStart(3, '0')} - ${reporte.asunto}</strong><br>
                            <small style="color: #666;">Reportado por: <strong>${reporte.nombre_usuario}</strong> | Equipo: ${reporte.equipo_id}</small>
                        </div>
                        <div>
                            <span style="background-color: ${colorEstado}; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; text-transform: capitalize;">
                                ${reporte.estado.replace('_', ' ')}
                            </span>
                        </div>
                    `;
                    bottomList.appendChild(item);
                });

            }
        } catch (error) {
            console.error("Error al cargar reportes recientes:", error);
            bottomList.innerHTML = '<p style="padding: 20px; color: red;">Error al conectar con el servidor.</p>';
        }
    }

    // =========================================================
    // LÓGICA DEL ADMINISTRADOR (GESTIÓN DE USUARIOS)
    // =========================================================
    const btnMenuUsuarios = document.getElementById('btn-menu-usuarios');
    const tablaUsuariosBody = document.getElementById('tabla-usuarios-body');
    
    // Elementos del Modal de Editar Usuario
    const modalEditarUsuario = document.getElementById('modal-editar-usuario');
    const modalUserId = document.getElementById('modal-user-id');
    const modalUserNombre = document.getElementById('modal-user-nombre');
    const modalUserRol = document.getElementById('modal-user-rol');
    const modalUserPassword = document.getElementById('modal-user-password');
    const btnCancelarUsuario = document.getElementById('btn-cancelar-usuario');
    const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');

    // Mostrar la pantalla y cargar los datos
    if (btnMenuUsuarios) {
        btnMenuUsuarios.addEventListener('click', () => {
            mostrarVista(vistaAdminUsuarios, btnMenuUsuarios);
            cargarTodosLosUsuarios();
        });
    }

    // Función para pedir los usuarios a Python
    async function cargarTodosLosUsuarios() {
        if (!tablaUsuariosBody) return;
        tablaUsuariosBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando usuarios...</td></tr>';

        try {
            // Recuperamos la pulsera de la memoria
            const token = localStorage.getItem('token');

            // Hacemos la petición enseñando la pulsera en el Header
            const respuesta = await fetch('http://localhost:5000/admin/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const resultado = await respuesta.json();

            if (respuesta.ok) {
                tablaUsuariosBody.innerHTML = '';
                resultado.usuarios.forEach(user => {
                    const fila = document.createElement('tr');
                    
                    // Colores para los roles
                    let colorRol = '#666'; // Básico
                    if (user.rol === 'tecnico') colorRol = '#1D4ED8'; // Azul
                    if (user.rol === 'admin') colorRol = '#B91C1C'; // Rojo
                    
                    fila.innerHTML = `
                        <td>${user.id}</td>
                        <td><strong>${user.nombre_usuario}</strong></td>
                        <td>${user.correo}</td>
                        <td><span style="background-color: ${colorRol}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; text-transform: capitalize;">${user.rol.replace('_', ' ')}</span></td>
                        <td>
                            <button class="btn-secondary" style="padding: 5px; font-size: 0.8rem; margin-right: 5px;" onclick="abrirModalUsuario(${user.id}, '${user.nombre_usuario}', '${user.rol}')">Editar</button>
                            <button class="btn-main" style="padding: 5px; font-size: 0.8rem; background-color: #DC2626;" onclick="eliminarUsuario(${user.id}, '${user.nombre_usuario}')">Eliminar</button>
                        </td>
                    `;
                    tablaUsuariosBody.appendChild(fila);
                });
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            tablaUsuariosBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error de conexión.</td></tr>';
        }
    }

    // 3. Función para ABRIR la ventanita de edición
    window.abrirModalUsuario = function(id, nombre, rolActual) {
        modalUserId.value = id;
        modalUserNombre.innerText = nombre;
        modalUserRol.value = rolActual;
        modalUserPassword.value = ''; 
        modalEditarUsuario.style.display = 'flex';
    };

    // Cerrar ventanita
    if (btnCancelarUsuario) {
        btnCancelarUsuario.addEventListener('click', () => {
            modalEditarUsuario.style.display = 'none';
        });
    }

    // 4. GUARDAR los cambios del usuario
    if (btnGuardarUsuario) {
        btnGuardarUsuario.addEventListener('click', async () => {
            const id = modalUserId.value;
            const nuevoRol = modalUserRol.value;
            const nuevaPass = modalUserPassword.value;

            btnGuardarUsuario.innerText = "Guardando...";
            
            try {
               const token = localStorage.getItem('token');
                
                const respuesta = await fetch(`http://localhost:5000/admin/usuarios/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ rol: nuevoRol, password: nuevaPass })
                });

                if (respuesta.ok) {
                    alert("✅ Usuario actualizado correctamente.");
                    modalEditarUsuario.style.display = 'none';
                    cargarTodosLosUsuarios(); 
                } else {
                    alert("❌ Error al actualizar.");
                }
            } catch (error) {
                console.error(error);
            } finally {
                btnGuardarUsuario.innerText = "Guardar Cambios";
            }
        });
    }

    // ELIMINAR un usuario
    window.eliminarUsuario = async function(id, nombre) {
        const confirmar = confirm(`⚠️ ¿Estás COMPLETAMENTE SEGURO de eliminar al usuario "${nombre}"? Esta acción no se puede deshacer y borrará todos sus reportes asociados.`);
        
        if (confirmar) {
            try {
                const token = localStorage.getItem('token');
                
                const respuesta = await fetch(`http://localhost:5000/admin/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (respuesta.ok) {
                    alert("🗑️ Usuario eliminado.");
                    cargarTodosLosUsuarios();
                } else {
                    alert("❌ Error al eliminar.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
});
