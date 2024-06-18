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
                    window.location.href = response.redirect_url;
                }
            },
            error: function(error) {
                showMessage("Error en la solicitud AJAX para registro. Por favor, inténtalo de nuevo más tarde.", "danger");
            }
        });
    }
});

// Función para mostrar mensajes en la interfaz de usuario
function showMessage(message, type) {
    $.ajax({
        type: 'POST',
        url: '/get_message',
        data: { message: message, type: type },
        success: function(response) {
            $('#messageContainer').html(response.messageHtml);
        },
        error: function(error) {
            console.log("Error en la solicitud AJAX para obtener mensaje HTML.", error);
        }
    });
}

// Cerrar sesión
function logout() {
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: function(response) {
            if (response.success) {
                window.location.href = response.redirect_url;
            } else {
                showMessage("Error al cerrar sesión", "danger");
            }
        },
        error: function(error) {
            showMessage("Error en la solicitud AJAX para logout. Por favor, inténtalo de nuevo más tarde.", "danger");
        }
    });
}
