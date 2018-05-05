$(document).ready(function(){
    const socket = io.connect();
    const $messageForm = $('#lobbyMessageForm');
    const $message = $('#lobbyMessage');
    const $chat = $('#lobbyChat');
    const $user = document.getElementById("lobbyUser").textContent;


    $messageForm.submit(event =>{
        event.preventDefault();
        console.log("user is " + $user);
        socket.emit('send message', {message:$message.val(), user: $user});
        $message.val('');
    });


    socket.on('new lobby message', data => {
        $chat.prepend('<div class="chat">' + data.lobbyUser + ' : '+ data.lobbyMsg + '</div>');
    });

    //socket.on('new user', data=> {
    //  $users.append('<ul class="list-group">' + data.callback + '</ul>')
    //})
});
