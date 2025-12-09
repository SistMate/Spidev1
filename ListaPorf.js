window.addEventListener("DOMContentLoaded", async () => {
  try {

    const res = await fetch("http://localhost:3000/usuario");
    const usuarios = await res.json();

    const profesores = usuarios.filter(user =>
      (user.rol || "").toUpperCase() === "PROFESOR"
    );

    const tbody = document.querySelector("#tablaProfesores tbody");

    tbody.innerHTML = "";

    profesores.forEach(prof => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prof.nombre_completo || ""}</td>
        <td>${prof.email || ""}</td>
        <td>${prof.rol || ""}</td>
      `;
      tbody.appendChild(tr);
    });

    if (profesores.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4">No hay profesores registrados.</td>`;
      tbody.appendChild(tr);
    }

  } catch (err) {
    console.error("Error al obtener la lista de profesores:", err);
    alert("No se pudo cargar la lista de profesores.");
  }
});
