// Execute the anonymous function after web page is finished loading.
(() => {

    // Add event listeners for all cells for onclick() to check for live piece.
    const chessCells = document.querySelectorAll("td.chessCell");
   
    for (let idx = 0; idx < chessCells.length; idx++) {
        let chessCell = chessCells[idx];
        chessCell.addEventListener('click', () => {
            
        });
    }
})();

