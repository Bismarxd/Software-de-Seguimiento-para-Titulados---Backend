import express from "express";
import con from "../utils/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

//Para obtener la cantidad de administradores
router.get("/cantidad_administradores", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS cantidad FROM usuario Where administrador = 1";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
      cantidad: result[0].cantidad,
    });
  });
});

//Para otener los grados academicos
router.get("/grados_academicos", (req, res) => {
  const sql = "SELECT * from gradoacademico";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//Para Insertar los datos basicos del administrador en la base de datos
router.post("/add_persona_administrador", async (req, res) => {
  const { email } = req.body;
  // Verificar si el email ya existe
  const checkEmailSql = "SELECT * FROM persona WHERE email = ?";
  con.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulta de verificación: " + err,
      });
    }

    if (results.length > 0) {
      return res.json({
        status: false,
        Error: "El email ya esta registrado",
      });
    }
    const sql = `INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, ci, fechaNacimiento, celular, direccion, sexo, email) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?)`;

    const values = [
      req.body.nombre,
      req.body.apellidoPaterno,
      req.body.apellidoMaterno,
      req.body.ci,
      req.body.fechaNacimiento,
      req.body.celular,
      req.body.direccion,
      req.body.sexo,
      req.body.email,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        return res.json({
          status: false,
          Error: "Error en la consulta:" + err,
        });
      }
      const id = result.insertId;
      // Obtener los resultados insertados
      con.query("SELECT * FROM persona WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.json({
            status: false,
            Error: "Error al obtener el registro insertado:" + err,
          });
        }

        const insertedRecord = rows[0];

        return res.json({ status: true, result: insertedRecord, id: id });
      });
    });
  });
});

//Para Insertar el usuario del administrador en base a la persona
router.post("/add_usuario_administrador", async (req, res) => {
  const personaId = req.body.personaId;
  const personaQuery = `SELECT email, ci FROM persona WHERE id = ?`;

  con.query(personaQuery, [personaId], async (err, rows) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulat de personaID",
      });
    }

    if (rows.length === 0) {
      res.json({ status: false, Error: "No se encontro ninguna persona" });
    }

    //obtener el email del resultado e la consulta
    const email = rows[0].email;
    const ci = rows[0].ci;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(ci, 10);

    //construir los valores para la insercion en la tabla usuario
    const sql = `INSERT INTO usuario (nombreUsuario, password, estado, administrador, personaId) VALUES (?, ?, ?, ?, ?)`;

    const values = [
      (req.body.nombreUsuario = email),
      (req.body.password = hashedPassword),
      (req.body.estado = 1),
      (req.body.administrador = 1),
      req.body.personaId,
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
});

//para insertar el cargo de los administradores
router.post("/add_cargo_administrador", async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId;

    const sql = `INSERT INTO administrador (tituloCargo, descripcionCargo, tipoAdministrador, usuarioId) VALUES (?, ?, ?, ?)`;

    const values = [
      req.body.tituloCargo,
      req.body.descripcionCargo,
      req.body.tipoAdministrador,
      usuarioId,
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
  } catch (error) {
    return res.json({ status: false, Error: "Error:" + error.message });
  }
});

//Para obtener los administradores
router.get("/obtener_administradores", (req, res) => {
  const sql =
    "SELECT persona.*, usuario.*, administrador.* FROM persona LEFT JOIN usuario ON persona.id = usuario.personaId LEFT JOIN administrador ON usuario.id = administrador.usuarioId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//para editar el administrador
router.put("/editar_datos_basicos_administardor/:id", async (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE persona 
                set nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, ci = ?,  email = ?, fechaNacimiento = ?, sexo = ?, direccion = ?, celular = ?
                Where id = ?`;
  const values = [
    req.body.nombre,
    req.body.apellidoPaterno,
    req.body.apellidoMaterno,
    req.body.ci,
    req.body.email,
    req.body.fechaNacimiento,
    req.body.sexo,
    req.body.direccion,
    req.body.celular,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//para editar la contraseña del administrador
router.put("/editar_password_administardor/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

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

  const sql = `UPDATE usuario set password = ? Where id = ?`;
  con.query(sql, [hashedPassword, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//obtener los datos  del administrador
router.get("/obtener_admninistrador/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT persona.*, usuario.*, administrador.*" +
    "FROM persona " +
    "LEFT JOIN usuario ON persona.id = usuario.personaId " +
    "LEFT JOIN administrador ON usuario.id = administrador.usuarioId " +
    "WHERE usuario.id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result: result, status: true });
  });
});

//Para eliminar el administrador
router.delete("/eliminar_administrador/:id", (req, res) => {
  const id = req.params.id;
  const { adminId } = req.body;
  const borrarCargo =
    "UPDATE administrador JOIN usuario ON administrador.usuarioId = usuario.id SET administrador.activo = FALSE, administrador.deleted_at = CURRENT_TIMESTAMP, administrador.deleted_by = ? WHERE usuario.personaId = ?";
  con.query(borrarCargo, [adminId, id], (errCargo, resultCargo) => {
    if (errCargo) {
      return res.json({
        status: false,
        Error: "Error en la consulta" + errCargo,
      });
    }

    //Eliminar el usuario
    const borrarUsuario =
      "UPDATE usuario SET activo = FALSE WHERE personaId = ?";
    con.query(borrarUsuario, [id], (errUsuario, resultUsuario) => {
      if (errUsuario) {
        return res.json({
          status: false,
          Error: "Error en la consulta" + errUsuario,
        });
      }
      //Eliminar la persona
      const borrarPersona = "UPDATE persona SET activo = FALSE WHERE id = ?";
      con.query(borrarPersona, [id], (errPersona, resultPersona) => {
        if (errPersona) {
          return res.json({
            status: false,
            Error: "Error en la consulta" + errPersona,
          });
        }
        return res.json({
          status: true,
          result: resultPersona,
          resultCargo: resultCargo,
          resultUsuario: resultUsuario,
        });
      });
    });
  });
});

//obtener el administrador
router.get("/obtener_administrador/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT administrador.* FROM administrador WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result, status: true });
  });
});

//para actualizar el administardor
//para editar el administrador
router.put("/editar_cargo_administrador/:id", async (req, res) => {
  const id = req.params.id;
  const { adminId } = req.body;

  const sql = `UPDATE administrador 
              set tituloCargo = ?, descripcionCargo = ?, tipoAdministrador = ?, modified_by = ?
              Where id = ?`;
  const values = [
    req.body.tituloCargo,
    req.body.descripcionCargo,
    req.body.tipoAdministrador,
    req.body.adminId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

export { router as administradoresRouter };
