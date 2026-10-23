const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const { crearRouterReservas } = require("./rutas/reservas");

function crearApp({ controlador, entorno }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  app.use(morgan(entorno === "production" ? "combined" : "dev"));

  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", {
      titulo: "Inicio",
    });
  });
  
app.get("/estado", async (req, res) => {
  res.json({
    cantidad: await controlador.contarReservas(),
    idSolicitud: req.idSolicitud,
  });
});


  app.use("/reservas", crearRouterReservas(controlador));

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
    });
  });

  return app;
}

module.exports = {
  crearApp,
};
