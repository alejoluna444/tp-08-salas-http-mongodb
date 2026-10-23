const { MongoClient } = require("mongodb");

require("dotenv").config();

const uri = process.env.MONGODB_URI;

const cliente = new MongoClient(uri);

async function conectarDB() {
    try {
        await cliente.connect();
        console.log("Conexión a MongoDB Atlas exitosa");

        return cliente.db("reservasSalas");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        throw error;
    }
}

module.exports = {
    conectarDB
};
