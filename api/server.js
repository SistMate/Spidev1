const admin = require("firebase-admin");
const { OAuth2Client } = require("google-auth-library");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const client = new OAuth2Client(
  "984668232844-u7g7om3do2kpb9mn7g5slk3arbe100df.apps.googleusercontent.com"
);

// Vercel usa Serverless Functions: exportamos la función
module.exports = async (req, res) => {
  const { method, url, body, query } = req;

  try {
    // ---------- Rutas API ----------
    if (url.startsWith("/api/usuario")) {
      const id = url.split("/").pop();

      if (method === "GET" && id && id !== "usuario") {
        const doc = await db.collection("Usuario").doc(id).get();
        if (!doc.exists) return res.status(404).json({ error: "No encontrado" });
        return res.json({ id: doc.id, ...doc.data() });
      }

      if (method === "GET") {
        const snapshot = await db.collection("Usuario").get();
        const usuarios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return res.json(usuarios);
      }

      if (method === "POST") {
        const docRef = await db.collection("Usuario").add(body);
        return res.json({ id: docRef.id });
      }

      if (method === "PUT" && id && id !== "usuario") {
        await db.collection("Usuario").doc(id).update(body);
        return res.json({ success: true });
      }

      if (method === "DELETE" && id && id !== "usuario") {
        await db.collection("Usuario").doc(id).delete();
        return res.json({ success: true });
      }
    }

    if (url.startsWith("/api/topico")) {
      const id = url.split("/").pop();

      if (method === "GET" && id && id !== "topico") {
        const doc = await db.collection("Topico").doc(id).get();
        if (!doc.exists) return res.status(404).json({ error: "No encontrado" });
        return res.json({ id: doc.id, ...doc.data() });
      }

      if (method === "GET") {
        const snapshot = await db.collection("Topico").get();
        const topicos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return res.json(topicos);
      }

      if (method === "POST") {
        const docRef = await db.collection("Topico").add(body);
        return res.json({ id: docRef.id });
      }

      if (method === "PUT" && id && id !== "topico") {
        const docRef = db.collection("Topico").doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "No encontrado" });

        let historial = doc.data().historial_modificacion || [];
        historial.push(new Date().toISOString());

        await docRef.update({ ...body, historial_modificacion: historial });
        return res.json({ success: true });
      }

      if (method === "DELETE" && id && id !== "topico") {
        await db.collection("Topico").doc(id).delete();
        return res.json({ success: true });
      }
    }

    if (url === "/api/login" && method === "POST") {
      const { email, contrasena } = body;

      const snapshot = await db
        .collection("Usuario")
        .where("email", "==", email)
        .where("contrasena", "==", contrasena)
        .get();

      if (snapshot.empty) {
        return res.json({ success: false, message: "Correo o contraseña incorrectos" });
      }

      const usuario = snapshot.docs[0].data();
      usuario.id = snapshot.docs[0].id;
      return res.json({ success: true, user: usuario });
    }

    if (url === "/api/estudiantes" && method === "GET") {
      const snapshot = await db.collection("Usuario").where("rol", "==", "ESTUDIANTE").get();
      const estudiantes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(estudiantes);
    }

    if (url === "/api/auth/google" && method === "GET") {
      const urlAuth = client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
      });
      return res.redirect(urlAuth);
    }

    if (url.startsWith("/api/auth/google/callback") && method === "GET") {
      const code = query.code;
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience:
          "984668232844-u7g7om3do2kpb9mn7g5slk3arbe100df.apps.googleusercontent.com",
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
          proveedor: "google",
        });
        userData = { id: nuevo.id, nombre, email, rol: "ESTUDIANTE" };
      } else {
        userData = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }

      return res.redirect(`/inicio.html?user=${encodeURIComponent(JSON.stringify(userData))}`);
    }

    // Si la ruta no coincide
    return res.status(404).json({ error: "Ruta no encontrada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
