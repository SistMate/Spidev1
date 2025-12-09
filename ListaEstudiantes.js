window.addEventListener("DOMContentLoaded", () => {
  console.log("JS CARGADO");
  cargarEstudiantes();
});

async function cargarEstudiantes() {
  try {
    const res = await fetch("http://localhost:3000/estudiantes");

    if(!res.ok){
      throw new Error("Error HTTP: " + res.status);
    }

    const estudiantes = await res.json();
    console.log("Datos recibidos:", estudiantes);

    const tbody = document.querySelector("#tablaEstudiantes tbody");
    tbody.innerHTML = "";

    estudiantes.forEach(est => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${est.nombre_completo|| ""}</td>
        <td>${est.email || ""}</td>
        <td>${est.rol || ""}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
    alert("Error cargando datos, revisa la consola (F12)");
  }
}
