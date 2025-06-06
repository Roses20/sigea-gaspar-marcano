// This file is intentionally left blank.
// Función para mostrar el nombre del usuario en el dashboard
function mostrarNombreUsuario() {
    // Obtener el nombre completo y rol del usuario desde localStorage
    const nombre = localStorage.getItem('usuario') || 'Usuario';
    const rol = localStorage.getItem('rol') || '';
    const nombreUsuarioSpan = document.getElementById('nombre-usuario');
    const usuarioNombreNav = document.getElementById('usuario-nombre');
    if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = nombre + (rol ? ` (${rol})` : '');
    if (usuarioNombreNav) usuarioNombreNav.textContent = `👤 ${nombre}${rol ? ` (${rol})` : ''}`;
}

// Ejecutar al cargar la página del dashboard
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', mostrarNombreUsuario);
}

// Manejo del login: guardar el nombre de usuario al iniciar sesión
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const usuario = document.getElementById('usuario').value;
                const contrasena = document.getElementById('contrasena').value;

                fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contrasena })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('usuario', data.nombre);
                        window.location.href = 'dashboard.html';
                    } else {
                        alert(data.message || 'Error de autenticación');
                    }
                })
                .catch(() => alert('Error de conexión con el servidor'));
            });
        }
    });
} else if (window.location.pathname.includes('registro.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const usuario = document.getElementById('nuevo-usuario').value.trim();
                const email = document.getElementById('nuevo-email').value.trim();
                const nombre_completo = document.getElementById('nuevo-nombre-completo').value.trim();
                const contrasena = document.getElementById('nueva-contrasena').value;
                const confirmar = document.getElementById('confirmar-contrasena').value;
                const errorMsg = document.getElementById('registro-error');
                errorMsg.textContent = '';
                if (!usuario || !email || !contrasena || !confirmar) {
                    errorMsg.textContent = 'Todos los campos son obligatorios.';
                    return;
                }
                if (contrasena !== confirmar) {
                    errorMsg.textContent = 'Las contraseñas no coinciden.';
                    return;
                }
                try {
                    const response = await fetch('http://localhost:3000/api/registro', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') },
                        body: JSON.stringify({ usuario, email, nombre_completo, contrasena })
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                        window.location.href = 'login.html';
                    } else {
                        errorMsg.textContent = data.error || 'Error en el registro.';
                    }
                } catch (err) {
                    errorMsg.textContent = 'Error de conexión con el servidor.';
                }
            });
        }
    });
} else if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value.trim();
            const contrasena = document.getElementById('contrasena').value;
            const errorMsg = document.getElementById('login-error');
            if (errorMsg) errorMsg.textContent = '';
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contrasena })
                });
                const data = await response.json();
                if (data.success && data.token) {
                    localStorage.setItem('usuario', data.nombre);
                    localStorage.setItem('rol', data.rol);
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    if (errorMsg) errorMsg.textContent = data.message || 'Usuario o contraseña incorrectos.';
                }
            } catch (err) {
                if (errorMsg) errorMsg.textContent = 'Error de conexión con el servidor.';
            }
        });
    }

// Control de acceso a dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const dashboard = document.getElementById('dashboard');
    const noSession = document.getElementById('no-session');
    // Simulación de sesión: revisa si hay usuario en localStorage
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        dashboard.style.display = 'block';
        noSession.style.display = 'none';
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) nombreUsuario.textContent = usuario;
    } else {
        dashboard.style.display = 'none';
        noSession.style.display = 'block';
    }
    // Cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
        });
    }
}

