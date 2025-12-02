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

app.get('/usuarios', async (req, res) => {
  try {
    const snapshot = await db.collection('Usuarios').get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Usuarios').add(data);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const doc = await db.collection('Usuarios').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    await db.collection('Usuarios').doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await db.collection('Usuarios').doc(req.params.id).delete();
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
    await db.collection('Topico').doc(req.params.id).update(req.body);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
