const socketIo = require('socket.io');

let users = [];
let connections = [];

const init = (app, server) => {
    const io = socketIo(server);
    app.set('io', io);

    const indexRoute = io.of('/');

    //socket connect
    indexRoute.on('connection', socket => {
        connections.push(socket);

        socket.on('disconnect', () => {
            connections.splice(connections.indexOf(socket), 1);
        });

    });
};

module.exports = {init};