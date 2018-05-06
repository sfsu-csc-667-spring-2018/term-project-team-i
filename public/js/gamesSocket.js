$(document).ready(function(){
    const url = window.location.pathname.split('/games/')[1];
    const gameSocket = io('/games/' + url);
    // const $gameMessageForm = $('#gameMessageForm');
    const $gameMessage = $('#gameMessage');
    const $gameChat = $('#gameChat');
    //const $gameUser = document.getElementById("gameUser").textContent;

    //game message
    gameSocket.on('new game message', data =>{
        $gameChat.prepend('<div class="chat" id="gameChat">' + data.gameUser + ': ' + data.gameMsg + '</div>' );
        $gameMessage.val('');
    })
});