// Validación para el Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const correo = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;
        const msg = document.getElementById('errorMessage');

        // Validación básica
        if (!correo.endsWith('@tecnm.mx')) {
            msg.innerText = "Correo o Contraseña incorrecta";
            return;
        }

        try {
            // Enviamos los datos a Python
            const respuesta = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });

            // Recibimos la respuesta de Python 
            const resultado = await respuesta.json();

            if (respuesta.ok) {

                localStorage.setItem('usuarioNombre', resultado.nombre);
                localStorage.setItem('usuarioRol', resultado.rol);
                localStorage.setItem('usuarioArea', resultado.area);
                localStorage.setItem('usuarioId', resultado.id);
                localStorage.setItem('token', resultado.token);
                
                alert("¡Bienvenido " + resultado.nombre + "!");
                window.location.href = "dashboard.html";
            } else {
                msg.innerText = resultado.error; // Si la contraseña está mal
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
            // Enviar datos a Python
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
