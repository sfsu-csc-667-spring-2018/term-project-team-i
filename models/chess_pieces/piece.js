class Piece {

    constructor (name, faction, coordinate_x, coordinate_y, alive) {
        
        if (this.constructor === Piece) {
            throw new TypeError('Abstract class "Piece" cannot be instantiated.');
        }
        
        this.name = name;
        this.faction = faction;
        this.coordinate_x = coordinate_x;
        this.coordinate_y = coordinate_y;
        this.alive = alive;
    }
    
    moveToPosition(newCoordinateX, newCoordinateY) {
        throw new Error(this.moveToPosition.name + " is abstract and must be implemented.");
        /*
        TODO: Implement this in subclasses.
            1. Check if new positions are valid coordinates.
            2. Check if new positions can be moved into by this Piece type.
            3. Move piece to position and update.
        */
    }

}

module.exports = Piece;