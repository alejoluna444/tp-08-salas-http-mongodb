
function crearServicioReservas(db) {
  const coleccion = db.collection("reservas");

  async function listar() {
    return await coleccion.find().sort({ id: 1 }).toArray();
  }

  async function buscarPorId(id) {
    return await coleccion.findOne({ id: id });
  }

  async function contar() {
    return await coleccion.countDocuments();
  }

  async function crear(datos) {
    const ultimaReserva = await coleccion
      .find()
      .sort({ id: -1 })
      .limit(1)
      .next();

    const nuevoId = ultimaReserva ? ultimaReserva.id + 1 : 1;

    const nuevaReserva = {
      id: nuevoId,
      ...datos,
    };

    await coleccion.insertOne(nuevaReserva);

    return nuevaReserva;
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
