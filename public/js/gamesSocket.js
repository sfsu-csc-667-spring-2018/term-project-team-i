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
    });

    gameSocket.on('chessboard-refresh', data => {
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
});