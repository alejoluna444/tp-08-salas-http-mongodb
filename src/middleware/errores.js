function manejarErrores(error, req, res, next) {
  void next;

  console.error("Error en la solicitud:", error.name || "Error inesperado");

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "El JSON enviado no tiene un formato válido.",
    });
  }

  // Errores de la API
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(500).json({
      error: "Ocurrió un error interno del servidor.",
    });
  }

  // Errores de las páginas HTML
  res.status(500).render("error", {
    titulo: "Error del servidor",
  });
}

module.exports = {
  manejarErrores,
};
