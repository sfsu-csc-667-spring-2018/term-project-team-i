const socketIo = require('socket.io');

let users = [];
let connections = [];

const init = (app, server) =>{
  const io = socketIo(server);
  app.set('io', io);

  app.use((request, response, next) =>{
      response.io = io;
      next();
  })

  //socket connect
  io.on('connection', socket =>{
      connections.push(socket);
      console.log('Connected: %s, sockets connected', connections.length);

      //socket disconnect
      socket.on('disconnect', data => {
          connections.splice(connections.indexOf(socket), 1);
          console.log('Disconnected: %s sockets connected', connections.length );
      });

      //messages
      socket.on('send message', data =>{
          io.sockets.emit('new message', {msg: data});
      });

      //Logged in user
      //socket.on('user')
  })};

module.exports = {init};