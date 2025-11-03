document.getElementById("btIni").addEventListener("click", async () => {
  const email = document.getElementById("usr").value;
  const contrasena = document.getElementById("conusr").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena }),
    });

    const result = await res.json();
    if (result.success) {
      localStorage.setItem("usuario", JSON.stringify(result.user));
      window.location.href = "inicio.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
    alert(" Error de conexión con el servidor");
  }
});

document.getElementById("btCre").addEventListener("click", () => {
  window.location.href = "CrearUsuario.html";
});

