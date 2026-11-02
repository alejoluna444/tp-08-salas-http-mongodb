const { ObjectId } = require("mongodb");
const { prepararReserva } = require("../modelos/reserva");

function crearServicioReservas(db) {
  const coleccion = db.collection("reservas");

  function convertirReserva(documento) {
    const { _id, ...datos } = documento;

    return {
      id: _id.toString(),
      ...datos,
    };
  }

  async function listar(sala) {
    const criterio = {};

    if (sala !== undefined) {
      criterio.sala = sala;
    }

    const documentos = await coleccion
      .find(criterio)
      .sort({ _id: 1 })
      .toArray();

    return documentos.map(convertirReserva);
  }

  async function buscarPorId(id) {
    const documento = await coleccion.findOne({
      _id: new ObjectId(id),
    });

    if (!documento) {
      return null;
    }

    return convertirReserva(documento);
  }

  async function contar() {
    return await coleccion.countDocuments();
  }

  async function crear(datos) {
    const nuevaReserva = prepararReserva(datos);

    const resultado = await coleccion.insertOne(nuevaReserva);

    return {
      id: resultado.insertedId.toString(),
      ...nuevaReserva,
    };
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = {
  crearServicioReservas,
};
