const db = require('../db/index');

module.exports = (id, response) =>{
    db.tx(t =>{
        const user = t.one(`SELECT username FROM users WHERE id = ${id}`);
        const games = t.any(`SELECT id FROM games WHERE active = 'idle'`);
        const rejoin = t.any(`select id from games Join game_users ON gameid = id WHERE active = 'active' 
              AND (userid = ${id} OR opponentid = ${id})`);
        return t.batch([user, games, rejoin]);
    }).then( data =>{
        console.log("reached data"  + JSON.stringify(data));
        let obj = JSON.parse(JSON.stringify(data[0]));
        let game = JSON.parse(JSON.stringify(data[1]));
        let rejoin = JSON.parse(JSON.stringify(data[2]));
        response.render('index', {username: obj.username, game: game, rejoin: rejoin,layout: 'auth_layout.handlebars'});
    }).catch(error => {
        console.log(error);
        response.render('index');
    });
};