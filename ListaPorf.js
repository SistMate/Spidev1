document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/listar-profesores");
    const data = await res.json();

    if (data.success) {
      const tbody = document.querySelector("#tablaProfesores tbody");

      data.usuarios.forEach(prof => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${prof.id}</td>
          <td>${prof.nombre_completo}</td>
          <td>${prof.email}</td>
          <td>${prof.rol}</td>
        `;
        tbody.appendChild(fila);
      });
    } else {
      alert("No se pudieron cargar los profesores.");
    }
  } catch (err) {
    console.error("Error al obtener profesores:", err);
    alert("Error de conexión con el servidor.");
  }
});