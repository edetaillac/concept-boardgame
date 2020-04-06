// On mets en place les app requierments
const express = require('express');
const app = express();
var server = require('http').createServer(app), // Serveur HTTP
    io = require('socket.io').listen(server), // Socket.io pour le realtime
    ent = require('ent'); // Ent pour l'encodage

const fs = require('fs');
const wordFamille = fs.readFileSync('words/famille.csv','utf8').split("\r\n");
const wordPersos = fs.readFileSync('words/persos.csv','utf8').split("\r\n");
const wordAdultes = fs.readFileSync('words/adultes.csv','utf8').split("\r\n");
 
app.use(function(req, res, next){
    defaultPositionDiv = [
        {id: 'typo-green', color: 'green', x:800, y:80, number: 1, symbol: '?'},
        {id: 'green', color: 'green', x:808, y:150, number: 8},
        {id: 'typo-magenta',color: 'magenta', x:850, y:80, number: 1, symbol: '!'},
        {id: 'magenta',color: 'magenta', x:858, y:150, number: 6},
        {id: 'typo-yellow',color: 'yellow', x:900, y:80, number: 1, symbol: '!'},
        {id: 'yellow',color: 'yellow', x:908, y:150, number: 6 },
        {id: 'typo-black',color: 'black', x:950, y:80 , number: 1, symbol: '!'},
        {id: 'black',color: 'black', x:958, y:150 , number: 6},
        {id: 'typo-blue',color: 'blue', x:1000, y:80, number: 1, symbol: '!'},
        {id: 'blue', color: 'blue', x:1008, y:150, number: 6},
    ];
    if (typeof(positionDiv) == 'undefined') {
        positionDiv = [];
    }
    next();
})

.use('/static', express.static(__dirname + '/public'))
 
// Rendu de todo.ejs à la route racine
.get('/', function (req, res) {
    res.render('board.ejs', {defaultPosition: defaultPositionDiv, positionDiv: positionDiv});
})
.get('/word', function (req, res) {
    res.json({
        "word1": getWord(wordFamille),
        "word2": getWord(wordFamille),
        "word3": getWord(wordPersos),
        "word4": getWord(wordPersos),
        "word5": getWord(wordAdultes),
        "word6": getWord(wordAdultes),
    });
});

function getWord(data)
{
    return data[Math.floor(Math.random() * data.length)];
}
 
// On enclenche le socket d'échange
io.sockets.on('connection', function (socket) {
 
    // Sur l'évenment modeDiv on bouge le calque
    socket.on('movePawn', function (object) {
        if (object.position != '') {
            socket.broadcast.emit('movePawn', object);
        }
    })
 
    socket.on('stopPawn', function (object) {
        if (object.position != '') {
            positionDiv.forEach(function(position, index) {
                if(position.pawn == object.pawn) {
                    positionDiv.splice(index, 1);
                }
            });

            positionDiv.push({pawn: object.pawn, x:object.position.left+3, y:object.position.top-3});
        }
    })

    socket.on('resetGame', function (object) {
        positionDiv = [];
        socket.broadcast.emit('resetGame');
    })
 
}) 
 
server.listen(8080);
