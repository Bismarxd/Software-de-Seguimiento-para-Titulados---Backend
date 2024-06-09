import express from "express";
import con from "../utils/db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

//Para Insertar los datos basicos en la base de datos
router.post("/add_persona", async (req, res) => {
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

//Para Insertar el usuario en base a la persona
router.post("/add_usuario", async (req, res) => {
  const personaId = req.body.personaId;
  const personaQuery = `SELECT email, ci FROM persona WHERE id = ?`;

  con.query(personaQuery, [personaId], (err, rows) => {
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

    //construir los valores para la insercion en la tabla usuario
    const sql = `INSERT INTO usuario (nombreUsuario, password, estado, administrador, personaId) VALUES (?, ?, ?, ?, ?)`;

    const values = [
      (req.body.nombreUsuario = email),
      (req.body.password = ci),
      (req.body.estado = 1),
      (req.body.administrador = 0),
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

//Para Insertar los datos de los titulados en la base de datos

//Subir las imagenes
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/imagenes");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/add_datos_titulado",
  upload.single("imagen"),
  async (req, res) => {
    try {
      const usuarioId = req.body.usuarioId;
      const imagen = req.file ? req.file.filename : null;

      const sql = `INSERT INTO titulado (aIngreso, aEgreso, aTitulacion, aExperienciaLaboral, usuarioId, gradoAcademicoId, modalidadTitulacionId,formaTrabajoId, areaTrabajoId, imagen) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)`;

      const values = [
        req.body.aIngreso,
        req.body.aEgreso,
        req.body.aTitulacion,
        req.body.aExperienciaLaboral,
        req.body.usuarioId,
        req.body.gradoAcademicoId,
        req.body.modalidadTitulacionId,
        req.body.formaTrabajoId,
        req.body.areaTrabajoId,
        imagen,
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
  }
);

//obtener los estudios postgrado
router.get("/verestudiosPostGrado/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT estudiopostgrado.* FROM estudiopostgrado WHERE estudiopostgrado.tituladoId = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result, status: true });
  });
});

//obtener las actividades laborales
router.get("/verlaboral/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT actividadlaboral.id AS actividadLaboralId, actividadlaboral.*, estadoactividadlaboral.* FROM actividadlaboral LEFT JOIN estadoactividadlaboral ON actividadlaboral.estadoActividadLaboralId = estadoactividadlaboral.id WHERE actividadlaboral.tituladoId = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });

    return res.json({ result, status: true });
  });
});

//obtener las investigaciones
router.get("/verinvestigaciones/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT investigacion.id AS investigacionId, investigacion.*, publicacion.* FROM investigacion LEFT JOIN publicacion ON investigacion.publicacionId = publicacion.id WHERE investigacion.tituladoId = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result, status: true });
  });
});

//obtener las Producciones Intelectuales
router.get("/verproduccionesIntelectuales/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      produccionintelectual.id AS produccionId, 
      produccionintelectual.aProduccion, 
      produccionintelectual.temaProduccion, 
      produccionintelectual.institucionProduccion, 
      produccionintelectual.tituladoId, 
      produccionintelectual.publicacionId,
      -- Añade aquí los demás campos de produccionintelectual que necesites
      publicacion.*,
      formatrabajoproduccion.* 
    FROM produccionintelectual 
    LEFT JOIN formatrabajoproduccion ON produccionintelectual.publicacionId = formatrabajoproduccion.id 
    LEFT JOIN publicacion ON produccionintelectual.publicacionId = publicacion.id 
    WHERE produccionintelectual.tituladoId = ?
  `;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });

    // Log para verificar el resultado de la consulta
    console.log("Resultado de la consulta:", result);
    return res.json({ result, status: true });
  });
});

export { router as tituladoRouter };
