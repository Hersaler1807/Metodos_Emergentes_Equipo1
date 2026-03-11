// Validación para el Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const correo = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;
        const msg = document.getElementById('errorMessage');

        // Validación básica del lado del cliente
        if (!correo.endsWith('@tecnm.mx')) {
            msg.innerText = "Correo o Contraseña incorrecta"; // Mensaje genérico por seguridad
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // Guardamos el nombre y rol para usarlos en la siguiente página
                localStorage.setItem('usuarioNombre', resultado.nombre);
                localStorage.setItem('usuarioRol', resultado.rol);
                
                alert("¡Bienvenido " + resultado.nombre + "!");
                window.location.href = "dashboard.html"; // Aquí irá tu página principal
            } else {
                msg.innerText = resultado.error;
            }
        } catch (error) {
            console.error("Error:", error);
            msg.innerText = "Error al conectar con el servidor";
        }
    });
}

// Validación para el Registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Capturar los datos del formulario
        const datos = {
            nombre: document.getElementById('regName').value,
            correo: document.getElementById('regEmail').value,
            area: document.getElementById('regArea').value,
            password: document.getElementById('regPass').value
        };

        try {
            // Enviar datos a Python (Puerto 5000)
            const respuesta = await fetch('http://localhost:5000/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(resultado.mensaje);
                window.location.href = "index.html"; // Redirigir al login
            } else {
                alert("Error: " + resultado.error);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor Backend");
        }
    });
}