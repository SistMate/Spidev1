document.addEventListener("DOMContentLoaded", () => {
  const btCreaLisTop = document.getElementById("btCreaLisTop");
  const btCreaTopico = document.getElementById("btCreaTopico");

  if (btCreaTopico) {
    btCreaTopico.addEventListener("click", () => {
      window.location.href = "CrearTopico.html";
    });
  }

  if (btCreaLisTop) {
    btCreaLisTop.addEventListener("click", () => {
      window.location.href = "ListaTopicos.html";
    });
  }
});
