$(document).ready(function(){
    const socket = io('/');
    const $lobbyMessageForm = $('#LobbyMessageForm');
    const $lobbyMessage = $('#lobbyMessage');
    const $lobbyChat = $('#lobbyChat');

    $lobbyMessageForm.submit((evt) => {
        evt.preventDefault();
        $.post(`message`, {message: $lobbyMessage.val()});
    })

    //lobby message
    socket.on('new lobby message', data => {
        $lobbyChat.prepend('<div class="chat">' +'<b>' + data.lobbyUser + '</b>' + ' : '+ data.lobbyMsg + '</div>');
        $lobbyMessage.val('');
    });
});
