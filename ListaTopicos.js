// ListaTopicos.js
window.addEventListener("DOMContentLoaded", async () => {
  await cargarTopicos();
});

async function cargarTopicos() {
  try {
    const res = await fetch("http://localhost:3000/topico");
    const topicos = await res.json();

    const tbody = document.querySelector("#tablaTopicos tbody");
    tbody.innerHTML = "";

    (topicos || []).forEach(topico => {

      const historial = Array.isArray(topico.historial_modificacion) ? topico.historial_modificacion : [];
      const creado = historial.length > 0 ? historial[0] : "";
      const actualizado = historial.length > 1 ? historial[historial.length - 1] : "";
      const historialText = historial.join(" | ");

      // 🔥 ESTA LÍNEA FALTABA
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><input type="text" value="${topico.nombre_topico || ""}" data-original="${topico.nombre_topico || ""}"></td>
        <td><textarea data-original="${topico.descripcion || ""}">${topico.descripcion || ""}</textarea></td>
        <td><input type="url" value="${topico.url_video || ""}" data-original="${topico.url_video || ""}"></td>
        <td>${creado}</td>
        <td>${actualizado}</td>
        <td style="font-size:80%;">${historialText}</td>
        <td>
          <button class="guardar" title="Guardar cambios" onclick="guardarTopico('${topico.id}', this)"></button>
          <button class="cancelar" title="Cancelar edición" onclick="cancelarEdicion(this)"></button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error al cargar tópicos:", err);
    alert("No se pudo cargar la lista de tópicos.");
  }
}


function cancelarEdicion(btn) {
  const row = btn.closest("tr");
  const inputs = row.querySelectorAll("input, textarea");
  inputs.forEach(el => {
    el.value = el.getAttribute("data-original") || "";
  });
}

async function guardarTopico(id, btn) {
  const row = btn.closest("tr");
  const inputs = row.querySelectorAll("input, textarea");

  const nombre_topico = inputs[0].value.trim();
  const descripcion = inputs[1].value.trim();
  const url_video = inputs[2].value.trim();

  if (!nombre_topico || !descripcion || !url_video) {
    alert("Completa todos los campos del tópico.");
    return;
  }

  const nuevosDatos = { nombre_topico, descripcion, url_video };

  try {
    const res = await fetch(`http://localhost:3000/topico/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevosDatos)
    });
    const result = await res.json();
    if (result.success) {
      alert("Tópico actualizado correctamente.");
      await cargarTopicos(); // Recarga la tabla
    } else {
      alert("Error al actualizar el tópico.");
    }
  } catch (err) {
    console.error("Error al actualizar el tópico:", err);
    alert("Error de conexión con el servidor.");
  }
}