const salasValidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const turnosValidos = ["Mañana", "Tarde", "Noche"];

function validarDatosReserva(datos) {
  const errores = [];

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return ["Los datos de la reserva no son válidos."];
  }

  if (typeof datos.estudiante !== "string" || !datos.estudiante.trim()) {
    errores.push("El estudiante es obligatorio.");
  }

  if (typeof datos.email !== "string" || !datos.email.trim().includes("@")) {
    errores.push("El email debe contener @.");
  }

  if (
    typeof datos.sala !== "string" ||
    !salasValidas.includes(datos.sala.trim())
  ) {
    errores.push("La sala seleccionada no es válida.");
  }

  if (typeof datos.fecha !== "string" || !datos.fecha.trim()) {
    errores.push("La fecha es obligatoria.");
  }

  if (
    typeof datos.turno !== "string" ||
    !turnosValidos.includes(datos.turno.trim())
  ) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (
    typeof datos.personas !== "number" ||
    !Number.isInteger(datos.personas) ||
    datos.personas < 1 ||
    datos.personas > 6
  ) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  return errores;
}

function prepararReserva(datos) {
  const errores = validarDatosReserva(datos);

  if (errores.length > 0) {
    throw new Error(errores.join(" "));
  }

  return {
    estudiante: datos.estudiante.trim(),
    email: datos.email.trim(),
    sala: datos.sala.trim(),
    fecha: datos.fecha.trim(),
    turno: datos.turno.trim(),
    personas: datos.personas,
    estado: "pendiente",
  };
}

module.exports = {
  validarDatosReserva,
  prepararReserva,
};
