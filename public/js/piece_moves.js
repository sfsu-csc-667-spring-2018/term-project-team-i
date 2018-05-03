//Chess rules & movement

moveKing = (startX, startY, endX, endY) => {
    /***TODO
     * Need to check for danger (check)
     *
     */
    if ((startX || startY || endX || endY) < 0) return false;

    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if (Y < -1 || Y > 1) return false;
    else if (X < -1 || X > 1) return false; //one square check

    else if (Y === 0) return true;
    else if (X === 0) return true;
    else if (Y === X) return true;
    else if (Y === -X) return true;
    return false
};


moveQueen = (startX, startY, endX, endY) => {
    /***TODO
     * Need to check for piece movement collision
     * Need king danger limit
     */
    if ((startX || startY || endX || endY) < 0) return false;

    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if (Y === 0) return true;
    else if (X === 0) return true;
    else if (Y === X) return true;
    else if (Y === -X) return true;
    return false;
};

moveBishop = (startX, startY, endX, endY) => {
    /***TODO
     * Need to check for piece movement collision
     * Need king danger limit
     */
    if ((startX || startY || endX || endY) < 0) return false;

    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if (Y === X) return true;
    else if (Y === -X) return true;

    return false;
};

moveKnight = (startX, startY, endX, endY) => {
    /***TODO
     * Need king danger limit
     */
    if ((startX || startY || endX || endY) < 0) return false;

    let X = endX - startX;
    let Y = endY = startY;

    //ranks check

    if (Y < -2 || Y > 2) return false;
    else if (X < -2 || X > 2) return false; //range check
    else if (Y === X + 3) return true;
    else if (Y === X - 3) return true;
    else if (Y === -X + 3) return true;
    else if (Y === -X - 3) return true;

    return false;
};

moveRook = (startX, startY, endX, endY) => {
    /***TODO
     * Need to check for piece movement collision
     * Need king danger limit
     */
    if ((startX || startY || endX || endY) < 0) return false;

    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if ((Y === 0) || (X === 0)) return true;
    return false;
};


moveWPawn = (startX, startY, endX, endY) => {
    /***TODO
     * White pawn has to start at the Y = 3 row(INDEX)
     * If Y == 3, first move can be Y + 1 or Y + 2
     * else Y + 1
     *
     * Diagonal enemy capture
     * check for enemy in (Y+1, X+1) || (Y+1, X-1)
     *
     * Pawn upgrade,
     * if Y == 8, upgradePawn()
     */
    if ((startX || startY || endX || endY) < 0) return false;
    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if (startY < 2 || startY > 2) return false;

    else if (startY === 2) return true;
    else if (Y === 3 ) return true;
    else if ((Y === Y + 1 ) || (Y === Y + 2)) return true;

    return false;

};

moveBPawn = (startX, startY, endX, endY) => {
    /***TODO
     * Black pawn has to start at the Y = 6 row(INDEX)
     * If Y == 6, first move can be Y - 1 or Y - 2
     * else Y - 1
     *
     * Diagonal enemy capture
     * check for enemy in (Y-1, X+1) || (Y-1, X-1)
     *
     * Pawn upgrade,
     * if Y == 0, upgradePawn()
     */
    if ((startX || startY || endX || endY) < 0) return false;
    let X = endX - startX;
    let Y = endY - startY;

    //ranks check

    if (startY < 7 || startY > 7) return false;

    else if (startY === 7) return true;
    else if (Y === 6) return true;
    else if ((Y === Y - 1) || (Y === Y - 2)) return true;

    return false;
};

exports = {
    moveBPawn,
    moveWPawn,
    moveKing,
    moveQueen,
    moveRook,
    moveBishop,
    moveKnight
};