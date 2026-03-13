document.addEventListener('DOMContentLoaded', () => {
    // 1. Recuperar datos
    const nombre = localStorage.getItem('usuarioNombre');
    const rol = localStorage.getItem('usuarioRol');
    const area = localStorage.getItem('usuarioArea');

    // 2. Elementos del HTML
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
    if (rol === 'tecnico') {
        welcomeDetail.innerText = "| Técnico";
        footerRole.innerText = "Técnico";

        // Menú Técnico
        menu.innerHTML = `
            <li class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio</li>
            <li><img src="assets/iconos/TotalPanel.png" class="menu-icon"> Total de reportes</li>
            <li><img src="assets/iconos/EnProcesoPanel.png" class="menu-icon"> En proceso</li>
            <li><img src="assets/iconos/PendientesPanel.png" class="menu-icon"> Pendientes</li>
            <li><img src="assets/iconos/ResueltosPanel.png" class="menu-icon"> Resueltos</li>
        `;

        // Tarjetas Técnico
        statusContainer.innerHTML = `
            <div class="card"><img src="assets/iconos/Total.png" class="stat-icon"><h3>Total de reportes</h3><p>3</p></div>
            <div class="card"><img src="assets/iconos/EnProceso.png" class="stat-icon"><h3>En proceso</h3><p>3</p></div>
            <div class="card"><img src="assets/iconos/Pendientes.png" class="stat-icon"><h3>Pendientes</h3><p>0</p></div>
            <div class="card"><img src="assets/iconos/Resueltos.png" class="stat-icon"><h3>Resueltos</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Reportes recientes";

   } else {
        
        let areaFormateada = "Departamento"; // Valor por defecto
        if (area && area !== "null" && area !== "undefined") {
            areaFormateada = area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        welcomeDetail.innerText = `| ${areaFormateada}`;
        footerRole.innerText = areaFormateada;

        // Menú Usuario
       menu.innerHTML = `
            <li id="btn-menu-inicio" class="active"><img src="assets/iconos/Inicio.png" class="menu-icon"> Inicio</li>
            <li id="btn-menu-crear"><img src="assets/iconos/CrearReporte.png" class="menu-icon"> Crear reportes</li>
            <li id="btn-menu-mis-reportes"><img src="assets/iconos/MisReportes.png" class="menu-icon"> Mis reportes</li>
            <li><img src="assets/iconos/NuestrosTecnicos.png" class="menu-icon"> Nuestros técnicos</li>
        `;

        // --- TARJETAS CENTRALES USUARIO ---
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
    
    // elementos de la pantalla 
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaCrearReporte = document.getElementById('vista-crear-reporte');
    
    // Función para ocultar todo y mostrar solo lo que necesitamos
    function mostrarVista(vistaAMostrar, botonActivo) {
        // Ocultar todas las vistas
        vistaInicio.style.display = 'none';
        vistaCrearReporte.style.display = 'none';
        
        // Quitar la clase "active" 
        const todosLosBotones = document.querySelectorAll('#menu-links li');
        todosLosBotones.forEach(btn => btn.classList.remove('active'));
        
        // Mostrar la vista 
        vistaAMostrar.style.display = 'block';
        
        // Ponerle el fondo gris 
        if (botonActivo) {
            botonActivo.classList.add('active');
        }
    }

    // 2. Darle órdenes a los botones del menú 
    const btnInicio = document.getElementById('btn-menu-inicio');
    const btnCrear = document.getElementById('btn-menu-crear');

    if (btnInicio) {
        btnInicio.addEventListener('click', () => mostrarVista(vistaInicio, btnInicio));
    }

    if (btnCrear) {
        btnCrear.addEventListener('click', () => mostrarVista(vistaCrearReporte, btnCrear));
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
                // Enviar el paquete a nuestra nueva ruta en Python
                const respuesta = await fetch('http://localhost:5000/reports/crear_reporte', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosReporte)
                });

                const resultado = await respuesta.json();

                // ¿Qué pasa si sale bien o mal?
                if (respuesta.ok) {
                    alert("✅ " + resultado.mensaje + " (Folio asignado: " + resultado.reporte_id + ")");
                    
                    formNuevoReporte.reset(); // Limpiar las cajas de texto
                    mostrarVista(vistaInicio, btnInicio); // Regresar al usuario a la pantalla de Inicio
                    
                } else {
                    alert("❌ Error: " + resultado.error);
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("❌ Ocurrió un error al intentar enviar el reporte al servidor.");
            }
        });
    }
});
