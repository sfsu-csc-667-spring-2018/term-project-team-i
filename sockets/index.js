const socketIo = require('socket.io');

let users = [];
let connections = [];
let gameConnections = [];

const init = (app, server) => {
    const io = socketIo(server);
    app.set('io', io);

    const indexRoute = io.of('/');
    const gameRoute = io.of('/games/:gameId');
    //socket connect
    indexRoute.on('connection', socket => {
        connections.push(socket);
        console.log('Lobby connected: %s, lobby sockets connected', connections.length);

        socket.on('disconnect', () => {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Lobby Disconnected: %s sockets connected', connections.length);
        });

        /*
        socket.on('send message', data =>{
            console.log('Chat lobby msg: ' + data.user + ' : ' + data.message);
            indexRoute.emit('new lobby message', {lobbyUser: data.user, lobbyMsg: data.message});
        })
        */


    });


    gameRoute.on('connection', socket => {
        gameConnections.push(socket);
        console.log('Game connected: %s, game sockets connected', connections.length);

        socket.on('disconnect', () => {
            gameConnections.splice(gameConnections.indexOf(socket), 1);
            console.log('Game Disconnected: %s sockets connected', gameConnections.length);
        })
        /*
        socket.on('send message', data =>{
            console.log('Game chat msg: ' + data.user + ': ' + data.message);
            gameRoute.emit('new game message', {gameUser: data.user, gameMsg: data.message})
        })
    })
    */
    });
};

module.exports = {init};