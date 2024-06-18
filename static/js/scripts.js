// Funciones para mostrar y cerrar modales
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
    var messageHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
    $('#messages').html(messageHtml);
}

// Función para cerrar mensajes
$(document).on('click', '.alert .close', function() {
    $(this).closest('.alert').alert('close');
});

// Función para mostrar vacantes activas
function showVacantesActivas() {
    $.ajax({
        url: '/vacantes_activas',
        method: 'GET',
        success: function(html) {
            $('#contenidoPrincipal').html(html);
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para vacantes activas:', error);
            showMessage('Error al cargar vacantes activas. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    });
}

// Función para mostrar vacantes terminadas
function showVacantesTerminadas() {
    $.ajax({
        url: '/vacantes_terminadas',
        method: 'GET',
        success: function(html) {
            $('#contenidoPrincipal').html(html);
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX para vacantes terminadas:', error);
            showMessage('Error al cargar vacantes terminadas. Por favor, inténtalo de nuevo más tarde.', 'danger');
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

// Manejador de eventos para los enlaces de la página empresa.html
$(document).ready(function() {
    $('#linkVacantesActivas').click(function(e) {
        e.preventDefault();
        showVacantesActivas();
    });

    $('#linkVacantesTerminadas').click(function(e) {
        e.preventDefault();
        showVacantesTerminadas();
    });

function showSection(sectionId) {
    const sections = ['vacantesActivas', 'vacantesTerminadas', 'candidatos'];
    sections.forEach(id => {
        document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
    });
}


    $('#linkCandidatos').click(function(e) {
        e.preventDefault();
        showCandidatos();
    });
});

