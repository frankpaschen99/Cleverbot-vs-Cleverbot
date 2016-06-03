var Cleverbot = require('cleverbot-node');
CleverbotA = new Cleverbot;
CleverbotB = new Cleverbot;
io = require('socket.io').listen(3000);

class ConversationHandler {
	constructor() {
		this.conversations = [];
	}
	add(socket, promptString) {
		this.conversations.push(new Conversation(socket, promptString));
	}
	destroy(socket) {
		this.conversations = [];
	}
}
class Conversation {
	constructor(_socket, promptString) {
		this.socket = _socket;
		this.promptA(promptString, this.socket, this.promptB, this.promptA);
	}
	promptA(message, socket, promptB, promptA, destroyed) {
		Cleverbot.prepare(function() {
			CleverbotA.write(message, function(response) {
				console.log("Cleverbot B: " + response.message);
				socket.emit('response', "Cleverbot A: " + response.message);
				promptB(response.message, socket, promptB, promptA);
			});
		});
	}
	promptB(message, socket, promptB, promptA) {
		Cleverbot.prepare(function() {
			CleverbotB.write(message, function(response) {
				console.log("Cleverbot B: " + response.message);
				socket.emit('response', "Cleverbot B: " + response.message);
				promptA(response.message, socket, promptB, promptA);
			});
		});
	}
}
var ch = new ConversationHandler();

io.sockets.on('connection', function (socket) {
	console.log("Client connected: " + socket.id);
    socket.on("cleverbot_prompt", function(initialPrompt) {
		console.log("PROMPT: " + initialPrompt);
		ch.add(socket, initialPrompt);
		ch.destroy(socket);
    });
	socket.on('disconnect', function() {
		ch.destroy(socket);
		console.log("Client disconnected: " + socket.id);
    });
});