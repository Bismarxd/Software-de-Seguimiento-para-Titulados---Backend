import mysql from 'mysql2'

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "software_de_seguimiento_para_titulados"
});

con.connect(function (err) {
  if (err) {
    console.log('Error en la conexión'+ err.message);
  } else {
    console.log('base de datos conectada correctamente');
  }
})

export default con;