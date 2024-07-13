import express from "express";
import con from "../utils/db.js";

const router = express.Router();

//para obtener las ofertas laborales
router.get("/obtener_ofertas", (req, res) => {
  const sql = "SELECT * from ofertaslaborales";
  con.query(sql, (err, result) => {
    if (err) return res.json({ status: false, Error: "Error en la consulta" });
    return res.json({ status: true, result: result });
  });
});

//para insertr las ofertas laborales
router.post("/add_ofertas", (req, res) => {
  const sql = `
  INSERT INTO ofertaslaborales
  (titulo, descripcion, empresa, ubicacion, salario, fechaVencimiento, telefono, estado) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    req.body.titulo,
    req.body.descripcion,
    req.body.empresa,
    req.body.ubicacion,
    req.body.salario,
    req.body.fechaVencimiento,
    req.body.telefono,
    req.body.estado,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        error: "Error en la consulta: " + err,
      });
    }

    return res.json({
      status: true,
      result: result,
    });
  });
});

//Para actualizar el estado
router.post("/editar_estado/:id", (req, res) => {
  const id = req.params.id;
  const nuevoEstado = req.body.estado;

  const sql = `UPDATE ofertaslaborales SET estado = ? Where id = ?`;
  const values = [nuevoEstado, id];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//para obtener ls ofertas laborales
router.get("/obtener_oferta/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * from ofertaslaborales WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" });
    return res.json({ status: true, result: result });
  });
});

//para editar las ofertas laborales
router.put("/editar_oferta/:id", (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE ofertaslaborales 
                set titulo = ?, descripcion = ?, empresa = ?, ubicacion = ?, salario = ?, fechaVencimiento = ?, telefono = ?, modified_by = ?
                Where id = ?`;
  const values = [
    req.body.titulo,
    req.body.descripcion,
    req.body.empresa,
    req.body.ubicacion,
    req.body.salario,
    req.body.fechaVencimiento,
    req.body.telefono,
    req.body.adminId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ status: false, Error: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

//Para borrar ofertas
router.delete("/eliminar_oferta/:id", (req, res) => {
  const id = req.params.id;
  const { adminId } = req.body;
  console.log(adminId);
  const sql =
    "UPDATE ofertaslaborales SET activo = FALSE, deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id = ?";
  con.query(sql, [adminId, id], (err, result) => {
    if (err)
      return res.json({ status: false, Error: "Error en la consulta" + err });
    return res.json({ status: true, result: result });
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

export { router as ofertasRouter };
