document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/listar-topicos");
    const data = await res.json();

    if (data.success) {
      const tbody = document.querySelector("#tablaTopicos tbody");

      data.topicos.forEach(topico => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${topico.id}</td>
          <td>${topico.titulo}</td>
          <td>${topico.descripcion}</td>
          <td>${topico.profesor_nombre}</td>
          <td>${new Date(topico.creado_en).toLocaleString()}</td>
        `;

        tbody.appendChild(fila);
      });
    } else {
      alert("No se pudieron cargar los tópicos.");
    }
  } catch (err) {
    console.error("Error al obtener tópicos:", err);
    alert("Error de conexión con el servidor.");
  }
});