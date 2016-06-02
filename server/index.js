var Cleverbot = require('cleverbot-node');
CleverbotA = new Cleverbot;
CleverbotB = new Cleverbot;
io = require('socket.io').listen(3000);
clients = [];

io.sockets.on('connection', function (socket) {
	console.log("Client connected: " + socket.id);
	clients.push(socket);
    socket.on("cleverbot_prompt", function(initialPrompt) {
		console.log("PROMPT: " + initialPrompt);
		promptA(initialPrompt, socket);
    });
	socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
        }
		console.log("Client disconnected: " + socket.id);
    });
});

function promptA(message, socket) {
    Cleverbot.prepare(function() {
        CleverbotA.write(message, function(response) {
            console.log("Cleverbot A: " + response.message);
            setTimeout(function() {
				if (clients.length > 0) {
					clients.forEach(function(index) {
						if (socket.id == index.id) {
							index.emit('response', "Cleverbot A: " + response.message);
						}
					});
				} else return;
                promptB(response.message, socket);
            }, 1000);
        });
    });
}

function promptB(message, socket) {
    Cleverbot.prepare(function() {
        CleverbotB.write(message, function(response) {
            console.log("Cleverbot B: " + response.message);
            setTimeout(function() {
				if (clients.length > 0) {
					clients.forEach(function(index) {
						if (socket.id == index.id) {
							index.emit('response', "Cleverbot B: " + response.message);
						}
					});
				} else return;
                promptA(response.message, socket);
            }, 1000);
        });
    });
}