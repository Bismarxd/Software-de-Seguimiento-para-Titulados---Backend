import express from "express";
import con from "../utils/db.js";

const router = express.Router();

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

//Para obtener la cantidad de ofertas
router.get("/cantidad_ofertas", (req, res) => {
  const sql = "SELECT COUNT(*) AS cantidad FROM ofertaslaborales";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
      cantidad: result[0].cantidad,
    });
  });
});

//contar la cantidad de masculino y femenino
router.get("/contarGenero", (req, res) => {
  const sql = "SELECT sexo, COUNT(*) as count FROM persona GROUP BY sexo";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
    });
  });
});

//contar los grados academicos
router.get("/contarGrados", (req, res) => {
  const sql =
    "SELECT gradoAcademicoId, COUNT(*) as count FROM titulado GROUP BY gradoAcademicoId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
    });
  });
});

//contar las modalidades de titulacion
router.get("/contarModalidades", (req, res) => {
  const sql =
    "SELECT modalidadTitulacionId, COUNT(*) as count FROM titulado GROUP BY modalidadTitulacionId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
    });
  });
});

//contar las formas de trabajo
router.get("/contarFormasTrabajo", (req, res) => {
  const sql =
    "SELECT formaTrabajoId, COUNT(*) as count FROM titulado GROUP BY formaTrabajoId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
    });
  });
});

//contar las areas de trabajo
router.get("/contarAreasTrabajo", (req, res) => {
  const sql =
    "SELECT areaTrabajoId, COUNT(*) as count FROM titulado GROUP BY areaTrabajoId";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({
      status: true,
      result: result,
    });
  });
});

export { router as reportesRouter };
