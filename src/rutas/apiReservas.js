const express = require("express");

function crearRouterApiReservas(controlador) {
  const router = express.Router();

  router.get("/", controlador.listar);

  router.get("/:id", controlador.buscarPorId);

  router.post("/", controlador.crear);

  return router;
}

module.exports = {
  crearRouterApiReservas,
};
