const db = require('../db/index');

module.exports = (id, response) =>{
    db.tx(t =>{
        const user = t.one(`SELECT username FROM users WHERE id = ${id}`);
        const games = t.any(`SELECT id FROM games WHERE active = 'idle'`);
        const rejoin = t.any(`SELECT id FROM games JOIN game_users ON gameid = id WHERE active = 'active' 
              AND (userid = ${id} OR opponentid = ${id})`);
        return t.batch([user, games, rejoin]);
    }).then( data =>{
        let obj = JSON.parse(JSON.stringify(data[0]));
        let idleGames = JSON.parse(JSON.stringify(data[1]));
        let rejoinableGames = JSON.parse(JSON.stringify(data[2]));
        response.render('index', {username: obj.username, idleGames: idleGames, rejoinableGames: rejoinableGames,layout: 'auth_layout.handlebars'});
    }).catch(error => {
        console.log(error);
        response.render('index');
    });
};