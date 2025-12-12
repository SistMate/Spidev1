document.addEventListener("DOMContentLoaded", () => {
  const btnCrearUsuario = document.getElementById("btCrearUsuario");
  const btnIniciarSesion = document.getElementById("btIniciarSesion");

  if (btnCrearUsuario) {
    btnCrearUsuario.addEventListener("click", async () => {
      try {
        // Simulación de acción previa (puede ser validación o animación)
        console.log("Redirigiendo a CrearUsuario.html...");
        window.location.href = "CrearUsuario.html";
      } catch (err) {
        console.error("Error al redirigir a Crear Usuario:", err);
        alert("Hubo un problema al intentar crear el usuario.");
      }
    });
  }

  if (btnIniciarSesion) {
    btnIniciarSesion.addEventListener("click", async () => {
      try {
        console.log("Redirigiendo a inicioSesion.html...");
        window.location.href = "inicioSesion.html";
      } catch (err) {
        console.error("Error al redirigir a Iniciar Sesión:", err);
        alert("Hubo un problema al intentar iniciar sesión.");
      }
    });
  }
});
