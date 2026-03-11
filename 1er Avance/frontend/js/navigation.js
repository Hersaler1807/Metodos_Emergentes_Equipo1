function navegarA(seccion) {
    // 1. Mostrar/Ocultar Pantalla Principal
    document.getElementById('pantalla-login').style.display = 'none';
    document.getElementById('pantalla-dashboard').style.display = 'flex';

    // 2. Gestionar Vistas Internas
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaCrear = document.getElementById('vista-crear');
    const navInicio = document.getElementById('nav-inicio');
    const navCrear = document.getElementById('nav-crear');

    if (seccion === 'inicio') {
        vistaInicio.style.display = 'block';
        vistaCrear.style.display = 'none';
        navInicio.classList.add('active');
        navCrear.classList.remove('active');
        document.getElementById('header-title').innerText = "Inicio";
        document.getElementById('header-icon').innerText = "home";
    } else if (seccion === 'crear') {
        vistaInicio.style.display = 'none';
        vistaCrear.style.display = 'block';
        navInicio.classList.remove('active');
        navCrear.classList.add('active');
        document.getElementById('header-title').innerText = "Crear Nuevo Reporte";
        document.getElementById('header-icon').innerText = "tablet_android";
    }
}
