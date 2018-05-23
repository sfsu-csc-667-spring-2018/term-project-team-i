$(document).ready(function(){
    const url = window.location.pathname.split('/games/')[1];
    const gameUsername = document.getElementById('hiddenName').innerText;
    const gameSocket = io('/games/' + url);
    const gameUserSocket = io('/games/' + url + '/' + gameUsername);

    const $gameMessageForm = $('#gameMessageForm');
    const $gameMessage = $('#gameMessage');
    const $gameChat = $('#gameChat');
    const $actionMessage = $('.actions');

    $gameMessageForm.submit((evt) => {
        evt.preventDefault();
        $.post(`${url}/message`, {gameMessage: $gameMessage.val()});
    })

    gameSocket.on('game-ended', data => {
        window.alert(data.data);
        window.location = '/';
    })

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

                $(`.chessCell[data-coordinate_x='${updatedChessPiece.raw_coordinate_x}'][data-coordinate_y='${updatedChessPiece.raw_coordinate_y}']`).append(chessPieceElement);
            }
        }
    });

    gameSocket.on('move-message', data=>{
        $actionMessage.append('<div class="actions">' + data.message + '</div>' );
    });

    gameUserSocket.on('upgrade-pawn-prompt', data => {
        $actionMessage.append('<div class="actions">' + 'Choose Upgrade ' + '</div>' );

        const upgradePawnOptions = ['queen', 'bishop', 'knight', 'rook'];

        $('body').append(`<div id="upgrade-pawn-container">`);
        for (let i = 0; i < upgradePawnOptions.length; i++) {
            $('body').append
            (
                //`<input type="button" value="${upgradePawnOptions[i]}" id="closeInput" name="${upgradePawnOptions[i]}">`



                `<form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                <input type="hidden" value="${upgradePawnOptions[i]}" name="pieceName">
                <input type="hidden" value="${data.pieceId}" name="pieceId">
                <input type="hidden" value="${data.x}" name="x">
                <input type="hidden" value="${data.y}" name="y">
                <input type="submit" value="${upgradePawnOptions[i]}" id="closeInput" name="${upgradePawnOptions[i]}">
                </form>`
            )
        }

        $('body').append(`</div>`);

        /*
        $('body').append(`<div id="upgrade-pawn-container">
                          <form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                            <input type="hidden" value=queen name="pieceName">
                            <input type="hidden" value="${data.pieceId}" name="pieceId">
                            <input type="hidden" value="${data.x}" name="x">
                            <input type="hidden" value="${data.y}" name="y">
                            <input type="submit" value="Queen" id="closeInput" name="QUEEN">
                          </form>
                            <form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                            <input type="hidden" value=bishop name="pieceName">
                            <input type="hidden" value="${data.pieceId}" name="pieceId">
                            <input type="hidden" value="${data.x}" name="x">
                            <input type="hidden" value="${data.y}" name="y">
                            <input type="submit" value="Bishop" id="closeInput" name="BISHOP">
                          </form>
                          <form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                            <input type="hidden" value=rook name="pieceName">
                            <input type="hidden" value="${data.pieceId}" name="pieceId">
                            <input type="hidden" value="${data.x}" name="x">
                            <input type="hidden" value="${data.y}" name="y">
                            <input type="submit" value="Rook" id="closeInput" name="ROOK">
                          </form>
                          <form class="upgrade-pawn-form" method="POST" action="/games/${url}/upgrade-pawn">
                            <input type="hidden" value=knight name="pieceName">
                            <input type="hidden" value="${data.pieceId}" name="pieceId">
                            <input type="hidden" value="${data.x}" name="x">
                            <input type="hidden" value="${data.y}" name="y">
                            <input type="submit" value="Knight" id="closeInput" name="KNIGHT">
                          </form>
                          </div>`*/

        //);

        //${data.pieceId}, ${data.x}, ${data.y}
        console.log("MESSAGE RECIEVED" + data.playerName);
        console.log("Piece id is: " +  data.pieceId + " X is : " + data.x + " Y is : " + data.y);

    });
});