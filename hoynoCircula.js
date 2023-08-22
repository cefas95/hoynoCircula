const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'HoynoCircula',
  password: 'cefas2018',
  port: 5432,
});

client.connect();

class HoyNoCircula {
    constructor(matricula, fecha, hora) {
      this.matricula = matricula;
      this.fecha = fecha;
      this.hora = hora;
    }
  
    async verificarCirculacion() {
      // Realizar consultas a la base de datos para verificar restricciones
      const query = `
        SELECT COUNT(*) as count
        FROM vehiculos
        WHERE matricula = $1
          AND fecha = $2
          AND hora = $3;
      `;
  
      const values = [this.matricula, this.fecha, this.hora];
      const result = await client.query(query, values);
  
      // El resultado debe ser 0 si el vehículo no puede circular, y mayor a 0 si puede
      return result.rows[0].count === 0;
    }
  }
// Crear una instancia del predictor con los valores deseados
const predictor = new HoyNoCircula('jml141', '2023-08-22', '08:00');

// Verificar si el vehículo puede circular
predictor.verificarCirculacion()
  .then(puedeCircular => {
    if (puedeCircular) {
      console.log('El vehículo puede circular.');
    } else {
      console.log('El vehículo no puede circular.');
    }

    // Cierra la conexión a la base de datos
    client.end();
  })
  .catch(error => {
    console.error('Error:', error);
    client.end();
  });
  