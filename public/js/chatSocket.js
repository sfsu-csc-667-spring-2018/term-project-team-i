$(document).ready(function(){
    const wpn = window.location.pathname;
    const pathNoEndFwdSlash = (wpn.slice(-1) === '/') ? "" : `${wpn}/`;
    const socket = io(wpn);
    const $chatMessageForm = $('#chatMessageForm');
    const $chatMessage = $('#chatMessage');
    const $chatDisplay = $('#chatDisplay');

    $chatMessageForm.submit((evt) => {
        evt.preventDefault();
        $.post(`${pathNoEndFwdSlash}message`, {message: $chatMessage.val()});
    })

    socket.on('socket-chat-message', data => {
        $chatDisplay.prepend('<div class="chat">' +'<b>' + data.chatUser + '</b>' + ' : '+ data.chatMessage + '</div>');
        $chatMessage.val('');
    });

});