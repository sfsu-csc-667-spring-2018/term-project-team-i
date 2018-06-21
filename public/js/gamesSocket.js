$(document).ready(function(){
    const url = window.location.pathname.split('/games/')[1];
    const gameUsername = document.getElementById('hiddenName').innerHTML;
    const gameSocket = io('/games/' + url);
    const gameUserSocket = io('/games/' + url + '/' + gameUsername);
    const $actionMessage = $('.chessactions-card-body');
    const $gameForfeit = $('#game-forfeit');
    const $drawRequestForm = $('#form-draw-request');
    const chessboard = new Chessboard();
    chessboard.initialize();

    $drawRequestForm.submit((evt) => {
        evt.preventDefault();
        $.post(`${url}/draw-request`, {response: true}, (responseData) => {
            alert("Draw Request Sent!");
        });
    })

    $gameForfeit.submit((evt) => {
        evt.preventDefault();
        $.post(`${url}/forfeit`, {gameUsername: gameUsername}, (returnData) => {
            //alert(returnData.data);
        });
    })

    gameSocket.on('game-ended', data => {
        window.alert(data.data);
        window.location = '/';
    })

    gameSocket.on('skt-chess-board-refresh', data => {
        $('.chesspiece').remove();  //Clear all previous chess pieces.
        const updatedChessPieces = data.updatedChessPieces;
        
        for (let idx = 0; idx < updatedChessPieces.length; idx++) { 
            const updatedChessPiece = updatedChessPieces[idx];

            if (updatedChessPiece.alive) {
                const chessPieceElement =   `<img data-piece_id="${updatedChessPiece.pieceId}" data-piece_name="${updatedChessPiece.name}"
                                            data-piece_faction="${updatedChessPiece.faction}" class="chesspiece h-100 w-100" 
                                            src="images/${updatedChessPiece.faction+updatedChessPiece.name}.png">`;


                $(`.chesscell[data-coordinate_x=${updatedChessPiece.raw_coordinate_x}][data-coordinate_y=${updatedChessPiece.raw_coordinate_y}]`).append(chessPieceElement);
                chessboard.setChessPieceHighlights();
            }
        }
    });

    gameUserSocket.on('skt-chess-move-piece-message', data => {
        for (let i = 0; i < data.message.length; i++) {
            $actionMessage.append('<p>' + data.message[i] + '</p>' );
        }
    });


    gameUserSocket.on('skt-chess-upgrade-pawn', data => {
        
        const $gameModal = $('#gameModal'); 
        const $gameModalTitle = $('#gameModalTitle');
        const $upgradePawnSubmitBtn = $('#upgradePawnSubmitBtn');   

        $gameModal.modal('show');
        $gameModalTitle.html(`Upgrade Pawn`);
        $upgradePawnSubmitBtn.click(() => {

            $gameModal.modal('hide');
            const movementData = {
                pieceId: data.pieceId,
                coordinate_x: data.raw_coordinate_x,
                coordinate_y: data.raw_coordinate_y,
                destination_x: data.raw_destination_x,
                destination_y: data.raw_destination_y,
                pawnUpgradeName: $('input[name="pawnUpgradeOptions"]:checked', '#upgradePawnForm').val()
            }
            
            chessboard.sendAjax('POST', movementData, '/move-piece');
        
        })
    
    })

    // Responding to opponent's draw request.
    gameUserSocket.on('skt-chess-opponent-draw-request', data => {
        const $drawModal = $('#drawModal');
        const $drawAcceptBtn = $('#btn-draw-accept');
        const $drawDeclineBtn = $('#btn-draw-decline');
        
        $drawModal.modal('show');
        $drawAcceptBtn.click(() => {
            $drawModal.modal('hide');
            $.post(`${url}/draw-response`, {response: true}, (responseData) => {
                alert('You have accepted the draw!');
                window.location = '/';
            });
        })

        $drawDeclineBtn.click(() => {
            $drawModal.modal('hide');
            $.post(`${url}/draw-response`, {response: false}, (responseData) => {
                console.log("Draw Declined!");
            });
        })
    })

    // Receiving opponent's draw response
    gameUserSocket.on('skt-chess-opponent-draw-response', data => {

        if (data.response === 'true') {
            alert("Opponent has accepted the draw!");
            window.location = '/';
        } else {
            alert('Opponent has declined the draw!');
            $drawRequestForm.find('button').html('Draw');
        }
    });

    /*
    gameUserSocket.on('upgrade-pawn-prompt', data => {
        $actionMessage.append('<div class="actions">' + 'Choose Upgrade ' + '</div>' );

        const upgradePawnOptions = ['queen', 'bishop', 'knight', 'rook'];

        $('body').append(`<div id="upgrade-pawn-container">`);
        for (let i = 0; i < upgradePawnOptions.length; i++) {
            $('body').append
            (
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

    });
    */
});