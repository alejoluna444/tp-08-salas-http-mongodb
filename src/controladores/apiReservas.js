const { validarDatosReserva } = require("../modelos/reserva");

function crearControladorApiReservas(servicio) {
  const salasValidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

  async function listar(req, res) {
    const sala = req.query.sala;

    if (Array.isArray(sala)) {
      return res.status(400).json({
        error: "El parámetro sala debe enviarse una sola vez.",
      });
    }

    if (sala !== undefined && !salasValidas.includes(sala)) {
      return res.status(400).json({
        error: "La sala indicada no es válida.",
      });
    }

    const reservas = await servicio.listar(sala);

    res.status(200).json(reservas);
  }

  async function buscarPorId(req, res) {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        error: "El identificador no tiene un formato válido.",
      });
    }

    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "No se encontró la reserva solicitada.",
      });
    }

    res.status(200).json(reserva);
  }

  async function crear(req, res) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON.",
      });
    }

    const datos = {
      estudiante: req.body.estudiante,
      email: req.body.email,
      sala: req.body.sala,
      fecha: req.body.fecha,
      turno: req.body.turno,
      personas: req.body.personas,
    };

    const errores = validarDatosReserva(datos);

    if (errores.length > 0) {
      return res.status(400).json({
        error: errores.join(" "),
      });
    }

    const reserva = await servicio.crear(datos);

    res.status(201).location(`/api/reservas/${reserva.id}`).json(reserva);
  }

  return {
    listar,
    buscarPorId,
    crear,
  };
}

module.exports = {
  crearControladorApiReservas,
};
