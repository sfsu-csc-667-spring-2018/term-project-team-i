const socketIo = require( 'socket.io' )
const { USER_JOINED, MESSAGE_SEND } = require( '../socket/events.js' )

// This is called within 'bin/www' for initialization.
const init = ( app, server ) => {
    const io = socketIo( server )

    app.set( 'io', io )

    /**
     * This indicates what the Server and Client may respond to.
     * 'connection' and 'disconnect' are reserved keywords from Socket.io
     * 
     * .emit( "custom-client-call-key" , ..., ...) is to broadcast to all connected Clients where
     *      they will respond using their own .on( ) function corresponding to "custom-client-call-key".
     * .on( "custom-server-responsive-key", ..., ... ) is for this Server to respond to an .emit( )
     *      broadcast from the Client, where this Server will respond according to if it has the 
     *      "custom-server-responsive-key" registered.
     * 
     * Ex:  S = Server; C = Client
     *      S.emit('server-message', 'Hello Client');
     *      C.on('server-message', (data) => {
     *          C.emit('client-response', "Hello to you Server");
     *      });
     * 
     *      S.on("client-response", (data) => {
     *          console.log ("I got a message back from Client.");
     *          console.log ("If I call S.emit('server-message', ...) again I can cause an infinite loop.");
     *      });
     */
    io.on( 'connection', socket => {
        socket.on( 'disconnect', data => {
            console.log( 'client disconnected' )
        });

        socket.on('client-message', data => {
            console.log("Client message: " + data);
            socket.emit('server-message', 'Hello Client');
        })
    });
  
}

module.exports = { init }
