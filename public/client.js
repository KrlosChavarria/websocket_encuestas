// Conectar con el servidor usando Socket.io
const socket = io();

// Función para enviar respuestas
function enviarRespuesta(preguntaId, respuesta) {
  // Enviar la respuesta al servidor
  socket.emit('respuesta', { preguntaId, respuesta });

  // Mostrar un mensaje al recibir confirmación del servidor
  socket.on('respuestaGuardada', (data) => {
    document.getElementById('mensaje').innerText = data.mensaje;
    console.log(`Respuesta guardada en el servidor: ${data.data.respuesta}`);
  });
}
