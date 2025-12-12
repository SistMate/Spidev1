// CrearTopico.js
// Script para crear un tópico en Firestore y agregar/modificar historial de cambios

document.getElementById("btCrea").addEventListener("click", async () => {
  const nombre_topico = document.getElementById("notop").value.trim();
  const descripcion = document.getElementById("descrip").value.trim();
  const url_video = document.getElementById("urlVid").value.trim();

  if (!nombre_topico || !descripcion || !url_video) {
    alert("Completa todos los campos.");
    return;
  }

  // Historial: primer valor es la hora de creación
  const fecha_hora = new Date().toISOString();
  const historial_modificacion = [fecha_hora];

  const topico = {
    nombre_topico,
    descripcion,
    url_video,
    historial_modificacion
  };

  try {
    const res = await fetch("http://localhost:3000/topico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topico)
    });
    const result = await res.json();
    if (result.id) {
      alert("Tópico creado correctamente.");
      window.location.href = "ListaTopicos.html"; // Cambia por la pantalla destino
    } else {
      alert("Error al crear el tópico.");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor.");
  }
});

