document.addEventListener("DOMContentLoaded", () => {
  const btCreaTopico = document.getElementById("btCreaTopico");
  const btCreaLisTop = document.getElementById("btCreaLisTop");
  const btListEst = document.getElementById("btListEst");
  const btListProf = document.getElementById("btListProf");
  const btcrearUsr = document.getElementById("btcrearUsr");

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

  if (btListEst) {
    btListEst.addEventListener("click", () => {
      window.location.href = "ListaEstudiantes.html";
    });
  }

  if (btListProf) {
    btListProf.addEventListener("click", () => {
      window.location.href = "ListaPorf.html";
    });
  }

  if (btcrearUsr) {
    btcrearUsr.addEventListener("click", () => {
      window.location.href = "CrearUsuario.html";
    });
  }
});
