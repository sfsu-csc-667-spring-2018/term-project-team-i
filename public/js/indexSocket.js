$(document).ready(function(){
    const socket = io('/');
    const $lobbyMessage = $('#lobbyMessage');
    const $lobbyChat = $('#lobbyChat');

    //lobby message
    socket.on('new lobby message', data => {
        $lobbyChat.prepend('<div class="chat">' +'<b>' + data.lobbyUser + '</b>' + ' : '+ data.lobbyMsg + '</div>');
        $lobbyMessage.val('');
    });
});
