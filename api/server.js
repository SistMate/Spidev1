const express = require("express");
const admin = require("firebase-admin");
const session = require("express-session");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const serviceAccount = require("./serviceAccountKey.json");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const client = new OAuth2Client("TU_CLIENT_ID_DE_GOOGLE"); // reemplaza con tu Client ID

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "clave_secreta_123",
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos desde la raíz
app.use(express.static(__dirname));

// ------------------ FRONTEND ------------------
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/InicioSesion.html", (req, res) => res.sendFile(path.join(__dirname, "InicioSesion.html")));
app.get("/inicio.html", (req, res) => res.sendFile(path.join(__dirname, "inicio.html")));

// ------------------ GOOGLE OAUTH ------------------
app.get("/api/auth/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"]
  });
  res.redirect(url);
});

app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: "TU_CLIENT_ID_DE_GOOGLE"
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const nombre = payload.name;

    const snap = await db.collection("Usuario").where("email", "==", email).get();
    let userData;

    if (snap.empty) {
      const nuevo = await db.collection("Usuario").add({
        nombre,
        email,
        rol: "ESTUDIANTE",
        proveedor: "google"
      });
      userData = { id: nuevo.id, nombre, email, rol: "ESTUDIANTE" };
    } else {
      userData = { id: snap.docs[0].id, ...snap.docs[0].data() };
    }

    res.redirect(`/inicio.html?user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (err) {
    console.error(err);
    res.redirect("/InicioSesion.html");
  }
});

// ------------------ USUARIOS ------------------
app.get("/api/usuario", async (req, res) => {
  try {
    const snapshot = await db.collection("Usuario").get();
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/usuario", async (req, res) => {
  try {
    const docRef = await db.collection("Usuario").add(req.body);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/usuario/:id", async (req, res) => {
  try {
    const doc = await db.collection("Usuario").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "No encontrado" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/usuario/:id", async (req, res) => {
  try {
    await db.collection("Usuario").doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/usuario/:id", async (req, res) => {
  try {
    await db.collection("Usuario").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ TÓPICOS ------------------
app.get("/api/topico", async (req, res) => {
  try {
    const snapshot = await db.collection("Topico").get();
    const topicos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(topicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/topico", async (req, res) => {
  try {
    const docRef = await db.collection("Topico").add(req.body);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/topico/:id", async (req, res) => {
  try {
    const doc = await db.collection("Topico").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "No encontrado" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/topico/:id", async (req, res) => {
  try {
    const docRef = db.collection("Topico").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "No encontrado" });

    let historial = doc.data().historial_modificacion || [];
    historial.push(new Date().toISOString());

    await docRef.update({ ...req.body, historial_modificacion: historial });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/topico/:id", async (req, res) => {
  try {
    await db.collection("Topico").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ LOGIN ------------------
app.post("/api/login", async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const snapshot = await db.collection("Usuario")
      .where("email", "==", email)
      .where("contrasena", "==", contrasena)
      .get();

    if (snapshot.empty) return res.json({ success: false, message: "Correo o contraseña incorrectos" });

    const usuario = snapshot.docs[0].data();
    usuario.id = snapshot.docs[0].id;

    res.json({ success: true, user: usuario });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------ ESTUDIANTES ------------------
app.get("/api/estudiantes", async (req, res) => {
  try {
    const snapshot = await db.collection("Usuario").where("rol", "==", "ESTUDIANTE").get();
    const estudiantes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ INICIO DEL SERVIDOR ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
