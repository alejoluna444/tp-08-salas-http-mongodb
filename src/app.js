const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const { manejarErrores } = require("./middleware/errores");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterApiReservas } = require("./rutas/apiReservas");
const { crearControladorApiReservas } = require("./controladores/apiReservas");

function crearApp({ controlador, servicio, entorno }) {
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

  // Página principal
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Inicio" });
  });

  // Estado de la base de datos
  app.get("/estado", async (req, res) => {
    const cantidad = await controlador.contarReservas();

    res.json({
      cantidad,
      idSolicitud: res.locals.solicitudId,
    });
  });

  // Rutas HTML
  app.use("/reservas", crearRouterReservas(controlador));

  // Rutas API
  const controladorApi = crearControladorApiReservas(servicio);

  app.use("/api/reservas", crearRouterApiReservas(controladorApi));

  // Ruta para direcciones inexistentes
  app.use((req, res) => {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({
        error: "Ruta API no encontrada.",
      });
    }

    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
    });
  });

  // Middleware de errores: siempre al final
  app.use(manejarErrores);

  return app;
}

module.exports = {
  crearApp,
};
