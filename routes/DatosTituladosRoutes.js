import express from "express";
import con from "../utils/db.js";

const router = express.Router();

//para obtener los grados academicos
router.get("/grados_academicos", (req, res) => {
  const sql = "SELECT * from gradoacademico";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//para obtener las formas de trabajo
router.get("/formas_trabajo", (req, res) => {
  const sql = "SELECT * from formatrabajo";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//para obtener las areas de trabajo
router.get("/areas_trabajo", (req, res) => {
  const sql = "SELECT * from areatrabajo";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//para obtener las modalidades de graduacion
router.get("/modalidades_titulacion", (req, res) => {
  const sql = "SELECT * from modalidadtitulacion";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//Para obtener los titulados
router.get("/obtener_titulados", (req, res) => {
  const sql =
    "SELECT persona.*, usuario.*, titulado.* FROM persona LEFT JOIN usuario ON persona.id = usuario.personaId LEFT JOIN titulado ON usuario.id = titulado.usuarioId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//obtener los datos  del Titulado
router.get("/ver_titulado/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT persona.*, usuario.*, titulado.*, gradoacademico.* , modalidadtitulacion.*, formatrabajo.*, areatrabajo.*" +
    "FROM persona " +
    "LEFT JOIN usuario ON persona.id = usuario.personaId " +
    "LEFT JOIN titulado ON usuario.id = titulado.usuarioId " +
    "LEFT JOIN gradoacademico ON titulado.gradoAcademicoId = gradoacademico.id " +
    "LEFT JOIN modalidadtitulacion ON titulado.modalidadTitulacionId = modalidadtitulacion.id " +
    "LEFT JOIN formatrabajo ON titulado.formaTrabajoId = formatrabajo.id " +
    "LEFT JOIN areatrabajo ON titulado.areaTrabajoId = areatrabajo.id " +
    "WHERE titulado.id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result: result, status: true });
  });
});

//obtener los datos  del Titulado del Perfil
router.get("/ver_titulado_perfil/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT titulado.id AS tituladoId, persona.*, usuario.*, titulado.*, gradoacademico.* , modalidadtitulacion.*, formatrabajo.*, areatrabajo.*" +
    "FROM persona " +
    "LEFT JOIN usuario ON persona.id = usuario.personaId " +
    "LEFT JOIN titulado ON usuario.id = titulado.usuarioId " +
    "LEFT JOIN gradoacademico ON titulado.gradoAcademicoId = gradoacademico.id " +
    "LEFT JOIN modalidadtitulacion ON titulado.modalidadTitulacionId = modalidadtitulacion.id " +
    "LEFT JOIN formatrabajo ON titulado.formaTrabajoId = formatrabajo.id " +
    "LEFT JOIN areatrabajo ON titulado.areaTrabajoId = areatrabajo.id " +
    "WHERE usuario.id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, error: "Hay un error" + err });
    return res.json({ result: result, status: true });
  });
});

//Para obtener la cantidad de titulados
router.get("/cantidad_titulados", (req, res) => {
  const sql = "SELECT COUNT(*) AS cantidad FROM titulado";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
      cantidad: result[0].cantidad,
    });
  });
});

//para editar los datos basicos del titulado
router.put("/editar_datos_basicos/:id", (req, res) => {
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

//para editar los datos del titulado
router.put("/editar_datos_titulado/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE titulado 
                set aIngreso = ?, aEgreso = ?, aTitulacion = ?, aExperienciaLaboral = ?, gradoAcademicoId = ?, modalidadTitulacionId = ?, formaTrabajoId = ?, areaTrabajoId = ?
                Where id = ?`;
  const values = [
    req.body.aIngreso,
    req.body.aEgreso,
    req.body.aTitulacion,
    req.body.aExperienciaLaboral,
    req.body.gradoAcademicoId,
    req.body.modalidadTitulacionId,
    req.body.formaTrabajoId,
    req.body.areaTrabajoId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

export { router as datosTituladosRouter };