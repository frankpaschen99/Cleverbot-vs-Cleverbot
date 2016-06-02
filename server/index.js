var Cleverbot = require('cleverbot-node');
var CleverbotA = new Cleverbot;
var CleverbotB = new Cleverbot;
var app = require('express')();
var http = require('http').Server(app);

io.on('connection', function(socket) {
    socket.on('cleverbot_prompt', function(msg) {
		if(msg ==== "") promptA(msg);
    });
});

http.listen(2684, function() {
    console.log('listening on *:3000');
});

function promptA(message) {
    Cleverbot.prepare(function() {
        CleverbotA.write(message, function(response) {
            console.log("Cleverbot A: " + response.message);
            setTimeout(function() {
                promptB(response.message);
            }, 1000);
        });
    });
}

function promptB(message) {
    Cleverbot.prepare(function() {
        CleverbotB.write(message, function(response) {
            console.log("Cleverbot B: " + response.message);
            setTimeout(function() {
                promptA(response.message);
            }, 1000);
        });
    });
}