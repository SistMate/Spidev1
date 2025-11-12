// Topico.js
document.addEventListener("DOMContentLoaded", async () => {
  // Leer el parámetro ?id= de la URL (ejemplo: Topico.html?id=3)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // por defecto id=1

  try {
    const res = await fetch(`http://localhost:3000/topico/${id}`);
    const data = await res.json();

    if (data.success) {
      const topico = data.topico;
      document.getElementById("tituloTopico").textContent = topico.titulo;
      document.getElementById("descripcionTopico").textContent = topico.descripcion;

      // Si la URL es de YouTube, embebemos
      if (topico.url_video.includes("youtube.com") || topico.url_video.includes("youtu.be")) {
        const videoId = topico.url_video.split("v=")[1] || topico.url_video.split("/").pop();
        document.getElementById("videoTopico").src = `https://www.youtube.com/embed/${videoId}`;
      } else {
        document.getElementById("videoTopico").src = topico.url_video;
      }
    } else {
      document.getElementById("tituloTopico").textContent = "Tópico no encontrado";
    }
  } catch (err) {
    console.error("Error al obtener tópico:", err);
    document.getElementById("tituloTopico").textContent = "Error de conexión con el servidor";
  }
});
