// Funciones para mostrar y cerrar modales
function showCreateHVModal() {
    $('#createHVModal').modal('show');
}

function closeCreateHVModal() {
    $('#createHVModal').modal('hide');
}

function showCreateVacanteModal() {
    $('#createVacanteModal').modal('show');
}

function closeCreateVacanteModal() {
    $('#createVacanteModal').modal('hide');
}

function showLoginModal() {
    $('#loginModal').modal('show');
}

function showRegisterModal() {
    $('#registerModal').modal('show');
}

// Validación de contraseñas
function validatePasswords() {
    var password = document.getElementById("passwordRegister").value;
    var confirmPassword = document.getElementById("confirmPasswordRegister").value;
    if (password !== confirmPassword) {
        showMessage("Las contraseñas no coinciden.", "danger");
        return false;
    }
    return true;
}

// Mostrar/ocultar campo de representante legal en el formulario de registro
function toggleRepresentanteLegalRegister() {
    var userType = document.getElementById("user_type_register").value;
    var representanteLegalGroup = document.getElementById("representanteLegalGroupRegister");
    if (userType === "empresa") {
        representanteLegalGroup.style.display = "block";
    } else {
        representanteLegalGroup.style.display = "none";
    }
}

// Manejador de eventos para el formulario de inicio de sesión
$(document).on('submit', '#loginForm', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/login',
        data: formData,
        success: function(response) {
            if (response.success) {
                window.location.href = response.redirect_url;
            } else {
                showMessage(response.message, "danger");
            }
        },
        error: function(error) {
            showMessage("Error en la solicitud AJAX para login. Por favor, inténtalo de nuevo más tarde.", "danger");
        }
    });
});

// Manejador de eventos para el formulario de registro
$(document).on('submit', '#registroForm', function(e) {
    e.preventDefault();
    if (validatePasswords()) {
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/registro',
            data: formData,
            success: function(response) {
                showMessage(response.message, response.success ? "success" : "danger");
                if (response.success) {
                    $('#registerModal').modal('hide');
                    $('#registroForm')[0].reset();
                    setTimeout(function() {
                        window.location.href = response.redirect_url;
                    }, 2000);  // Espera 2 segundos antes de redirigir
                }
            },
            error: function(error) {
                showMessage("Error en la solicitud AJAX para registro. Por favor, inténtalo de nuevo más tarde.", "danger");
            }
        });
    }
});

// Función para mostrar mensajes
function showMessage(message, type) {
    var alertClass = '';
    switch (type) {
        case 'success':
            alertClass = 'alert-success';
            break;
        case 'info':
            alertClass = 'alert-info';
            break;
        case 'warning':
            alertClass = 'alert-warning';
            break;
        case 'danger':
            alertClass = 'alert-danger';
            break;
        default:
            alertClass = 'alert-info';
            break;
    }

    var html = '<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">';
    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
    html += '<span aria-hidden="true">&times;</span></button>';
    html += message + '</div>';

    $('#messages').html(html); // Ajusta el selector donde deseas mostrar el mensaje
}

// Resto del código JavaScript...

// Función para cerrar sesión
function logout() {
    $.ajax({
        url: '/logout',
        method: 'POST',
        success: function(response) {
            if (response.success) {
                window.location.href = '/';
            } else {
                showMessage(response.message, "danger");
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para logout:', error);
            showMessage('Error al cerrar sesión. Por favor, inténtalo de nuevo más tarde.', 'danger');
            ///Redireccionar al index en caso de error también
            window.location.href = '/index.html';
        }
    });
}

// Función para mostrar candidatos
function showCandidatos() {
    $.ajax({
        url: '/candidatos',
        method: 'GET',
        success: function(html) {
            $('#contenidoPrincipal').html(html);
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para candidatos:', error);
            showMessage('Error al cargar candidatos. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    });
}

// Función para mostrar hojas de vida
function showHojasDeVida() {
    $.ajax({
        url: '/hojas_vida',
        method: 'GET',
        success: function(html) {
            $('#contenidoPrincipal').html(html);
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para hojas de vida:', error);
            showMessage('Error al cargar hojas de vida. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    });
}

// Función para mostrar las vacantes en el contenido principal
function mostrarVacantes(vacantes) {
    var html = '';
    vacantes.forEach(function(vacante) {
        html += '<div class="vacante">';
        html += '<h3>' + vacante.titulo + '</h3>';
        html += '<p>Empresa: ' + vacante.empresa + '</p>';
        html += '<p>Descripción: ' + vacante.descripcion + '</p>';
        html += '</div>';
    });
    $('#contenidoPrincipal').html(html);
}

// Función para sugerir vacante
// Función para sugerir vacantes según la profesión del usuario
function sugerirVacante() {
    var profession = $('#profession').val(); // Obtener la profesión del usuario (ajustar según tu implementación)
    $.ajax({
        url: '/sugerir_vacantes/' + profession,
        method: 'GET',
        success: function(vacantes) {
            if (vacantes.length > 0) {
                mostrarVacantes(vacantes);
            } else {
                showMessage('No se encontraron vacantes para tu profesión.', 'info');
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para sugerir vacantes:', error);
            showMessage('Error al sugerir vacantes. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    });
}

// Función para buscar vacantes
function buscarVacantes() {
    $.ajax({
        url: '/vacantes_activas',
        method: 'GET',
        success: function(vacantes) {
            if (vacantes.length > 0) {
                mostrarVacantes(vacantes);
            } else {
                showMessage('No se encontraron vacantes.', 'info');
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para buscar vacantes:', error);
            showMessage('Error al buscar vacantes. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    });
}

// Manejador de eventos para cerrar mensajes
$(document).on('click', '.alert .close', function() {
    $(this).closest('.alert').alert('close');
});
