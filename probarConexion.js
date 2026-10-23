
const { conectarDB } = require("./config/database");

async function probarConexion() {
    try {
        const db = await conectarDB();

        console.log("Base de datos seleccionada:", db.databaseName);

        await db.command({ ping: 1 });

        console.log("Prueba de conexión completada correctamente");
    } catch (error) {
        console.error("No se pudo conectar:", error.message);
    } finally {
        process.exit();
    }
}

probarConexion();
