document.getElementById("btCrea").addEventListener("click", async () => {
  const nombre_completo = document.getElementById("ncusr").value.trim();
  const email = document.getElementById("email").value.trim();
  const contrasena = document.getElementById("pass").value.trim();
  const rol = document.getElementById("opcion").value;
  const creado_en = new Date().toISOString();

  if (!nombre_completo || !email || !contrasena || !rol) {
    alert("Completa todos los campos.");
    return;
  }

  const usuario = {
    nombre_completo,
    email,
    contrasena,
    rol,
    creado_en
  };

  try {
    const res = await fetch("http://localhost:3000/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });
    const result = await res.json();
    if (result.id) {
      alert("Usuario creado correctamente.");

      window.location.href = "MenuAdmin.html";
    } else {
      alert("Error al crear el usuario.");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor.");
  }
});