// server.js

const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();   

const app = express();
app.use(express.json());


app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/InicioSesion.html');
});

app.get('/usuario', async (req, res) => {
  try {
    const snapshot = await db.collection('Usuario').get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/usuario', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Usuario').add(data);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/usuario/:id', async (req, res) => {
  try {
    const doc = await db.collection('Usuario').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/usuario/:id', async (req, res) => {
  try {
    await db.collection('Usuario').doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  try {
    await db.collection('Usuario').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/topico', async (req, res) => {
  try {
    const snapshot = await db.collection('Topico').get();
    const topicos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(topicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/topico', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Topico').add(data);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/topico/:id', async (req, res) => {
  try {
    const doc = await db.collection('Topico').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/topico/:id', async (req, res) => {
  try {
    // Referencia al documento actual
    const docRef = db.collection('Topico').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'No encontrado' });

    // Historial actual
    let historial = doc.data().historial_modificacion || [];

    // Nueva fecha de modificación
    const fecha_modificacion = new Date().toISOString();
    historial.push(fecha_modificacion);

    // Actualiza con los nuevos datos y historial
    await docRef.update({
      ...req.body,
      historial_modificacion: historial
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/topico/:id', async (req, res) => {
  try {
    await db.collection('Topico').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const snapshot = await db.collection('Usuario')
      .where('email', '==', email)
      .where('contrasena', '==', contrasena)
      .get();

    if (snapshot.empty) {
      return res.json({
        success: false,
        message: 'Correo o contraseña incorrectos'
      });
    }

    const usuario = snapshot.docs[0].data();
    usuario.id = snapshot.docs[0].id;

    res.json({
      success: true,
      user: usuario
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get('/estudiantes', async (req, res) => {
  try {
    const snapshot = await db.collection('Usuario')
      .where('rol', '==', 'ESTUDIANTE')
      .get();

    const estudiantes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Servidor iniciado en puerto ${PORT});
});
