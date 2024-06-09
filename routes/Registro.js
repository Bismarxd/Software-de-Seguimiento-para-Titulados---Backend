import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const router = express.Router();

//lave secreta para el token
const llaveSecreta = "palabrasupersecreta";

// Configurar nodemailer
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8d271318425758",
    pass: "0f583fd4a56bda",
  },
});

const secret = "palabrasupersecreta";

// Ruta para enviar correo electrónico de confirmación
router.post("/send-email", async (req, res) => {
  try {
    // Lógica para enviar el correo electrónico de confirmación
    const { email, id } = req.body;

    // // Generar un token con tiempo de expiración (1 hora en este ejemplo)
    // const token = jwt.sign({ email }, "secreto", { expiresIn: "1h" });

    const verificationLink = `http://localhost:3000/registro/terminarRegistro?email=${encodeURIComponent(
      email
    )}&userId=${encodeURIComponent(id)}`;

    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: email,
      subject: "Confirmación de Correo Electrónico",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #00386F;">Carrera de Psicología</h2>
      <p>Gracias por registrarte al software d seguimiento de titulados.</p>
      <p>Para completar tu registro, por favor haz clic en el botón de abajo para verificar tu correo electrónico:</p>
      <a 
        href="${verificationLink}" 
        style="
          display: inline-block; 
          padding: 15px 25px; 
          margin: 20px 0; 
          font-size: 16px; 
          color: #fff; 
          background-color: #00386F; 
          text-decoration: none; 
          border-radius: 5px;
        "
      >
        Verificar Correo Electrónico
      </a>
      <p>Si no solicitaste esta verificación, puedes ignorar este mensaje.</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Correo electrónico enviado con éxito",
      status: true,
      email: email,
    });
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

//Para Insertar el usuario en la base de datos
router.post("/add_usuario", async (req, res) => {
  const { email, id, password } = req.body;

  // Expresión regular para validar que la contraseña tenga al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Validación de la contraseña
  if (!passwordRegex.test(password)) {
    return res.json({
      status: false,
      Error:
        "La contraseña debe tener al menos una letra, un número y un mínimo de 8 caracteres",
    });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO usuario (nombreUsuario, password, estado, administrador, personaId) VALUES (?, ?, ?, ?, ?)`;

  const values = [
    (req.body.nombreUsuario = email),
    hashedPassword,
    (req.body.estado = 1),
    (req.body.administrador = 0),
    id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulta:" + err,
      });
    }
    const id = result.insertId;
    return res.json({ status: true, result: result, id: id });
  });
});
export { router as registroRouter };