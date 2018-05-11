class Chessboard {

    constructor () {
        this.selectedCells = {
            cellElement1: null,
            cellElement2: null
        };

        this.classChessCell = "chessCell";
        this.classChessPiece = "chessPiece";
        this.movepieceRoute = '/move-piece';
    }

    /**
     * Determines if the givene element possesses a chess piece element.
     * It will return the chess piece element if true, but the boolean false otherwise.
     * @param {HTMLElement} chessCellElement The parent element to find the child under.
     */
    __getSelectedChessPiece(chessCellElement) {
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
    addSelectionListenersTo(classChessCell = this.classChessCell) {
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

    /**
     * Add the clicked element to the local selection if the element hasn't been clicked on before.
     * If it's the first element ever clicked then it must posses 
     * @param {HTMLElement} cellElement 
     */
    addCellSelectedElement(cellElement) {
        if (this.selectedCells.cellElement1 === null) {
            if (this.__getSelectedChessPiece(cellElement)) {
                this.selectedCells.cellElement1 = cellElement;
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
                this.clearSelection();
                console.log(xml.responseText);
            }
        }

        xml.send(JSON.stringify(httpJSONBody));
    }

    // TODO: moveTo(cellId1, cellId2).
    
}