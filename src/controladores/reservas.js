function crearControladorReservas(servicio) {
  async function listarReservas(req, res) {
    const reservas = await servicio.listar();

    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: "",
      datos: {},
    });
  }

  async function mostrarDetalle(req, res) {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
      });
    }

    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
      });
    }

    res.render("reservas/detalle", {
      titulo: "Detalle de reserva",
      reserva,
    });
  }

  async function crearReserva(req, res) {
    await servicio.crear(req.reservaValidada);

    res.redirect("/reservas");
  }

  async function contarReservas() {
    return await servicio.contar();
  }

  return {
    listarReservas,
    mostrarFormulario,
    mostrarDetalle,
    crearReserva,
    contarReservas,
  };
}

module.exports = {
  crearControladorReservas,
};
