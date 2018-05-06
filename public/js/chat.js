$(document).ready(function(){
    const socket = io('/');
    //const $lobbyMessageForm = $('#lobbyMessageForm');
    const $lobbyMessage = $('#lobbyMessage');
    const $lobbyChat = $('#lobbyChat');
    //const $user = document.getElementById("lobbyUser").textContent;



    //lobby form
    /*
    $messageForm.submit(event =>{
        event.preventDefault();
        console.log("user is " + $user);
        socket.emit('send message', {message:$message.val(), user: $user});
        $message.val('');
    });
    */
    //lobby message
    socket.on('new lobby message', data => {
        $lobbyChat.prepend('<div class="chat">' + data.lobbyUser + ' : '+ data.lobbyMsg + '</div>');
        $lobbyMessage.val('');
    });

    //game form
    /*
    $gameMessageForm.submit(event =>{
        event.preventDefault();
        console.log("user is " + $gameUser);
        gameSocket.emit('send message', {message:$gameMessage.val(), user: $gameUser});
        $gameMessage.val('');
    });

    gameSocket.on('new game message', data =>{
        $gameChat.prepend('<div class="chat>' + data.gameUser + ':' + data.gameMsg + '</div>' );
    })
    //socket.on('new user', data=> {
    //  $users.append('<ul class="list-group">' + data.callback + '</ul>')
    //})
    */
});
