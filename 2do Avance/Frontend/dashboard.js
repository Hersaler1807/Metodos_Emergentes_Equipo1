document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos guardados en el login
    const nombre = localStorage.getItem('usuarioNombre');
    const rol = localStorage.getItem('usuarioRol'); // 'tecnico' o 'usuario_basico'
    const area = localStorage.getItem('usuarioArea'); // Debes guardarlo en el login

    if (!nombre) {
        window.location.href = 'index.html'; // Si no hay datos, regresa al login
        return;
    }

    // 2. Llenar datos de bienvenida
    document.getElementById('welcome-name').innerText = nombre;
    document.getElementById('footer-name').innerText = nombre;
    document.getElementById('welcome-detail').innerText = (rol === 'tecnico') ? 'Técnico' : area;
    document.getElementById('footer-role').innerText = (rol === 'tecnico') ? 'Técnico' : 'Usuario';

    const menu = document.getElementById('menu-links');
    const statusContainer = document.getElementById('status-container');
    const bottomTitle = document.getElementById('bottom-title');

    // 3. Configurar Interfaz según el ROL
    if (rol === 'tecnico') {
        // --- MENÚ TÉCNICO ---
        menu.innerHTML = `
            <li class="active"><img scr="Frontend/assets/iconos/Inicio.png" class "menu-icon"> Inicio</li>
            <li>📈 Total de reportes</li>
            <li>⏳ En proceso</li>
            <li>⚠️ Pendientes</li>
            <li>✅ Resueltos</li>
        `;

        // --- TARJETAS TÉCNICO ---
        statusContainer.innerHTML = `
            <div class="card"><h3>Total</h3><p>3</p></div>
            <div class="card"><h3>En Proceso</h3><p>3</p></div>
            <div class="card"><h3>Pendientes</h3><p>0</p></div>
            <div class="card"><h3>Resueltos</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Reportes recientes";

    } else {
        // --- MENÚ USUARIO BÁSICO ---
        menu.innerHTML = `
            <li class="active">🏠 Inicio</li>
            <li>➕ Crear Reportes</li>
            <li>📁 Mis Reportes</li>
            <li>👥 Nuestros Técnicos</li>
        `;

        // --- TARJETAS USUARIO ---
        statusContainer.innerHTML = `
            <div class="card-u"><h3>Pendientes</h3><p>0</p></div>
            <div class="card-u"><h3>En proceso</h3><p>0</p></div>
            <div class="card-u"><h3>Finalizado</h3><p>0</p></div>
        `;
        bottomTitle.innerText = "Próximos mantenimientos";
    }

    // 4. Botón Cerrar Sesión
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});