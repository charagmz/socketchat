const {Socket} = require('socket.io');


const socketController = (socket = new Socket()) => {
    //console.log('cliente conectado', socket.id);

    console.log(socket.handshake.headers['x-token']);
}

module.exports = {
    socketController
}