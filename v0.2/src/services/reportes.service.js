const { Estudiante, Nota, Materia } = require('../libs/sequelize');

// Servicio de reportes (puedes conectar a la base de datos real si lo deseas)

async function obtenerAsistencia() {
  // Ejemplo: contar estudiantes y simular presentes/ausentes (puedes ajustar la lógica según tu modelo real)
  const total = await Estudiante.count();
  // Aquí podrías tener una tabla de asistencias real, pero como ejemplo:
  const presentes = Math.floor(total * 0.93); // 93% presentes
  const ausentes = total - presentes;
  return {
    fecha: new Date().toISOString().slice(0, 10),
    presentes,
    ausentes
  };
}

async function obtenerRendimiento() {
  // Promedio de notas por materia
  const materias = await Materia.findAll();
  const resultados = [];
  for (const materia of materias) {
    const notas = await Nota.findAll({ where: { codigo_materia: materia.codigo_materia } });
    let promedio = null;
    if (notas.length > 0) {
      promedio = notas.reduce((acc, n) => acc + n.valor, 0) / notas.length;
      promedio = Math.round(promedio * 100) / 100;
    }
    resultados.push({ nombre: materia.nombre, promedio });
  }
  return { materias: resultados };
}

module.exports = {
  obtenerAsistencia,
  obtenerRendimiento
};
