const { conectarDB, cerrarDB } = require("./config/database");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearApp } = require("./app");
const { configuracion } = require("./configuracion");

let servidor;

async function iniciarServidor() {
  try {
    const db = await conectarDB();

    const servicio = crearServicioReservas(db);
    const controlador = crearControladorReservas(servicio);

    const app = crearApp({
      controlador,
      servicio,
      entorno: configuracion.entorno,
    });

    servidor = app.listen(configuracion.puerto, () => {
      console.log(
        `Servidor escuchando en http://localhost:${configuracion.puerto}`,
      );
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exitCode = 1;
  }
}

async function detenerServidor() {
  console.log("\nCerrando aplicación...");

  try {
    if (servidor) {
      await new Promise((resolve, reject) => {
        servidor.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await cerrarDB();

    process.exit(0);
  } catch (error) {
    console.error("Error al cerrar la aplicación:", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", detenerServidor);
process.on("SIGTERM", detenerServidor);

iniciarServidor();
