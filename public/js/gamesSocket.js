$(document).ready(function(){
    const url = window.location.pathname.split('/games/')[1];
    const gameUsername = document.getElementById('hiddenName').innerText;
    const gameSocket = io('/games/' + url);
    const gameUserSocket = io('/games/' + url + '/' + gameUsername);

    // const $gameMessageForm = $('#gameMessageForm');
    const $gameMessage = $('#gameMessage');
    const $gameChat = $('#gameChat');
    const $actionMessage = $('.actions');

    //const $gameUser = document.getElementById("gameUser").textContent;
    gameSocket.on('game-new-message', data =>{
        $gameChat.prepend('<div class="chat" id="gameChat">' + '<b>' + data.gameUser + '</b>' +': ' + data.gameMsg + '</div>' );
        $gameMessage.val('');
    });

    gameSocket.on('game-chessboard-refresh', data => {
        $('.chessPiece').remove();  //Clear all previous chess pieces.
        const updatedChessPieces = data.updatedChessPieces;

        for (let idx = 0; idx < updatedChessPieces.length; idx++) {
            const updatedChessPiece = updatedChessPieces[idx];

            if (updatedChessPiece.alive) {
                const chessPieceElement =   `<img data-piece_id="${updatedChessPiece.pieceId}" data-piece_name="${updatedChessPiece.name}"
                                            data-piece_faction="${updatedChessPiece.faction}" class="chessPiece" 
                                            src="images/${updatedChessPiece.faction+updatedChessPiece.name}.png">`;

                $(`.chessCell[data-coordinate_x='${updatedChessPiece.raw_coordinate_x}'][data-coordinate_y='${updatedChessPiece.raw_coordinate_y}'`).append(chessPieceElement);
            }
        }
    });

    gameUserSocket.on('upgrade-pawn-prompt', data => {
        $actionMessage.append('<div class="actions">' + 'Choose Upgrade ' + '</div>' );

        $('body').append(`<form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                            <input type="submit" value="Queen" id="closeInput">
                            <input type="submit" value="Bishop" id="closeInput">
                            <input type="submit" value="Rook" id="closeInput">
                            <input type="submit" value="Knight" id="closeInput">
                          </form>`
        );

        console.log("MESSAGE RECIEVED" + data.playerName);
        console.log("Piece id is: " +  data.pieceId + " X is : " + data.x + " Y is : " + data.y);

    });

});