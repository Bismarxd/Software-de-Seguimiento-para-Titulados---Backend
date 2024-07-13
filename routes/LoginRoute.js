import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", (req, res) => {
  const sql = "SELECT * from usuario Where nombreUsuario = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({
        loginStatus: false,
        Error: "Error en la consulta" + err,
      });

    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({
            loginStatus: false,
            Error: "Contraseña Incorrecta",
          });
        if (response) {
          const email = result[0].email;

          // Verificar si el usuario es administrador o no
          const role =
            result[0].administrador === 1 ? "administrador" : "usuarioTitulado";

          const token = jwt.sign(
            { role: role, email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({
            loginStatus: true,
            result: result,
            token: token,
            role: role,
          });
        } else {
          return res.json({
            loginStatus: false,
            Error: "Contraseña Incorrecta",
          });
        }
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Email o Password Incorrectos",
      });
    }
  });
});

//Para cerrar Sesion
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

export { router as loginRouter };
