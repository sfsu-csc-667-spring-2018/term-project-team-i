const db = require('../db');

module.exports = (userid, gameid, successCallback, failureCallback) => {

    console.log('Userid for game ' + userid);
    console.log('Gameid is ' + gameid);

    db.one(`SELECT * FROM game_users WHERE gameid = ${gameid}`)
        .then(result => {
            let host = JSON.parse(JSON.stringify(result)).userid;
            let opponent = JSON.parse(JSON.stringify(result)).opponentid;
            console.log("host is " + host + " opponent is " + opponent);
            //console.log("result user " + JSON.parse(JSON.stringify(result))[0].opponentid);
            if (opponent === null && host !== userid) {
                db.any(`UPDATE game_users SET opponentid = ${userid} WHERE gameid = ${gameid}`)
                    .then(() => {
                        db.any(`UPDATE games SET active = 'active' WHERE id = ${gameid}`)
                            .then(() => {
                                successCallback(); //set opponent for game
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            else if (opponent !== null && host === userid) {
                successCallback(); //rejoining game
            }
            else if (opponent === null && host === userid) {
                successCallback(); //rejoining game
            }
            else if (opponent === userid) {
                successCallback(); //rejoining game
            }
            else if (opponent !== null && host !== userid) {
                failureCallback(); //game is full
            }
        })
        .catch(error => console.log(error));
};