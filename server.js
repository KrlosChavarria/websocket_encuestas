const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Simulación de una base de datos
let respuestas = {};

// Servir archivos estáticos
app.use(express.static('public'));

// Middleware para "autenticar" con UUID (puede ser reemplazado por cualquier mecanismo real de autenticación)
function autenticar(socket, next) {
  const { uuid } = socket.handshake.query;
  if (!uuid) {
    return next(new Error('Autenticación fallida. UUID requerido.'));
  }
  // Para propósitos simples, permitimos que cualquier UUID funcione
  socket.uuid = uuid; // Guardamos el UUID del usuario en el socket
  next();
}

// Usar el middleware de autenticación para las conexiones de socket
io.use(autenticar);

// Cuando un cliente se conecta
io.on('connection', (socket) => {
  const uuid = socket.uuid;
  console.log(`Usuario con UUID: ${uuid} se ha conectado en tiempo real`);

  // Inicializamos respuestas para este usuario si no existen
  if (!respuestas[uuid]) {
    respuestas[uuid] = [];
  }

  // Recibir respuestas de preguntas en tiempo real
  socket.on('respuesta', (data) => {
    console.log(`Respuesta recibida de usuario ${uuid}: Pregunta ${data.preguntaId}, Respuesta: ${data.respuesta}`);

    // Guardar la respuesta en la base de datos simulada (organizado por UUID)
    respuestas[uuid].push({
      preguntaId: data.preguntaId,
      respuesta: data.respuesta
    });

    // Confirmar al cliente que se ha guardado
    socket.emit('respuestaGuardada', { mensaje: 'Respuesta guardada correctamente', data });
  });

  // Cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`Usuario con UUID: ${uuid} se ha desconectado en tiempo real`);
  });
});

// Ruta para ver las respuestas en formato JSON
app.get('/ver-respuestas', (req, res) => {
    res.json(respuestas); // Devuelve el objeto respuestas como JSON
  });

// Iniciar servidor
server.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
