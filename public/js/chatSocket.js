$(document).ready(function(){
    const socket = io('/');
    const $chatMessageForm = $('#chatMessageForm');
    const $chatMessage = $('#chatMessage');
    const $chatDisplay = $('#chatDisplay');

    $chatMessageForm.submit((evt) => {
        evt.preventDefault();
        $.post(`message`, {message: $chatMessage.val()});
    })

    socket.on('new lobby message', data => {
        $chatDisplay.prepend('<div class="chat">' +'<b>' + data.lobbyUser + '</b>' + ' : '+ data.lobbyMsg + '</div>');
        $chatMessage.val('');
    });

});