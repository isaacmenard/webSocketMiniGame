var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    players[socket.id] = {
        playerId: socket.id,
    };
    // send the players object to the new player
    socket.emit('currentPlayers', players);


    socket.on('disconnect', function() {
        socket.broadcast.emit("pseudoDelete", socket.pseudo)
    })
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
        socket.emit("pseudo", socket.pseudo)
        socket.broadcast.emit("pseudo", socket.pseudo)
        setInterval(() => {
            socket.broadcast.emit("plusUn", socket.pseudo)
            socket.emit("plusUn", socket.pseudo)
        }, 5000);
    });
});





server.listen(8080);