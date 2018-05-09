// Execute the anonymous function after web page is finished loading.
(() => {
    const chessboard = new Chessboard();
    chessboard.addSelectionListenersTo('chessCell');
})();

