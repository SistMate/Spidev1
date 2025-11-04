document.getElementById("btCrea").addEventListener("click", async () => {
  const titulo = document.getElementById("notop").value.trim();
  const descripcion = document.getElementById("descrip").value.trim();
  const profesor = document.getElementById("profe").value.trim(); // nombre del profesor

  if (!titulo || !descripcion || !profesor) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/topico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, profesor })
    });

    const result = await res.json();

    if (result.success) {
      alert("Tópico creado exitosamente.");
      document.getElementById("notop").value = "";
      document.getElementById("descrip").value = "";
      document.getElementById("profe").value = "";
    } else {
      alert("Error al crear el tópico: " + result.message);
    }

  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor.");
  }
});
