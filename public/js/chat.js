$(document).ready(function(){
    const socket = io.connect();
    const $messageForm = $('#messageForm');
    const $message = $('#message');
    const $chat = $('#chat');
    const $users = $('#users');

    $messageForm.submit(error =>{
        error.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', data => {
        $chat.append('<div class="well">' + data.msg + '</div>');
    })

    //socket.on('new user', data=> {
      //  $users.append('<ul class="list-group">' + data.callback + '</ul>')
    //})
});