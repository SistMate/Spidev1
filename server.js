// server.js
import express from "express";
import pkg from "pg";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from "path";

const { Pool } = pkg;
const app = express();
app.use(express.static(path.join(path.resolve(), "public")));
app.use(cors());
app.use(express.json());
app.use(session({ secret: "clave-secreta", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ProyGenSW",
  password: "admin",
  port: 5432,
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy({
  clientID: "950764598265-narcnf3v6vhi0j51rhcuo3dtjs0c775b.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/inicioSesion.html" }),
  (req, res) => {
    res.send(`
      <script>
        localStorage.setItem("usuario", JSON.stringify({ nombre_completo: "${req.user.displayName}" }));
        window.location.href = "/inicio.html";
      </script>
    `);
  }
);

app.post("/crear-usuario", async (req, res) => {
  const { nombre_completo, email, contrasena, rol } = req.body;

  try {
    const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0)
      return res.json({ success: false, message: "El email ya está registrado" });

    const query = `
      INSERT INTO usuarios (nombre_completo, email, contrasena, rol)
      VALUES ($1, $2, crypt($3, gen_salt('bf', 12)), $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [nombre_completo, email, contrasena, rol]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ success: false, message: "Error al crear usuario" });
  }
});

app.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const query = `
      SELECT * FROM usuarios
      WHERE email = $1 AND contrasena = crypt($2, contrasena);
    `;
    const result = await pool.query(query, [email, contrasena]);

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: "Correo o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
