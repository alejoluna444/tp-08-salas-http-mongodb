const { MongoClient } = require("mongodb");

require("dotenv").config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Falta configurar MONGODB_URI en el archivo .env");
}

const cliente = new MongoClient(uri);

let db;

async function conectarDB() {
  try {
    await cliente.connect();

    db = cliente.db("reservas_salas_u8");

    console.log("Conexión a MongoDB Atlas exitosa");

    return db;
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    throw error;
  }
}

async function cerrarDB() {
  await cliente.close();
  console.log("Conexión a MongoDB cerrada");
}

module.exports = {
  conectarDB,
  cerrarDB,
};
