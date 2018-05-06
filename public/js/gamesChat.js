$(document).ready(function(){
    const gameSocket = io('/games/' + '');
    // const $gameMessageForm = $('#gameMessageForm');
    const $gameMessage = $('#gameMessage');
    const $gameChat = $('#gameChat');
    //const $gameUser = document.getElementById("gameUser").textContent;

    //game message
    gameSocket.on('new game message', data =>{
        $gameChat.prepend('<div class="gameChat>' + data.gameUser + ':' + data.gameMsg + '</div>' );
        $gameMessage.val('');
    })
});