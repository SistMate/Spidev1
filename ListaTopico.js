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
          <td contenteditable="true">${topico.titulo}</td>
          <td contenteditable="true">${topico.descripcion}</td>
          <td contenteditable="true">${topico.url_video}</td>
          <td>${new Date(topico.fecha_creacion).toLocaleString()}</td>
          <td><button class="btn-editar" data-id="${topico.id}">Guardar</button></td>
          <td><button class="btn-historial" data-id="${topico.id}">Ver historial</button></td>
        `;

        tbody.appendChild(fila);
      });

      tbody.addEventListener("click", async (e) => {
        const fila = e.target.closest("tr");
        const id = e.target.dataset.id;

        // Guardar cambios
        if (e.target.classList.contains("btn-editar")) {
          const titulo = fila.children[1].textContent.trim();
          const descripcion = fila.children[2].textContent.trim();
          const url_video = fila.children[3].textContent.trim();

          try {
            const res = await fetch(`http://localhost:3000/editar-topico/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ titulo, descripcion, url_video })
            });

            const result = await res.json();
            if (result.success) {
              alert("Tópico actualizado correctamente.");
            } else {
              alert("Error al actualizar el tópico.");
            }
          } catch (err) {
            console.error("Error al editar tópico:", err);
            alert("Error de conexión al editar.");
          }
        }

        // Ver historial
        if (e.target.classList.contains("btn-historial")) {
          try {
            const res = await fetch(`http://localhost:3000/historial-topico/${id}`);
            const data = await res.json();

            if (data.success) {
              const fechas = data.fechas;
              if (fechas.length === 0) {
                alert("Este tópico aún no tiene historial de actualizaciones.");
              } else {
                let mensaje = `Historial de actualizaciones para tópico ${id}:\n\n`;
                fechas.forEach(f => {
                  mensaje += `• ${new Date(f.fecha_actualizacion).toLocaleString()}\n`;
                });
                alert(mensaje);
              }
            } else {
              alert("No se pudo obtener el historial.");
            }
          } catch (err) {
            console.error("Error al obtener historial:", err);
            alert("Error de conexión al consultar historial.");
          }
        }
      });
    } else {
      alert("No se pudieron cargar los tópicos.");
    }
  } catch (err) {
    console.error("Error al obtener tópicos:", err);
    alert("Error de conexión con el servidor.");
  }
});
