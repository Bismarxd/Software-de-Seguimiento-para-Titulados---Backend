import express from "express";
import multer from "multer";
import con from "../utils/db.js";
import path from "path";

const router = express.Router();

//-----------------------ESTUDIOS POSTGRADO--------------------------------------

//Subir los titulos
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/titulos");
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

//Para añadir etudios postgrado
router.post("/add_estudio", upload.single("titulo"), async (req, res) => {
  try {
    const titulo = req.file ? req.file.filename : null;

    const sql = `
  INSERT INTO estudiopostgrado
  (aInicioPostGrado, tituloCursoPostGrado, modalidadGraduacionPostGrado, aGraduacionPostGrado, gradoAcademicoPostGrado, tipoEstudioPostGrado, tituloTrabajoPostGrado, tituladoId, titulo) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      req.body.aInicioPostGrado,
      req.body.tituloCursoPostGrado,
      req.body.modalidadGraduacionPostGrado,
      req.body.aGraduacionPostGrado,
      req.body.gradoAcademicoPostGrado,
      req.body.tipoEstudioPostGrado,
      req.body.tituloTrabajoPostGrado,
      req.body.tituladoId,
      titulo,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        return res.json({
          status: false,
          Error: "Error en la consulta: " + err,
        });
      }

      return res.json({
        status: true,
        result: result,
      });
    });
  } catch (error) {
    return res.json({ status: false, Error: "Error:" + error.message });
  }
});

//Para editar estudio Postgardo
router.put("/editar_estudio_titulado/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE estudiopostgrado 
                set aInicioPostGrado = ?, tituloCursoPostGrado = ?, modalidadGraduacionPostGrado = ?, aGraduacionPostGrado = ?, gradoAcademicoPostGrado = ?, tipoEstudioPostGrado = ?, tituloTrabajoPostGrado = ?, tituladoId = ? Where id = ?`;
  const values = [
    req.body.aInicioPostGrado,
    req.body.tituloCursoPostGrado,
    req.body.modalidadGraduacionPostGrado,
    req.body.aGraduacionPostGrado,
    req.body.gradoAcademicoPostGrado,
    req.body.tipoEstudioPostGrado,
    req.body.tituloTrabajoPostGrado,
    req.body.tituladoId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//Para eliminar estudio postgardo
router.delete("/eliminar_estudio/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from estudiopostgrado where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" + err });
    return res.json({ status: true, result: result });
  });
});

//-----------------------ACTIVIADES LABORALES--------------------------------------

//Para añadir actividadades laborales
router.post("/add_actividad_laboral", (req, res) => {
  const sql = `
  INSERT INTO actividadlaboral 
  (aIngresoTrabajo, aFinalisacionTrabajo, estaTrabajando, cargoOTareaTrabajo, duracionTrabajo, institucionTrabajo, estadoActividadLaboralId, tituladoId) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    req.body.aIngresoTrabajo,
    req.body.aFinalisacionTrabajo,
    req.body.estaTrabajando,
    req.body.cargoOTareaTrabajo,
    req.body.duracionTrabajo,
    req.body.institucionTrabajo,
    req.body.estadoActividadLaboralId,
    req.body.tituladoId,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulta: " + err,
      });
    }

    return res.json({
      status: true,
      result: result,
    });
  });
});

//Para editar actividad laboral
router.put("/editar_laboral_titulado/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE actividadlaboral
                set aIngresoTrabajo = ?, aFinalisacionTrabajo = ?, estaTrabajando = ?, cargoOTareaTrabajo = ?, duracionTrabajo = ?, institucionTrabajo = ?, estadoActividadLaboralId = ?, tituladoId = ? Where id = ?`;
  const values = [
    req.body.aIngresoTrabajo,
    req.body.aFinalisacionTrabajo,
    req.body.estaTrabajando,
    req.body.cargoOTareaTrabajo,
    req.body.duracionTrabajo,
    req.body.institucionTrabajo,
    req.body.estadoActividadLaboralId,
    req.body.tituladoId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//para obtener los estados de las actividades laborales
router.get("/obtener_estados_laboral", (req, res) => {
  const sql = "SELECT * FROM estadoactividadlaboral ";
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    return res.json({ status: true, result: result });
  });
});

//para traer los estados de las actividades laborales mediante el id
router.get("/estado_laboral/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT tituloEstado FROM estadoactividadlaboral WHERE id = ${id}`;
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    if (result.length > 0) {
      const titulo = result[0].tituloEstado;
      return res.json({ status: true, result: result, titulo: titulo });
    } else {
      return res.json({ status: false, Error: "No se encontro nada" });
    }
  });
});

