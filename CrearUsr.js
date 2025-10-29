document.getElementById("btCrea").addEventListener("click", async () => {
  const nombre_completo = document.getElementById("ncusr").value.trim();
  const email = document.getElementById("email").value.trim();
  const contrasena = document.getElementById("pass").value.trim();
  const rol = document.getElementById("opcion").value;

  if (!nombre_completo || !email || !contrasena) {
    alert("Completa todos los campos.");
    return;
  }

  const data = { nombre_completo, email, contrasena, rol };

  try {
    const res = await fetch("http://localhost:3000/crear-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("Usuario creado con éxito");
    } else {
      alert("Error al crear usuario");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});
