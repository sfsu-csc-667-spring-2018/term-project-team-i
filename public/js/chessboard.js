class Chessboard {

    constructor () {
        this.selectedCells = {
            cellElement1: null,
            cellElement2: null
        };
        
        /* Element Class and ID names */
        this.playerNameID = 'hiddenName';
        this.playerFactionID = 'hiddenFaction';
        this.classChessCell = "chesscell";
        this.classChessPiece = "chesspiece";
        this.movepieceRoute = '/move-piece';

        this.playerFactionName = document.querySelector(`#${this.playerFactionID}`).innerHTML;
        console.log("You are " + this.playerFactionName);
    }

    initialize() {
        this.setSelectionListenersToCells();
        this.setChessPieceHighlights();
    }

    /**
     * Determines if the givene element possesses a chess piece element.
     * It will return the chess piece element if true, but the boolean false otherwise.
     * @param {HTMLElement} chessCellElement The parent element to find the child under.
     */
    __getSelectedChessPiece(chessCellElement = this.classChessCell) {
        return chessCellElement.querySelector("."+this.classChessPiece);
    }

    clearSelection() {
        this.selectedCells.cellElement1 = null;
        this.selectedCells.cellElement2 = null;
    }

    /**
     * 
     * @param {*} chessCellClassName 
     */
    setSelectionListenersToCells(classChessCell = this.classChessCell) {
        const command = 'click';
        const chessCellElements = document.querySelectorAll("."+classChessCell);

        //1. Set 'onclick' event for every class of 'chessCell' HTMLElement.
        for (let cceIdx = 0; cceIdx < chessCellElements.length; cceIdx++) {
            const chessCellElement = chessCellElements[cceIdx];
            
            chessCellElement.addEventListener(command, () => {
                this.addCellSelectedElement(chessCellElement);
                this.sendCellSelectedElements();
            });
        }
    }

    setChessPieceHighlights(classChessPiece = this.classChessPiece) {
        const chessPieces = document.querySelectorAll(`.${classChessPiece}`);

        for (let i = 0; i < chessPieces.length; i++) {
            /** @type {HTMLElement} */
            const chessPiece = chessPieces[i];

            if (chessPiece.dataset.piece_faction == this.playerFactionName) {
                chessPiece.addEventListener('mouseover', (evt) => {
                    chessPiece.style.backgroundColor = "#00FF00";
                });
                chessPiece.addEventListener('mouseleave', (evt) => {
                    chessPiece.style.backgroundColor = "transparent";
                })
            } else {
                chessPiece.addEventListener('mouseover', (evt) => {
                    if (this.selectedCells.cellElement1 != null) {
                        chessPiece.addEventListener('mouseover', (evt) => {
                            chessPiece.style.backgroundColor = "#FF0000";
                        });
                        chessPiece.addEventListener('mouseleave', (evt) => {
                            chessPiece.style.backgroundColor = "transparent";
                        })
                    }
                })
            }
        }

    }

    /**
     * Add the clicked element to the local selection if the element hasn't been clicked on before.
     * If it's the first element ever clicked then it must posses 
     * @param {HTMLElement} cellElement 
     */
    addCellSelectedElement(cellElement) {
        if (this.selectedCells.cellElement1 === cellElement) return;

        if (this.selectedCells.cellElement1 === null) {
            const selectedPiece = this.__getSelectedChessPiece(cellElement);
            if (selectedPiece && selectedPiece.dataset.piece_faction == this.playerFactionName) {
                this.selectedCells.cellElement1 = cellElement;
                console.log("Selected Piece at: " + JSON.stringify(selectedPiece.dataset));
            }
        } else {
            this.selectedCells.cellElement2 = cellElement;
        }
    }

    sendCellSelectedElements() {
        
        let hasSelectedElement1 = (this.selectedCells.cellElement1 !== null);
        let hasSelectedElement2 = (this.selectedCells.cellElement2 !== null);

        if (hasSelectedElement1 && hasSelectedElement2) {
            const chessPieceElement = this.__getSelectedChessPiece(this.selectedCells.cellElement1);

            const movementData = {
                pieceId: chessPieceElement.dataset.piece_id,
                coordinate_x: this.selectedCells.cellElement1.dataset.coordinate_x,
                coordinate_y: this.selectedCells.cellElement1.dataset.coordinate_y,
                destination_x: this.selectedCells.cellElement2.dataset.coordinate_x,
                destination_y: this.selectedCells.cellElement2.dataset.coordinate_y
            }

            this.sendAjax('POST', movementData, this.movepieceRoute);
            this.clearSelection();
        }
    }

    sendAjax(httpVerb, httpJSONBody, restURIExtension) {
        const xml = new XMLHttpRequest();
        const url = window.location.href + restURIExtension;
        
        xml.open(httpVerb, url, true);
        xml.setRequestHeader("Content-type", "application/json");

        xml.onreadystatechange = () => {
            if (xml.readyState == 4) {
                // Using to handle response.
                console.log(xml.responseText);
            }
        }

        console.log("Sent: " + JSON.stringify(httpJSONBody));
        xml.send(JSON.stringify(httpJSONBody));
        this.clearSelection();
    }

    // TODO: moveTo(cellId1, cellId2).
    
}