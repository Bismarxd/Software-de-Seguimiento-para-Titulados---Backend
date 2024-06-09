import express from "express";
import cors from "cors";
import { loginRouter } from "./routes/LoginRoute.js";
import { tituladoRouter } from "./routes/TituladoRoute.js";
import { datosTituladosRouter } from "./routes/DatosTituladosRoutes.js";
import { postTitulacionRouter } from "./routes/PostTitulacionRoute.js";
import { ofertasRouter } from "./routes/OfertasRoute.js";
import { registroRouter } from "./routes/Registro.js";
import { administradoresRouter } from "./routes/AdministradoresRoutes.js";
import { reportesRouter } from "./routes/Reportes.js";

const app = express();

//Soluciona el error de cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
//carpeta public como predeterminado
app.use(express.static("public"));

//Crea las rutas el backend
app.use("/auth", loginRouter);
app.use("/titulado", tituladoRouter);
app.use("/titulado", datosTituladosRouter);
app.use("/titulado", postTitulacionRouter);
app.use("/ofertas", ofertasRouter);
app.use("/registro", registroRouter);
app.use("/administradores", administradoresRouter);
app.use("/reportes", reportesRouter);

app.listen(8000, () => {
  console.log("El servidor esta corriendo");
});
