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
    // const footerName = document.getElementById('footer-name');
    // const footerRole = document.getElementById('footer-role');
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
    // footerName.innerText = nombre;

    // ---------------------------------------------------------
    // NUEVO: CARGAR AVATAR E INICIALES EN EL SIDEBAR
    // ---------------------------------------------------------
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName && sidebarRole) {
        sidebarName.innerText = nombre;
        // Le quitamos guiones bajos al rol por si acaso y lo ponemos bonito
        sidebarRole.innerText = rol ? rol.replace('_', ' ') : 'Rol desconocido'; 
    }

    if (sidebarAvatar && nombre) {
        const fotoGuardada = localStorage.getItem('usuarioFoto');
        
        // Si hay una foto real en memoria, la usamos
        if (fotoGuardada && fotoGuardada !== 'null' && fotoGuardada !== '') {
            sidebarAvatar.src = fotoGuardada;
        } else {
            // Si no hay foto, generamos las iniciales
            const urlAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=007bff&color=fff&rounded=true&bold=true`;
            sidebarAvatar.src = urlAvatar;
        }
    }
   
    // 3. Lógica por ROL
    if (rol === 'admin') {
        welcomeDetail.innerText = " | Administrador";
        // footerRole.innerText = "Admin";
        
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
        // footerRole.innerText = "Técnico";

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
        //footerRole.innerText = areaFormateada;

        // Menú Usuario
        menu.innerHTML = `
            <li id="btn-menu-inicio" class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio</li>
            <li id="btn-menu-crear"><img src="assets/iconos/CrearReporte.png" class="menu-icon"> Crear reporte</li>
            <li id="btn-menu-mis-reportes"><img src="assets/iconos/MisReportes.png" class="menu-icon"> Mis reportes</li>
            <li id="btn-menu-directorio"><img src="assets/iconos/NuestrosTecnicos.png" class="menu-icon"> Nuestros técnicos</li>
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
    const vistaDirectorio = document.getElementById('vista-directorio-tecnicos');
    
    // Función para ocultar todo y mostrar solo lo que necesitamos
    function mostrarVista(vistaAMostrar, botonActivo) {
        // Ocultar absolutamente todas las vistas
        if (vistaInicio) vistaInicio.style.display = 'none';
        if (vistaCrearReporte) vistaCrearReporte.style.display = 'none';
        if (vistaMisReportes) vistaMisReportes.style.display = 'none';
        if (vistaGestionReportes) vistaGestionReportes.style.display = 'none'; 
        if (vistaAdminUsuarios) vistaAdminUsuarios.style.display = 'none';
        if (vistaDirectorio) vistaDirectorio.style.display = 'none';
        
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
    const btnDirectorio = document.getElementById('btn-menu-directorio');

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

    if (btnDirectorio) {
    btnDirectorio.addEventListener('click', () => {
        mostrarVista(vistaDirectorio, btnDirectorio);
        cargarDirectorioTecnicos(); // Llama a la función que pide los datos a Python
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

                    // Preparamos el bloque de la solución si está resuelto
                    let infoResolucion = '';
                    if (reporte.estado === 'resuelto' && reporte.solucion_texto) {
                        let enlacesEvidencia = '';
                        if (reporte.evidencia_url) {
                            const urls = reporte.evidencia_url.split(','); // Por si hay múltiples fotos
                            urls.forEach((url, index) => {
                                enlacesEvidencia += `<a href="${url}" target="_blank" style="display: block; margin-top: 5px; color: #007bff; text-decoration: underline;">📷 Ver Evidencia ${urls.length > 1 ? index + 1 : ''}</a>`;
                            });
                        }
                        infoResolucion = `
                            <div style="margin-top: 10px; padding: 10px; background-color: #e8f5e9; border-left: 4px solid #28a745; border-radius: 5px; text-align: left; font-size: 0.85em; color: #333; line-height: 1.4;">
                                <strong>Solución:</strong> ${reporte.solucion_texto}
                                ${enlacesEvidencia}
                            </div>
                        `;
                }

                fila.innerHTML = `
                    <td>T-${String(reporte.id).padStart(3, '0')}</td> <td>${reporte.fecha_formateada}</td>
                    <td>${reporte.asunto}</td>
                    <td style="text-transform: capitalize;">${reporte.categoria.replace('_', ' ')}</td>
                    <td>
                        <span class="badge-estado ${claseEstado}">${reporte.estado.replace('_', ' ')}</span>
                        ${infoResolucion}
                    </td>
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
            // SI ES TÉCNICO O ADMIN: 4 Tarjetas
            if (rol === 'tecnico' || rol === 'admin') {
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
                    cargarUsuariosRecientes();
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

                    // Preparamos el bloque de la solución si está resuelto
                let infoResolucion = '';
                if (reporte.estado === 'resuelto' && reporte.solucion_texto) {
                    let enlacesEvidencia = '';
                    if (reporte.evidencia_url) {
                        const urls = reporte.evidencia_url.split(','); 
                        urls.forEach((url, index) => {
                            enlacesEvidencia += `<a href="${url}" target="_blank" style="display: block; margin-top: 5px; color: #007bff; text-decoration: underline;">📷 Ver Evidencia ${urls.length > 1 ? index + 1 : ''}</a>`;
                        });
                    }
                    infoResolucion = `
                        <div style="margin-top: 10px; padding: 10px; background-color: #e8f5e9; border-left: 4px solid #28a745; border-radius: 5px; text-align: left; font-size: 0.85em; color: #333; line-height: 1.4;">
                            <strong>Solución:</strong> ${reporte.solucion_texto}
                            ${enlacesEvidencia}
                        </div>
                    `;
                }

                // 1. Averiguamos quién está viendo la tabla
                const rolActual = localStorage.getItem('usuarioRol');
                let botonAccion = '';

                // 2. Si es técnico, le damos el botón de "Atender"
                if (rolActual === 'tecnico') {
                    botonAccion = `<button class="btn-main" style="padding: 5px 10px; font-size: 0.8rem; ${reporte.estado === 'resuelto' ? 'display:none;' : ''}" onclick="atenderReporte(${reporte.id})">Atender</button>`;
                } 
                // 3. Si es Admin, le damos el botón de "Editar"
                else if (rolActual === 'admin') {
                    // Pasamos los datos del reporte a la función para que llene la ventanita automáticamente
                    botonAccion = `<button class="btn-secondary" style="padding: 5px 10px; font-size: 0.8rem; background-color: #f59e0b; color: white; border: none;" onclick="abrirModalEditarReporte(${reporte.id}, \`${reporte.asunto}\`, '${reporte.categoria}', '${reporte.prioridad}')">✏️ Editar</button>`;
                }

                fila.innerHTML = `
                    <td>T-${String(reporte.id).padStart(3, '0')}</td>
                    <td><strong>${reporte.asunto}</strong><br><small>Por: ${reporte.nombre_usuario}</small></td>
                    <td>${reporte.equipo_id}</td>
                    <td style="text-transform: capitalize;">${reporte.prioridad}</td>
                    <td>
                        <span class="badge-estado ${claseEstado}">${reporte.estado.replace('_', ' ')}</span>
                        ${infoResolucion}
                    </td>
                    <td>
                        ${botonAccion} </td>
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
    const camposResolucion = document.getElementById('campos-resolucion');
    const solucionTexto = document.getElementById('modal-solucion-texto');
    const evidenciaArchivos = document.getElementById('modal-evidencia-archivos');

    // Escuchar cambios en el selector de estado para mostrar/ocultar los campos
    modalNuevoEstado.addEventListener('change', function() {
        if (this.value === 'resuelto') {
            camposResolucion.style.display = 'block';
        } else {
            camposResolucion.style.display = 'none';
            solucionTexto.value = ''; // Limpiamos si se arrepiente
            evidenciaArchivos.value = ''; 
        }
    });

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

            // Utilizamos FormData en lugar de JSON para poder enviar archivos
            const formData = new FormData();
            formData.append('estado', nuevoEstado);

            // Si el técnico eligió "resuelto", validamos y empacamos el texto y las fotos
            if (nuevoEstado === 'resuelto') {
                const texto = solucionTexto.value;
                const archivos = evidenciaArchivos.files;

                if (!texto.trim()) {
                    alert("⚠️ Por favor, describe la solución antes de cerrar el ticket.");
                    return;
                }
                formData.append('solucion_texto', texto);

                // Si subió fotos, las agregamos una por una al paquete
                for (let i = 0; i < archivos.length; i++) {
                    formData.append('evidencias', archivos[i]);
                }
            }

            btnGuardarEstado.innerText = "Guardando...";
            btnGuardarEstado.disabled = true;

            try {
                // Nota: Al usar FormData, NO debemos poner 'Content-Type' en los headers.
                // El navegador lo calcula automáticamente para saber cómo dividir los archivos.
                const respuesta = await fetch(`http://localhost:5000/reports/actualizar_estado/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: formData
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    alert("✅ " + resultado.mensaje);
                    modalEstado.style.display = 'none';
                
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
    // CARGAR LOS ÚLTIMOS 3 REPORTES EN EL INICIO (TÉCNICO)
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
                        <td><strong><span class="hover-username" data-userid="${user.id}">${user.nombre_usuario}</span></strong></td>
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

    // ---------------------------------------------------------
    // VISTA DEL DIRECTORIO PÚBLICO DE TÉCNICOS
    // ---------------------------------------------------------
    async function cargarDirectorioTecnicos() {
        const grid = document.getElementById('grid-tecnicos');
        const token = localStorage.getItem('token'); 

        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Cargando perfiles del equipo de soporte...</p>';

        try {
            const respuesta = await fetch('http://127.0.0.1:5000/tecnicos/publico', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                grid.innerHTML = ''; 

                if (data.tecnicos.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: gray;">Actualmente no hay técnicos disponibles en el directorio.</p>';
                    return;
                }

                data.tecnicos.forEach(tecnico => {
                    const nombreMostrar = tecnico.nombre_publico || tecnico.nombre_original;
                    const foto = tecnico.foto_url || 'https://via.placeholder.com/150/cccccc/ffffff?text=Sin+Foto';
                    const area = tecnico.area_asignada || 'Soporte General';

                    const tarjetaHTML = `
                        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
                            <img src="${foto}" alt="Foto de ${nombreMostrar}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #f0f0f0; margin-bottom: 15px;">
                            <h3 style="margin: 0 0 5px 0; color: #333; font-size: 1.2rem;">${nombreMostrar}</h3>
                            <p style="margin: 0; color: #007bff; font-weight: bold; font-size: 0.9rem;">${tecnico.carrera}</p>
                            <p style="margin: 10px 0; color: #666; font-size: 0.85rem;">Especialidad: <br> ${tecnico.especialidad}</p>
                            <span style="display: inline-block; background-color: #e3f2fd; color: #0d47a1; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem; font-weight: bold; margin-top: 10px;">
                                ${area}
                            </span>
                        </div>
                    `;
                    grid.innerHTML += tarjetaHTML;
                });
            } else {
                grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: red;">Error del servidor: ${data.error}</p>`;
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Error de red. Asegúrate de que el backend esté corriendo.</p>';
        }
    }

    // ---------------------------------------------------------
    // CARGAR LOS ÚLTIMOS USUARIOS EN EL INICIO (SOLO ADMIN)
    // ---------------------------------------------------------
    async function cargarUsuariosRecientes() {
        const title = document.getElementById('usuarios-recientes-title');
        const list = document.getElementById('usuarios-recientes-list');
        const rol = localStorage.getItem('usuarioRol');

        // Si no es admin, cortamos la ejecución para que no se muestre nada
        if (rol !== 'admin' || !list) return; 

        // Mostramos los contenedores
        title.style.display = 'block';
        list.style.display = 'block';
        list.innerHTML = '<p style="padding: 20px;">Cargando usuarios recientes...</p>';

        try {
            const respuesta = await fetch('http://localhost:5000/admin/usuarios/recientes', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await respuesta.json();

            if (respuesta.ok) {
                list.innerHTML = ''; // Limpiamos el texto de carga

                if (data.usuarios.length === 0) {
                    list.innerHTML = '<p style="padding: 20px; color: #666;">No hay usuarios en el sistema.</p>';
                    return;
                }

                // Dibujamos a cada usuario
                data.usuarios.forEach(user => {
                    // Reutilizamos tus mismos colores de rol
                    let colorRol = '#666'; // Básico
                    if (user.rol === 'tecnico') colorRol = '#1D4ED8'; // Azul
                    if (user.rol === 'admin') colorRol = '#B91C1C'; // Rojo

                    const item = document.createElement('div');
                    item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #eee;";
                    item.innerHTML = `
                        <div>
                            <strong style="font-size: 1.1rem; color: #333;">${user.nombre}</strong><br>
                            <small style="color: #666;">${user.correo}</small>
                        </div>
                        <div>
                            <span style="background-color: ${colorRol}; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; text-transform: capitalize;">
                                ${user.rol.replace('_', ' ')}
                            </span>
                        </div>
                    `;
                    list.appendChild(item);
                });
            }
        } catch (error) {
            console.error("Error:", error);
            list.innerHTML = '<p style="padding: 20px; color: red;">Error de conexión.</p>';
        }
    }

    // ---------------------------------------------------------
    // LÓGICA DEL MODAL PARA EDITAR REPORTES (SOLO ADMIN)
    // ---------------------------------------------------------
    const modalEditarReporte = document.getElementById('modal-editar-reporte');
    const btnCancelarEditRep = document.getElementById('btn-cancelar-edit-rep');
    const btnGuardarEditRep = document.getElementById('btn-guardar-edit-rep');

    // 1. Función para abrir la ventanita y rellenarla con los datos actuales  
    window.abrirModalEditarReporte = function(id, asunto, categoria, prioridad) {
        document.getElementById('edit-rep-id').value = id;
        document.getElementById('edit-rep-folio').innerText = String(id).padStart(3, '0');
    
        document.getElementById('edit-rep-asunto').value = asunto;
        document.getElementById('edit-rep-categoria').value = categoria;
        document.getElementById('edit-rep-prioridad').value = prioridad;
    
        modalEditarReporte.style.display = 'flex';
    };

    // 2. Cerrar la ventanita
    if (btnCancelarEditRep) {
        btnCancelarEditRep.addEventListener('click', () => {
            modalEditarReporte.style.display = 'none';
        });
    }

    // 3. Enviar los cambios a Python
    if (btnGuardarEditRep) {
        btnGuardarEditRep.addEventListener('click', async () => {
            const id = document.getElementById('edit-rep-id').value;
            const asunto = document.getElementById('edit-rep-asunto').value;
            const categoria = document.getElementById('edit-rep-categoria').value;
            const prioridad = document.getElementById('edit-rep-prioridad').value;

            btnGuardarEditRep.innerText = "Guardando...";
            btnGuardarEditRep.disabled = true;

            try {
                const respuesta = await fetch(`http://localhost:5000/reports/editar_admin/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ asunto, categoria, prioridad })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    alert("✅ " + resultado.mensaje);
                    modalEditarReporte.style.display = 'none';
                    
                    // Recargamos las tablas para ver los cambios de inmediato
                    cargarTodosLosReportes(); 
                    if(typeof cargarReportesRecientes === 'function') cargarReportesRecientes();
                } else {
                    alert("❌ Error: " + resultado.error);
                }
            } catch (error) {
                console.error("Error al actualizar reporte:", error);
                alert("❌ Ocurrió un error de conexión.");
            } finally {
                btnGuardarEditRep.innerText = "Guardar Cambios";
                btnGuardarEditRep.disabled = false;
            }
        });
    }

    // ---------------------------------------------------------
    // LÓGICA DE AJUSTES Y MODO OSCURO
    // ---------------------------------------------------------
    const btnAjustes = document.getElementById('btn-abrir-ajustes');
    const modalAjustes = document.getElementById('modal-ajustes');
    const btnCerrarAjustes = document.getElementById('btn-cerrar-ajustes');
    const toggleDarkMode = document.getElementById('toggle-dark-mode');

    // 1. Abrir y cerrar la ventanita
    if (btnAjustes) {
        btnAjustes.addEventListener('click', () => modalAjustes.style.display = 'flex');
    }
    if (btnCerrarAjustes) {
        btnCerrarAjustes.addEventListener('click', () => modalAjustes.style.display = 'none');
    }

    // 2. Revisar si el usuario ya tenía el modo oscuro guardado de su sesión anterior
    if (localStorage.getItem('temaOscuro') === 'activado') {
        document.body.setAttribute('data-theme', 'dark');
        if (toggleDarkMode) toggleDarkMode.checked = true;
    }

    // 3. Al hacer clic en el interruptor, cambiar el tema en tiempo real
    if (toggleDarkMode) {
        toggleDarkMode.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('temaOscuro', 'activado'); // Lo guardamos en memoria
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('temaOscuro', 'desactivado');
            }
        });
    }

    // ---------------------------------------------------------
    // SUBIR FOTO DE PERFIL
    // ---------------------------------------------------------
    const btnGuardarFoto = document.getElementById('btn-guardar-foto');
    const inputFotoPerfil = document.getElementById('input-foto-perfil');

    if (btnGuardarFoto && inputFotoPerfil) {
        btnGuardarFoto.addEventListener('click', async () => {
            const archivo = inputFotoPerfil.files[0];
            
            // Asumiendo que guardaste el ID del usuario al hacer login
            const usuarioId = localStorage.getItem('usuarioId'); 

            if (!archivo) {
                alert("⚠️ Por favor, selecciona una imagen primero.");
                return;
            }

            if (!usuarioId) {
                alert("❌ Error: No se encontró la sesión del usuario.");
                return;
            }

            // Preparamos el archivo para enviarlo
            const formData = new FormData();
            formData.append('foto', archivo);

            btnGuardarFoto.innerText = "Subiendo...";
            btnGuardarFoto.disabled = true;

            try {
                const respuesta = await fetch(`http://localhost:5000/usuarios/subir_foto/${usuarioId}`, {
                    method: 'POST',
                    // No se pone 'Content-Type' con FormData, el navegador lo hace solo
                    body: formData
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    alert("✅ ¡Foto de perfil actualizada con éxito!");
                    
                    // Guardamos la URL en memoria y actualizamos la imagen al instante
                    localStorage.setItem('usuarioFoto', resultado.foto_url);
                    const sidebarAvatar = document.getElementById('sidebar-avatar');
                    if (sidebarAvatar) {
                        sidebarAvatar.src = resultado.foto_url;
                    }
                    
                    // Cerramos la ventanita
                    document.getElementById('modal-ajustes').style.display = 'none';
                } else {
                    alert("❌ Error al subir: " + resultado.error);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("❌ Ocurrió un error de conexión.");
            } finally {
                btnGuardarFoto.innerText = "Subir y Guardar";
                btnGuardarFoto.disabled = false;
                inputFotoPerfil.value = '';
            }
        });
    }

    // ---------------------------------------------------------
    // LÓGICA DEL PANEL FLOTANTE DE USUARIO (HOVER TOOLTIP)
    // ---------------------------------------------------------

    // 1. Crear el contenedor del tooltip dinámicamente y añadirlo al body
    const userTooltip = document.createElement('div');
    userTooltip.className = 'user-tooltip';
    userTooltip.id = 'dynamic-user-tooltip';
    document.body.appendChild(userTooltip);

    // Caché para no saturar al servidor
    const userCache = {};

    // 2. Función para que el tooltip siga al mouse
    function positionTooltip(e) {
        const offset = 15; 
        let x = e.clientX + offset;
        let y = e.clientY + offset;

        const tooltipRect = userTooltip.getBoundingClientRect();
        if (x + tooltipRect.width > window.innerWidth) x = e.clientX - tooltipRect.width - offset;
        if (y + tooltipRect.height > window.innerHeight) y = e.clientY - tooltipRect.height - offset;

        userTooltip.style.left = `${x}px`;
        userTooltip.style.top = `${y}px`;
    }

    // 3. Detectar el mouse específicamente en la tabla de Gestión de Usuarios
    const tablaHoverUsuarios = document.getElementById('tabla-usuarios-body');

    if (tablaHoverUsuarios) {
        // A) Cuando el mouse ENTRA al nombre
        tablaHoverUsuarios.addEventListener('mouseover', async (e) => {
            if (!e.target.classList.contains('hover-username')) return;

            const userId = e.target.getAttribute('data-userid');
            if (!userId) return;

            // Mostrar texto de carga
            userTooltip.innerHTML = '<p style="color: var(--texto-secundario); text-align: center; width: 100%;">Cargando...</p>';
            userTooltip.classList.add('active');
            positionTooltip(e);

            let userData;
            if (userCache[userId]) {
                userData = userCache[userId];
            } else {
                try {
                    // Hacemos la petición a Python (la ruta que creaste en main.py)
                    const response = await fetch(`http://localhost:5000/usuarios/detalle/${userId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    userData = await response.json();
                    if (!response.ok) throw new Error(userData.error);
                    userCache[userId] = userData;
                } catch (error) {
                    console.error("Error:", error);
                    userTooltip.innerHTML = '<p style="color: #dc3545; text-align: center; width: 100%;">Error al cargar</p>';
                    return;
                }
            }

            // B) DIBUJAR LA INFO DEL USUARIO
            let avatarSrc = userData.foto_url;
            if (!avatarSrc || avatarSrc === 'null' || avatarSrc === '') {
                avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=007bff&color=fff&rounded=true&bold=true`;
            }

            // Nueva lógica: Solo mostramos el área si NO es un técnico
            let detailHtml = '';
            if (userData.rol !== 'tecnico' && userData.rol !== 'admin') {
                let areaLimpia = userData.area ? userData.area.replace('_', ' ') : 'No asignada';
                detailHtml = `<p><span class="tooltip-label">Área:</span> <span style="text-transform: capitalize;">${areaLimpia}</span></p>`;
            }

            // Construir el HTML final (Si es técnico, detailHtml estará vacío y solo se verá nombre/foto)
            userTooltip.innerHTML = `
                <img src="${avatarSrc}" alt="Avatar" class="tooltip-avatar">
                <div class="tooltip-info">
                    <h4>${userData.nombre}</h4>
                    ${detailHtml}
                </div>
            `;
        });

        // C) Cuando el mouse SALE del nombre (Ocultar panel)
        tablaHoverUsuarios.addEventListener('mouseout', (e) => {
            if (!e.target.classList.contains('hover-username')) return;
            userTooltip.classList.remove('active');
        });

        // D) Mover el panel junto con el cursor
        tablaHoverUsuarios.addEventListener('mousemove', (e) => {
            if (!e.target.classList.contains('hover-username')) return;
            positionTooltip(e);
        });
    }
});
