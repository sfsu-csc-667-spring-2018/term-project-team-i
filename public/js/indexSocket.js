$(document).ready(function(){
    const socket = io('/');
    const $lobbyMessage = $('#lobbyMessage');
    const $lobbyChat = $('#lobbyChat');

    //lobby message
    socket.on('new lobby message', data => {
        $lobbyChat.prepend('<div class="chat">' + data.lobbyUser + ' : '+ data.lobbyMsg + '</div>');
        $lobbyMessage.val('');
    });
});