//Para eliminar las activiades laborales
router.delete("/eliminar_laborales/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from actividadlaboral where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" + err });
    return res.json({ status: true, result: result });
  });
});

//-----------------------INVESTIGACIONES--------------------------------------

//Para añadir las Investigaciones
router.post("/add_investigaciones", (req, res) => {
  const sql = `
  INSERT INTO investigacion 
  (aInvestigacion, temaInvestigacion, institucionInvestigacion, publicacionId, tituladoId) 
  VALUES (?, ?, ?, ?, ?)
`;

  const values = [
    req.body.aInvestigacion,
    req.body.temaInvestigacion,
    req.body.institucionInvestigacion,
    req.body.publicacionId,
    req.body.tituladoId,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulta: " + err,
      });
    }

    return res.json({
      status: true,
      result: result,
    });
  });
});

//Para editar las investigaciones
router.put("/editar_investigacion_titulado/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE investigacion 
                set aInvestigacion = ?, temaInvestigacion = ?, institucionInvestigacion = ?, publicacionId = ?, tituladoId = ? Where id = ?`;
  const values = [
    req.body.aInvestigacion,
    req.body.temaInvestigacion,
    req.body.institucionInvestigacion,
    req.body.publicacionId,
    req.body.tituladoId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//Para eliminar las investigaciones
router.delete("/eliminar_investigacion/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from investigacion where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" + err });
    return res.json({ status: true, result: result });
  });
});

//para obtener las publicaciones
router.get("/obtener_publicaciones", (req, res) => {
  const sql = "SELECT * FROM publicacion";
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    return res.json({ status: true, result: result });
  });
});

//para traerla publicacion mediante el id
router.get("/publicacion/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT tipoPublicacion FROM publicacion WHERE id = ${id}`;
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    if (result.length > 0) {
      const titulo = result[0].tipoPublicacion;
      return res.json({ status: true, result: result, titulo: titulo });
    } else {
      return res.json({ status: false, Error: "No se encontro nada" });
    }
  });
});

//para obtener las formas de trabajo o producción intelectual
router.get("/obtener_forma_trabajo", (req, res) => {
  const sql = "SELECT * FROM formatrabajoproduccion";
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    return res.json({ status: true, result: result });
  });
});

//para traerla forma de trabajo mediante el id
router.get("/formaTrabajo/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT nombreFormaTrabajoProduccion FROM formatrabajoproduccion WHERE id = ${id}`;
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" } + err);
    if (result.length > 0) {
      const titulo = result[0].nombreFormaTrabajoProduccion;
      return res.json({ status: true, result: result, titulo: titulo });
    } else {
      return res.json({ status: false, Error: "No se encontro nada" });
    }
  });
});

//-----------------------PRODUCCIONES INTELECTUALES--------------------------------------

//Para añadir las Producciones Intelectuales
router.post("/add_produccion_intelectual", (req, res) => {
  const sql = `
  INSERT INTO produccionIntelectual 
  (aProduccion, temaProduccion, institucionProduccion, publicacionId, formaTrabajoProduccionId, tituladoId) 
  VALUES (?, ?, ?, ?, ?, ?)
`;

  const values = [
    req.body.aProduccion,
    req.body.temaProduccion,
    req.body.institucionProduccion,
    req.body.publicacionId,
    req.body.formaTrabajoProduccionId,
    req.body.tituladoId,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        Error: "Error en la consulta: " + err,
      });
    }

    return res.json({
      status: true,
      result: result,
    });
  });
});

//Para editar Producciones Inteelctuales
router.put("/editar_produccion_titulado/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE produccionintelectual 
                set aProduccion = ?, temaProduccion = ?, institucionProduccion = ?, publicacionId = ?, formaTrabajoProduccionId = ?, tituladoId = ? Where id = ?`;
  const values = [
    req.body.aProduccion,
    req.body.temaProduccion,
    req.body.institucionProduccion,
    req.body.publicacionId,
    req.body.formaTrabajoProduccionId,
    req.body.tituladoId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//Para eliminar las producciones intelectuales
router.delete("/eliminar_produccion/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from produccionintelectual where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" + err });
    return res.json({ status: true, result: result });
  });
});

export { router as postTitulacionRouter };
