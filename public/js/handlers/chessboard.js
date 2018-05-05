class Chessboard {

    constructor () {
        this.selectedItemIds = {
            cellId1: null,
            cellId2: null
        };
    }


    /**
     * 
     * @param {*} chessCellClassName 
     */
    initCellListeners(chessCellClassName = 'chessCell') {
        const command = 'click';
        const chessCellElements = document.querySelectorAll("."+chessCellClassName);

        //1. Set 'onclick' event for every class of 'chessCell' HTMLElement.
        for (let cceIdx = 0; cceIdx < chessCellElements.length; cceIdx++) {
            const chessCell = chessCellElements[cceIdx];

            chessCell.addEventListener(command, () => {
                this.addUserSelection(chessCell);
            });
        }
    }

    /*
    // SUGGESTION: Implement piece listeners to be more specific instead of cells.
    initPieceListeners(chessPieceClassName = 'chessPiece') {
        const command = 'click';
        //TODO: focus on cells only for now. The Server can handle the validation.
    }
    */

    addUserSelection(chessCell) {
        if (this.selectedItemIds.cellId1 === chessCell.id) return;
        
        let hasSelectedItemId1 = (this.selectedItemIds.cellId1 !== null);
        let hasSelectedItemId2 = (this.selectedItemIds.cellId2 !== null);

        //SUGGESTION: Need to determine if appropriate piece is selected, not just any random cell.
        if (!hasSelectedItemId1) {
            this.selectedItemIds.cellId1 = chessCell.id;
        } else {
            this.selectedItemIds.cellId2 = chessCell.id;
            hasSelectedItemId2 = true;
        }
        
        if (hasSelectedItemId1 && hasSelectedItemId2) {
            this.sendAjax('POST', this.selectedItemIds, '/myinfo');
            // TODO: send playerId in Request body.
            this.selectedItemIds.cellId1 = null;
            this.selectedItemIds.cellId2 = null;
        }
    }

    sendAjax(httpVerb, httpJSONBody, restURIExtension) {
        const xml = new XMLHttpRequest();
        const url = window.location.href + restURIExtension;
        console.log(url);
        xml.open(httpVerb, url, true);
        xml.setRequestHeader("Content-type", "application/json");

        xml.onreadystatechange = () => {
            if (xml.readyState == 4 && xml.status == 200) {
                //TODO: require dictionary/mapping to determine course of action depending on received response.
                alert(xml.responseText);
            }
        }
        console.log(JSON.stringify(httpJSONBody));
        xml.send(JSON.stringify(httpJSONBody));
    }

    // TODO: moveTo(cellId1, cellId2).
    
}