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
        alert("Las contraseñas no coinciden.");
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
                $('#mensajeBody').text(response.message);
                $('#mensajeModal').modal('show');
            }
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
                $('#mensajeBody').text(response.message);
                $('#mensajeModal').modal('show');
                if (response.success) {
                    $('#registerModal').modal('hide');
                    $('#registroForm')[0].reset();
                    setTimeout(function() {
                        window.location.href = response.redirect_url;
                    }, 2000);  // Espera 2 segundos antes de redirigir
                }
            }
        });
    }
});

// Función para mostrar vacantes activas
function showVacantesActivas() {
    window.location.href = '/vacantes_activas';
}

// Otras funciones existentes como showCreateVacanteModal(), etc.
