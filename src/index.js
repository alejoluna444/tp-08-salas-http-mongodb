
const { obtenerConfiguracion } = require("./configuracion");
const { conectarDB } = require("../config/database");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearApp } = require("./app");

const datosIniciales = [
  {
    estudiante: "Juan Pérez",
    email: "juan@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-25",
    turno: "Mañana",
    personas: 2,
  },
  {
    estudiante: "María López",
    email: "maria@gmail.com",
    sala: "Sala Sur",
    fecha: "2026-09-25",
    turno: "Tarde",
    personas: 4,
  },
  {
    estudiante: "Pedro Gómez",
    email: "pedro@gmail.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-26",
    turno: "Noche",
    personas: 3,
  },
  {
    estudiante: "Lucía Fernández",
    email: "lucia@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-27",
    turno: "Mañana",
    personas: 1,
  },
];

async function iniciarServidor() {
  const configuracion = obtenerConfiguracion();

  const db = await conectarDB();

  const servicio = crearServicioReservas(db);

  if ((await servicio.contar()) === 0) {
    for (const reserva of datosIniciales) {
      await servicio.crear(reserva);
    }

    console.log("Reservas iniciales cargadas");
  }

  const controlador = crearControladorReservas(servicio);

  const app = crearApp({
    controlador,
    entorno: configuracion.entorno,
  });

  app.listen(configuracion.puerto, () => {
    console.log(
      `Servidor funcionando en http://localhost:${configuracion.puerto}`,
    );
  });
}

iniciarServidor().catch((error) => {
  console.error("Error al iniciar la aplicación:", error.message);
  process.exitCode = 1;
});
