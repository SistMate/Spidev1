document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/listar-estudiantes");
    const data = await res.json();

    if (data.success) {
      const tbody = document.querySelector("#tablaEstudiantes tbody");

      data.usuarios.forEach(est => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${est.id}</td>
          <td>${est.nombre_completo}</td>
          <td>${est.email}</td>
          <td>${est.rol}</td>
        `;
        tbody.appendChild(fila);
      });
    } else {
      alert("No se pudieron cargar los estudiantes.");
    }
  } catch (err) {
    console.error("Error al obtener estudiantes:", err);
    alert("Error de conexión con el servidor.");
  }
});