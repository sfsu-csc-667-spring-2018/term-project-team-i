$(document).ready(function(){
    const socket = io.connect();
    const $messageForm = $('#lobbyMessageForm');
    const $message = $('#lobbyMessage');
    const $chat = $('#lobbyChat');
    const $user = document.getElementById("lobbyUser").textContent;

    const gameSocket = io.connect('/games/:gameid');
    const $gameMessageForm = $('#gameMessageForm');
    const $gameMessage = $('#gameMessage')
    const $gameChat = $('#gameChat');
    const $gameUser = document.getElementById("gameUser").textContent;

    //lobby form
    $messageForm.submit(event =>{
        event.preventDefault();
        console.log("user is " + $user);
        socket.emit('send message', {message:$message.val(), user: $user});
        $message.val('');
    });


    socket.on('new lobby message', data => {
        $chat.prepend('<div class="chat">' + data.lobbyUser + ' : '+ data.lobbyMsg + '</div>');
    });

    //game form
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
});