// --- Gestión de estudiantes frontend ---
if (window.location.pathname.includes('estudiantes.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const listaSection = document.getElementById('estudiantes-lista-section');
        const listaDiv = document.getElementById('estudiantes-lista');
        const formSection = document.getElementById('estudiante-form-section');
        const form = document.getElementById('estudiante-form');
        const btnNuevo = document.getElementById('btn-nuevo-estudiante');
        const btnCancelar = document.getElementById('btn-cancelar-estudiante');
        const errorMsg = document.getElementById('estudiante-error');
        const formTitle = document.getElementById('form-title');
        const busquedaInput = document.getElementById('busqueda-input');
        const filtroCampo = document.getElementById('filtro-campo');
        const btnBuscar = document.getElementById('btn-buscar');
        const btnLimpiar = document.getElementById('btn-limpiar');
        let editando = false;
        let editId = null;
        let estudiantesCache = [];

        function limpiarFormulario() {
            form.reset();
            document.getElementById('estudiante-id').value = '';
            errorMsg.textContent = '';
        }

        function mostrarFormulario(titulo, estudiante = null) {
            formTitle.textContent = titulo;
            formSection.style.display = 'block';
            listaSection.style.display = 'none';
            limpiarFormulario();
            if (estudiante) {
                document.getElementById('estudiante-id').value = estudiante.id;
                document.getElementById('nombre').value = estudiante.nombre;
                document.getElementById('apellido').value = estudiante.apellido;
                document.getElementById('cedula').value = estudiante.cedula;
                document.getElementById('fecha_nacimiento').value = estudiante.fecha_nacimiento || '';
                document.getElementById('anio').value = estudiante.anio || '';
                document.getElementById('seccion').value = estudiante.seccion || '';
                document.getElementById('direccion').value = estudiante.direccion || '';
                document.getElementById('telefono').value = estudiante.telefono || '';
                document.getElementById('correo').value = estudiante.correo || '';
            }
        }

        function mostrarLista() {
            formSection.style.display = 'none';
            listaSection.style.display = 'block';
            cargarEstudiantes();
        }

        async function cargarEstudiantes() {
            listaDiv.innerHTML = 'Cargando...';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/estudiantes', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const estudiantes = await res.json();
                estudiantesCache = Array.isArray(estudiantes) ? estudiantes : [];
                renderLista(estudiantesCache);
            } catch (err) {
                listaDiv.innerHTML = '<p>Error de conexión.</p>';
            }
        }

        function renderLista(estudiantes) {
            if (estudiantes.length === 0) {
                listaDiv.innerHTML = '<p>No hay estudiantes registrados.</p>';
                return;
            }
            let html = '<table class="tabla-estudiantes"><thead><tr><th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Año</th><th>Sección</th><th>Teléfono</th><th>Correo</th><th>Acciones</th></tr></thead><tbody>';
            estudiantes.forEach(est => {
                html += `<tr>
                    <td>${est.cedula}</td>
                    <td>${est.nombre}</td>
                    <td>${est.apellido}</td>
                    <td>${est.anio || ''}</td>
                    <td>${est.seccion || ''}</td>
                    <td>${est.telefono || ''}</td>
                    <td>${est.correo || ''}</td>
                    <td>
                        <button class="btn-editar" data-id="${est.id}">Editar</button>
                        <button class="btn-eliminar" data-id="${est.id}">Eliminar</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listaDiv.innerHTML = html;
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.onclick = async function() {
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const estudiante = await res.json();
                    mostrarFormulario('Editar Estudiante', estudiante);
                };
            });
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return;
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    cargarEstudiantes();
                };
            });
        }

        function filtrarEstudiantes() {
            const texto = busquedaInput.value.trim().toLowerCase();
            const campo = filtroCampo.value;
            let filtrados = estudiantesCache;
            if (texto) {
                filtrados = estudiantesCache.filter(est => {
                    if (!campo || campo === '') {
                        return (
                            est.cedula.toLowerCase().includes(texto) ||
                            est.nombre.toLowerCase().includes(texto) ||
                            est.apellido.toLowerCase().includes(texto)
                        );
                    } else {
                        return (est[campo] && est[campo].toLowerCase().includes(texto));
                    }
                });
            }
            renderLista(filtrados);
        }

        btnBuscar.onclick = filtrarEstudiantes;
        btnLimpiar.onclick = function() {
            busquedaInput.value = '';
            filtroCampo.value = '';
            renderLista(estudiantesCache);
        };
        busquedaInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filtrarEstudiantes();
        });

        btnNuevo.onclick = () => mostrarFormulario('Registrar Estudiante');
        btnCancelar.onclick = mostrarLista;

        form.onsubmit = async function(e) {
            e.preventDefault();
            errorMsg.textContent = '';
            const token = localStorage.getItem('token');
            const id = document.getElementById('estudiante-id').value;
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const cedula = document.getElementById('cedula').value.trim();
            const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
            const anio = document.getElementById('anio').value;
            const seccion = document.getElementById('seccion').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const data = { nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo };
            try {
                let res;
                if (id) {
                    res = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                } else {
                    res = await fetch('http://localhost:3000/api/estudiantes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                }
                const result = await res.json();
                if (result.success) {
                    mostrarLista();
                } else {
                    errorMsg.textContent = result.error || 'Error al guardar.';
                }
            } catch (err) {
                errorMsg.textContent = 'Error de conexión.';
            }
        };

        mostrarLista();
    });
}

// --- Gestión de materias frontend ---
if (window.location.pathname.includes('materias.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const listaSection = document.getElementById('materias-lista-section');
        const listaDiv = document.getElementById('materias-lista');
        const formSection = document.getElementById('materia-form-section');
        const form = document.getElementById('materia-form');
        const btnNueva = document.getElementById('btn-nueva-materia');
        const btnCancelar = document.getElementById('btn-cancelar-materia');
        const errorMsg = document.getElementById('materia-error');
        const formTitle = document.getElementById('materia-form-title');
        const busquedaInput = document.getElementById('busqueda-materia-input');
        const btnBuscar = document.getElementById('btn-buscar-materia');
        const btnLimpiar = document.getElementById('btn-limpiar-materia');
        const profesorSel = document.getElementById('profesor-materia');
        let materiasCache = [];
        let profesoresCache = [];

        async function cargarProfesores() {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/profesores', { headers: { 'Authorization': 'Bearer ' + token } });
            profesoresCache = await res.json();
            profesorSel.innerHTML = '<option value="">(Sin asignar)</option>' + profesoresCache.map(p => `<option value="${p.id}">${p.nombre} ${p.apellido}</option>`).join('');
        }

        function limpiarFormulario() {
            form.reset();
            document.getElementById('materia-id').value = '';
            errorMsg.textContent = '';
        }

        function mostrarFormulario(titulo, materia = null) {
            formTitle.textContent = titulo;
            formSection.style.display = 'block';
            listaSection.style.display = 'none';
            limpiarFormulario();
            cargarProfesores();
            if (materia) {
                document.getElementById('materia-id').value = materia.id;
                document.getElementById('nombre-materia').value = materia.nombre;
                document.getElementById('descripcion-materia').value = materia.descripcion || '';
                document.getElementById('codigo-materia').value = materia.codigo;
                profesorSel.value = materia.profesor_id || '';
            }
        }

        function mostrarLista() {
            formSection.style.display = 'none';
            listaSection.style.display = 'block';
            cargarMaterias();
        }

        async function cargarMaterias() {
            listaDiv.innerHTML = 'Cargando...';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/materias', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const materias = await res.json();
                materiasCache = Array.isArray(materias) ? materias : [];
                renderLista(materiasCache);
            } catch (err) {
                listaDiv.innerHTML = '<p>Error de conexión.</p>';
            }
        }

        function renderLista(materias) {
            if (materias.length === 0) {
                listaDiv.innerHTML = '<p>No hay materias registradas.</p>';
                return;
            }
            let html = '<table class="tabla-materias"><thead><tr><th>Código</th><th>Nombre</th><th>Descripción</th><th>Profesor</th><th>Acciones</th></tr></thead><tbody>';
            materias.forEach(mat => {
                const prof = mat.profesor_id ? profesoresCache.find(p => p.id === mat.profesor_id) : null;
                html += `<tr>
                    <td>${mat.codigo}</td>
                    <td>${mat.nombre}</td>
                    <td>${mat.descripcion || ''}</td>
                    <td>${prof ? prof.nombre + ' ' + prof.apellido : ''}</td>
                    <td>
                        <button class="btn-editar-materia" data-id="${mat.id}">Editar</button>
                        <button class="btn-eliminar-materia" data-id="${mat.id}">Eliminar</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listaDiv.innerHTML = html;
            document.querySelectorAll('.btn-editar-materia').forEach(btn => {
                btn.onclick = async function() {
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:3000/api/materias/${id}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const materia = await res.json();
                    mostrarFormulario('Editar Materia', materia);
                };
            });
            document.querySelectorAll('.btn-eliminar-materia').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('¿Seguro que deseas eliminar esta materia?')) return;
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3000/api/materias/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    cargarMaterias();
                };
            });
        }

        function filtrarMaterias() {
            const texto = busquedaInput.value.trim().toLowerCase();
            let filtradas = materiasCache;
            if (texto) {
                filtradas = materiasCache.filter(mat =>
                    mat.codigo.toLowerCase().includes(texto) ||
                    mat.nombre.toLowerCase().includes(texto)
                );
            }
            renderLista(filtradas);
        }

        btnBuscar.onclick = filtrarMaterias;
        btnLimpiar.onclick = function() {
            busquedaInput.value = '';
            renderLista(materiasCache);
        };
        busquedaInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filtrarMaterias();
        });

        btnNueva.onclick = () => mostrarFormulario('Registrar Materia');
        btnCancelar.onclick = mostrarLista;

        form.onsubmit = async function(e) {
            e.preventDefault();
            errorMsg.textContent = '';
            const token = localStorage.getItem('token');
            const id = document.getElementById('materia-id').value;
            const nombre = document.getElementById('nombre-materia').value.trim();
            const descripcion = document.getElementById('descripcion-materia').value.trim();
            const codigo = document.getElementById('codigo-materia').value.trim();
            const profesor_id = profesorSel.value || null;
            const data = { nombre, descripcion, codigo, profesor_id };
            try {
                let res;
                if (id) {
                    res = await fetch(`http://localhost:3000/api/materias/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                } else {
                    res = await fetch('http://localhost:3000/api/materias', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                }
                const result = await res.json();
                if (result.success) {
                    mostrarLista();
                } else {
                    errorMsg.textContent = result.error || 'Error al guardar.';
                }
            } catch (err) {
                errorMsg.textContent = 'Error de conexión.';
            }
        };

        mostrarLista();
    });
}

// --- Gestión de profesores frontend ---
if (window.location.pathname.includes('profesores.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const listaSection = document.getElementById('profesores-lista-section');
        const listaDiv = document.getElementById('profesores-lista');
        const formSection = document.getElementById('profesor-form-section');
        const form = document.getElementById('profesor-form');
        const btnNuevo = document.getElementById('btn-nuevo-profesor');
        const btnCancelar = document.getElementById('btn-cancelar-profesor');
        const errorMsg = document.getElementById('profesor-error');
        const formTitle = document.getElementById('profesor-form-title');
        const busquedaInput = document.getElementById('busqueda-profesor-input');
        const btnBuscar = document.getElementById('btn-buscar-profesor');
        const btnLimpiar = document.getElementById('btn-limpiar-profesor');
        let profesoresCache = [];

        function limpiarFormulario() {
            form.reset();
            document.getElementById('profesor-id').value = '';
            errorMsg.textContent = '';
        }

        function mostrarFormulario(titulo, profesor = null) {
            formTitle.textContent = titulo;
            formSection.style.display = 'block';
            listaSection.style.display = 'none';
            limpiarFormulario();
            if (profesor) {
                document.getElementById('profesor-id').value = profesor.id;
                document.getElementById('cedula-prof').value = profesor.cedula;
                document.getElementById('nombre-prof').value = profesor.nombre;
                document.getElementById('apellido-prof').value = profesor.apellido;
                document.getElementById('correo-prof').value = profesor.correo || '';
                document.getElementById('telefono-prof').value = profesor.telefono || '';
                document.getElementById('direccion-prof').value = profesor.direccion || '';
            }
        }

        function mostrarLista() {
            formSection.style.display = 'none';
            listaSection.style.display = 'block';
            cargarProfesores();
        }

        async function cargarProfesores() {
            listaDiv.innerHTML = 'Cargando...';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/profesores', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const profesores = await res.json();
                profesoresCache = Array.isArray(profesores) ? profesores : [];
                renderLista(profesoresCache);
            } catch (err) {
                listaDiv.innerHTML = '<p>Error de conexión.</p>';
            }
        }

        function renderLista(profesores) {
            if (profesores.length === 0) {
                listaDiv.innerHTML = '<p>No hay profesores registrados.</p>';
                return;
            }
            let html = '<table class="tabla-estudiantes"><thead><tr><th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr></thead><tbody>';
            profesores.forEach(prof => {
                html += `<tr>
                    <td>${prof.cedula}</td>
                    <td>${prof.nombre}</td>
                    <td>${prof.apellido}</td>
                    <td>${prof.correo || ''}</td>
                    <td>${prof.telefono || ''}</td>
                    <td>
                        <button class="btn-editar-profesor" data-id="${prof.id}">Editar</button>
                        <button class="btn-eliminar-profesor" data-id="${prof.id}">Eliminar</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listaDiv.innerHTML = html;
            document.querySelectorAll('.btn-editar-profesor').forEach(btn => {
                btn.onclick = async function() {
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:3000/api/profesores/${id}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const profesor = await res.json();
                    mostrarFormulario('Editar Profesor', profesor);
                };
            });
            document.querySelectorAll('.btn-eliminar-profesor').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('¿Seguro que deseas eliminar este profesor?')) return;
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3000/api/profesores/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    cargarProfesores();
                };
            });
        }

        function filtrarProfesores() {
            const texto = busquedaInput.value.trim().toLowerCase();
            let filtrados = profesoresCache;
            if (texto) {
                filtrados = profesoresCache.filter(prof =>
                    prof.cedula.toLowerCase().includes(texto) ||
                    prof.nombre.toLowerCase().includes(texto) ||
                    prof.apellido.toLowerCase().includes(texto)
                );
            }
            renderLista(filtrados);
        }

        btnBuscar.onclick = filtrarProfesores;
        btnLimpiar.onclick = function() {
            busquedaInput.value = '';
            renderLista(profesoresCache);
        };
        busquedaInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filtrarProfesores();
        });

        btnNuevo.onclick = () => mostrarFormulario('Registrar Profesor');
        btnCancelar.onclick = mostrarLista;

        form.onsubmit = async function(e) {
            e.preventDefault();
            errorMsg.textContent = '';
            const token = localStorage.getItem('token');
            const id = document.getElementById('profesor-id').value;
            const cedula = document.getElementById('cedula-prof').value.trim();
            const nombre = document.getElementById('nombre-prof').value.trim();
            const apellido = document.getElementById('apellido-prof').value.trim();
            const correo = document.getElementById('correo-prof').value.trim();
            const telefono = document.getElementById('telefono-prof').value.trim();
            const direccion = document.getElementById('direccion-prof').value.trim();
            const data = { cedula, nombre, apellido, correo, telefono, direccion };
            try {
                let res;
                if (id) {
                    res = await fetch(`http://localhost:3000/api/profesores/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                } else {
                    res = await fetch('http://localhost:3000/api/profesores', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                }
                const result = await res.json();
                if (result.success) {
                    mostrarLista();
                } else {
                    errorMsg.textContent = result.error || 'Error al guardar.';
                }
            } catch (err) {
                errorMsg.textContent = 'Error de conexión.';
            }
        };

        mostrarLista();
    });
}

// --- Gestión de inscripciones frontend ---
if (window.location.pathname.includes('inscripciones.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const listaSection = document.getElementById('inscripciones-lista-section');
        const listaDiv = document.getElementById('inscripciones-lista');
        const formSection = document.getElementById('inscripcion-form-section');
        const form = document.getElementById('inscripcion-form');
        const btnNueva = document.getElementById('btn-nueva-inscripcion');
        const btnCancelar = document.getElementById('btn-cancelar-inscripcion');
        const errorMsg = document.getElementById('inscripcion-error');
        const formTitle = document.getElementById('inscripcion-form-title');
        const estudianteSel = document.getElementById('estudiante-insc');
        const materiaSel = document.getElementById('materia-insc');
        const profesorSel = document.getElementById('profesor-insc');
        let inscripcionesCache = [];
        let estudiantesCache = [];
        let materiasCache = [];
        let profesoresCache = [];

        function limpiarFormulario() {
            form.reset();
            document.getElementById('inscripcion-id').value = '';
            errorMsg.textContent = '';
        }

        async function cargarSelects() {
            const token = localStorage.getItem('token');
            // Estudiantes
            const resEst = await fetch('http://localhost:3000/api/estudiantes', { headers: { 'Authorization': 'Bearer ' + token } });
            estudiantesCache = await resEst.json();
            estudianteSel.innerHTML = estudiantesCache.map(e => `<option value="${e.id}">${e.cedula} - ${e.nombre} ${e.apellido}</option>`).join('');
            // Materias
            const resMat = await fetch('http://localhost:3000/api/materias', { headers: { 'Authorization': 'Bearer ' + token } });
            materiasCache = await resMat.json();
            materiaSel.innerHTML = materiasCache.map(m => `<option value="${m.id}">${m.nombre} (${m.año}°)</option>`).join('');
            // Profesores
            const resProf = await fetch('http://localhost:3000/api/profesores', { headers: { 'Authorization': 'Bearer ' + token } });
            profesoresCache = await resProf.json();
            profesorSel.innerHTML = profesoresCache.map(p => `<option value="${p.id}">${p.nombre} ${p.apellido}</option>`).join('');
        }

        function mostrarFormulario(titulo, insc = null) {
            formTitle.textContent = titulo;
            formSection.style.display = 'block';
            listaSection.style.display = 'none';
            limpiarFormulario();
            cargarSelects();
            if (insc) {
                document.getElementById('inscripcion-id').value = insc.id;
                estudianteSel.value = insc.estudiante_id;
                materiaSel.value = insc.materia_id;
                profesorSel.value = insc.profesor_id;
                document.getElementById('periodo-insc').value = insc.periodo;
            }
        }

        function mostrarLista() {
            formSection.style.display = 'none';
            listaSection.style.display = 'block';
            cargarInscripciones();
        }

        async function cargarInscripciones() {
            listaDiv.innerHTML = 'Cargando...';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/inscripciones', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const inscripciones = await res.json();
                inscripcionesCache = Array.isArray(inscripciones) ? inscripciones : [];
                renderLista(inscripcionesCache);
            } catch (err) {
                listaDiv.innerHTML = '<p>Error de conexión.</p>';
            }
        }

        function renderLista(inscripciones) {
            if (inscripciones.length === 0) {
                listaDiv.innerHTML = '<p>No hay inscripciones registradas.</p>';
                return;
            }
            let html = '<table class="tabla-estudiantes"><thead><tr><th>Estudiante</th><th>Materia</th><th>Profesor</th><th>Período</th><th>Acciones</th></tr></thead><tbody>';
            inscripciones.forEach(insc => {
                html += `<tr>
                    <td>${insc.estudiante_cedula} - ${insc.estudiante_nombre} ${insc.estudiante_apellido}</td>
                    <td>${insc.materia_nombre} (${insc.materia_año}°)</td>
                    <td>${insc.profesor_nombre} ${insc.profesor_apellido}</td>
                    <td>${insc.periodo}</td>
                    <td>
                        <button class="btn-editar-inscripcion" data-id="${insc.id}">Editar</button>
                        <button class="btn-eliminar-inscripcion" data-id="${insc.id}">Eliminar</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listaDiv.innerHTML = html;
            document.querySelectorAll('.btn-editar-inscripcion').forEach(btn => {
                btn.onclick = async function() {
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:3000/api/inscripciones/${id}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const insc = await res.json();
                    mostrarFormulario('Editar Inscripción', insc);
                };
            });
            document.querySelectorAll('.btn-eliminar-inscripcion').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('¿Seguro que deseas eliminar esta inscripción?')) return;
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3000/api/inscripciones/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    cargarInscripciones();
                };
            });
        }

        btnNueva.onclick = () => mostrarFormulario('Registrar Inscripción');
        btnCancelar.onclick = mostrarLista;

        form.onsubmit = async function(e) {
            e.preventDefault();
            errorMsg.textContent = '';
            const token = localStorage.getItem('token');
            const id = document.getElementById('inscripcion-id').value;
            const estudiante_id = estudianteSel.value;
            const materia_id = materiaSel.value;
            const profesor_id = profesorSel.value;
            const periodo = document.getElementById('periodo-insc').value.trim();
            const data = { estudiante_id, materia_id, profesor_id, periodo };
            try {
                let res;
                if (id) {
                    res = await fetch(`http://localhost:3000/api/inscripciones/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                } else {
                    res = await fetch('http://localhost:3000/api/inscripciones', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                }
                const result = await res.json();
                if (result.success) {
                    mostrarLista();
                } else {
                    errorMsg.textContent = result.error || 'Error al guardar.';
                }
            } catch (err) {
                errorMsg.textContent = 'Error de conexión.';
            }
        };

        mostrarLista();
    });
}

// --- Gestión de notas frontend ---
if (window.location.pathname.includes('notas.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const listaSection = document.getElementById('notas-lista-section');
        const listaDiv = document.getElementById('notas-lista');
        const formSection = document.getElementById('nota-form-section');
        const form = document.getElementById('nota-form');
        const btnNueva = document.getElementById('btn-nueva-nota');
        const btnCancelar = document.getElementById('btn-cancelar-nota');
        const errorMsg = document.getElementById('nota-error');
        const formTitle = document.getElementById('nota-form-title');
        const inscripcionSel = document.getElementById('inscripcion-nota');
        let notasCache = [];
        let inscripcionesCache = [];

        function limpiarFormulario() {
            form.reset();
            document.getElementById('nota-id').value = '';
            errorMsg.textContent = '';
        }

        async function cargarSelects() {
            const token = localStorage.getItem('token');
            const resIns = await fetch('http://localhost:3000/api/inscripciones', { headers: { 'Authorization': 'Bearer ' + token } });
            inscripcionesCache = await resIns.json();
            inscripcionSel.innerHTML = inscripcionesCache.map(i =>
                `<option value="${i.id}">${i.estudiante_cedula} - ${i.estudiante_nombre} ${i.estudiante_apellido} | ${i.materia_nombre} (${i.materia_año}°) | ${i.periodo}</option>`
            ).join('');
        }

        function mostrarFormulario(titulo, nota = null) {
            formTitle.textContent = titulo;
            formSection.style.display = 'block';
            listaSection.style.display = 'none';
            limpiarFormulario();
            cargarSelects();
            if (nota) {
                document.getElementById('nota-id').value = nota.id;
                inscripcionSel.value = nota.inscripcion_id;
                document.getElementById('nota-valor').value = nota.nota;
                document.getElementById('nota-observaciones').value = nota.observaciones || '';
            }
        }

        function mostrarLista() {
            formSection.style.display = 'none';
            listaSection.style.display = 'block';
            cargarNotas();
        }

        async function cargarNotas() {
            listaDiv.innerHTML = 'Cargando...';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/notas', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const notas = await res.json();
                notasCache = Array.isArray(notas) ? notas : [];
                renderLista(notasCache);
            } catch (err) {
                listaDiv.innerHTML = '<p>Error de conexión.</p>';
            }
        }

        function renderLista(notas) {
            if (notas.length === 0) {
                listaDiv.innerHTML = '<p>No hay notas registradas.</p>';
                return;
            }
            let html = '<table class="tabla-estudiantes"><thead><tr><th>Estudiante</th><th>Materia</th><th>Profesor</th><th>Período</th><th>Nota</th><th>Observaciones</th><th>Acciones</th></tr></thead><tbody>';
            notas.forEach(nota => {
                const insc = nota;
                html += `<tr>
                    <td>${insc.estudiante_id || ''}</td>
                    <td>${insc.materia_id || ''}</td>
                    <td>${insc.profesor_id || ''}</td>
                    <td>${insc.periodo || ''}</td>
                    <td>${nota.nota}</td>
                    <td>${nota.observaciones || ''}</td>
                    <td>
                        <button class="btn-editar-nota" data-id="${nota.id}">Editar</button>
                        <button class="btn-eliminar-nota" data-id="${nota.id}">Eliminar</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listaDiv.innerHTML = html;
            document.querySelectorAll('.btn-editar-nota').forEach(btn => {
                btn.onclick = async function() {
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:3000/api/notas/${id}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const nota = await res.json();
                    mostrarFormulario('Editar Nota', nota);
                };
            });
            document.querySelectorAll('.btn-eliminar-nota').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('¿Seguro que deseas eliminar esta nota?')) return;
                    const id = this.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3000/api/notas/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    cargarNotas();
                };
            });
        }

        btnNueva.onclick = () => mostrarFormulario('Registrar Nota');
        btnCancelar.onclick = mostrarLista;

        form.onsubmit = async function(e) {
            e.preventDefault();
            errorMsg.textContent = '';
            const token = localStorage.getItem('token');
            const id = document.getElementById('nota-id').value;
            const inscripcion_id = inscripcionSel.value;
            const notaValor = document.getElementById('nota-valor').value;
            const observaciones = document.getElementById('nota-observaciones').value.trim();
            const data = { inscripcion_id, nota: notaValor, observaciones };
            try {
                let res;
                if (id) {
                    res = await fetch(`http://localhost:3000/api/notas/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                } else {
                    res = await fetch('http://localhost:3000/api/notas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(data)
                    });
                }
                const result = await res.json();
                if (result.success) {
                    mostrarLista();
                } else {
                    errorMsg.textContent = result.error || 'Error al guardar.';
                }
            } catch (err) {
                errorMsg.textContent = 'Error de conexión.';
            }
        };

        mostrarLista();
    });
}

// --- Reportes frontend ---
if (window.location.pathname.includes('reportes.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const token = localStorage.getItem('token');
        // Materias inscritas de un estudiante
        document.getElementById('btn-reporte-materias-estudiante').onclick = async function() {
            const id = document.getElementById('reporte-estudiante-id').value;
            const div = document.getElementById('reporte-materias-estudiante');
            div.innerHTML = 'Cargando...';
            try {
                const res = await fetch(`http://localhost:3000/api/reportes/estudiante/${id}/materias`, { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    let html = '<table><thead><tr><th>Código</th><th>Nombre</th><th>Descripción</th></tr></thead><tbody>';
                    data.forEach(m => {
                        html += `<tr><td>${m.codigo}</td><td>${m.nombre}</td><td>${m.descripcion || ''}</td></tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<p>No hay materias inscritas.</p>';
                }
            } catch {
                div.innerHTML = '<p>Error de conexión.</p>';
            }
        };
        // Notas de un estudiante
        document.getElementById('btn-reporte-notas-estudiante').onclick = async function() {
            const id = document.getElementById('reporte-notas-estudiante-id').value;
            const div = document.getElementById('reporte-notas-estudiante');
            div.innerHTML = 'Cargando...';
            try {
                const res = await fetch(`http://localhost:3000/api/reportes/estudiante/${id}/notas`, { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    let html = '<table><thead><tr><th>Materia</th><th>Período</th><th>Evaluación</th><th>Nota</th></tr></thead><tbody>';
                    data.forEach(n => {
                        html += `<tr><td>${n.materia_nombre}</td><td>${n.periodo}</td><td>${n.evaluacion || ''}</td><td>${n.nota}</td></tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<p>No hay notas registradas.</p>';
                }
            } catch {
                div.innerHTML = '<p>Error de conexión.</p>';
            }
        };
        // Inscripciones por período
        document.getElementById('btn-reporte-inscripciones-periodo').onclick = async function() {
            const periodo = document.getElementById('reporte-periodo').value;
            const div = document.getElementById('reporte-inscripciones-periodo');
            div.innerHTML = 'Cargando...';
            try {
                const res = await fetch(`http://localhost:3000/api/reportes/inscripciones/periodo/${encodeURIComponent(periodo)}`, { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    let html = '<table><thead><tr><th>Estudiante</th><th>Materia</th><th>Profesor</th><th>Período</th></tr></thead><tbody>';
                    data.forEach(i => {
                        html += `<tr><td>${i.estudiante_nombre} ${i.estudiante_apellido}</td><td>${i.materia_nombre}</td><td>${i.profesor_nombre} ${i.profesor_apellido}</td><td>${i.periodo}</td></tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<p>No hay inscripciones para ese período.</p>';
                }
            } catch {
                div.innerHTML = '<p>Error de conexión.</p>';
            }
        };
        // Estudiantes por materia
        document.getElementById('btn-reporte-estudiantes-materia').onclick = async function() {
            const id = document.getElementById('reporte-materia-id').value;
            const div = document.getElementById('reporte-estudiantes-materia');
            div.innerHTML = 'Cargando...';
            try {
                const res = await fetch(`http://localhost:3000/api/reportes/materia/${id}/estudiantes`, { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    let html = '<table><thead><tr><th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Año</th><th>Sección</th></tr></thead><tbody>';
                    data.forEach(e => {
                        html += `<tr><td>${e.cedula}</td><td>${e.nombre}</td><td>${e.apellido}</td><td>${e.anio || ''}</td><td>${e.seccion || ''}</td></tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<p>No hay estudiantes inscritos en esa materia.</p>';
                }
            } catch {
                div.innerHTML = '<p>Error de conexión.</p>';
            }
        };
        // Estudiantes por sección
        document.getElementById('btn-reporte-estudiantes-seccion').onclick = async function() {
            const anio = document.getElementById('reporte-anio').value;
            const seccion = document.getElementById('reporte-seccion').value;
            const div = document.getElementById('reporte-estudiantes-seccion');
            div.innerHTML = 'Cargando...';
            try {
                const res = await fetch(`http://localhost:3000/api/reportes/estudiantes/seccion?anio=${anio}&seccion=${encodeURIComponent(seccion)}`, { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    let html = '<table><thead><tr><th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Año</th><th>Sección</th></tr></thead><tbody>';
                    data.forEach(e => {
                        html += `<tr><td>${e.cedula}</td><td>${e.nombre}</td><td>${e.apellido}</td><td>${e.anio || ''}</td><td>${e.seccion || ''}</td></tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<p>No hay estudiantes en esa sección.</p>';
                }
            } catch {
                div.innerHTML = '<p>Error de conexión.</p>';
            }
        };
    });
}