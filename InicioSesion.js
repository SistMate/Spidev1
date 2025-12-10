document.getElementById("btIni").addEventListener("click", async () => {
  const email = document.getElementById("usr").value.trim();
  const contrasena = document.getElementById("conusr").value.trim();

  if (!email || !contrasena) {
    alert("Ingrese correo y contraseña");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena }),
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem("usuario", JSON.stringify(result.user));

      switch ((result.user.rol || "").toUpperCase()) {
        case "ADMINISTRADOR":
          window.location.href = "MenuAdmin.html";
          break;
        case "PROFESOR":
          window.location.href = "MenuProfesor.html";
          break;
        default:
          window.location.href = "inicio.html";
          break;
      }
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});
