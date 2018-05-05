const socketIo = require('socket.io');

let users = [];
let connections = [];

const init = (app, server) =>{
  const io = socketIo(server);
  app.set('io', io);

  const indexRoute = io.of('/');
  //socket connect
    indexRoute.on('connection', socket =>{
        connections.push(socket);
        console.log('Lobby connected: %s, lobby sockets connected', connections.length);

        socket.on('disconnect', () => {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length );
        });


        socket.on('send message', data =>{
            console.log('Chat lobby msg: ' + data.user + ' : ' + data.message);
            indexRoute.emit('new lobby message', {lobbyUser: data.user, lobbyMsg: data.message});
        })


    });

};

module.exports = {init};