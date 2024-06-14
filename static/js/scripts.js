$(document).ready(function () {
    // Mostrar u ocultar campo de representante legal al cambiar tipo de usuario en el registro
    $('#user_type_register').change(function () {
        var tipo = $(this).val();
        if (tipo === 'empresa') {
            $('#representanteLegalGroup').show();
        } else {
            $('#representanteLegalGroup').hide();
        }
    });

    // Manejar el envío del formulario de registro
    $('#registroForm').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post('/registro', formData, function (response) {
            if (response.success) {
                $('#mensajeBody').text('Registro exitoso, bienvenido ' + response.name + '!');
                $('#mensajeModal').modal('show');
                $('#registerModal').modal('hide'); // Cerrar el modal de registro
                $('#registroForm')[0].reset(); // Limpiar el formulario
            } else {
                $('#mensajeBody').text(response.message);
                $('#mensajeModal').modal('show');
            }
        }).fail(function (xhr, status, error) {
            $('#mensajeBody').text('Error al registrar: ' + error);
            $('#mensajeModal').modal('show');
        });
    });

    // Manejar el envío del formulario de inicio de sesión
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post('/login', formData, function (response) {
            if (response.success) {
                $('#mensajeBody').text('Bienvenido ' + response.name + '!');
                $('#mensajeModal').modal('show');
                setTimeout(function() {
                    window.location.href = response.redirect_url;
                }, 2000); // Redirigir después de 2 segundos
            } else {
                $('#mensajeBody').text(response.message);
                $('#mensajeModal').modal('show');
            }
        }).fail(function (xhr, status, error) {
            $('#mensajeBody').text('Error al iniciar sesión: ' + error);
            $('#mensajeModal').modal('show');
        });
    });
});

// Funciones para mostrar los modales
function showLoginModal() {
    $('#loginModal').modal('show');
}

function showRegisterModal() {
    $('#registerModal').modal('show');
}
