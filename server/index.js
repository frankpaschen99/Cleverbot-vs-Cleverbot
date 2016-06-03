var Cleverbot = require('cleverbot-node');
CleverbotA = new Cleverbot;
CleverbotB = new Cleverbot;
io = require('socket.io').listen(3000);

class ConversationHandler {
	constructor() {
		this.conversations = [];
	}
	add(socket, promptString) {
		var exists = false;
		this.conversations.forEach(function(index) {
			if (index.socket == socket) exists = true;
		}.bind(this));
		if (!exists) this.conversations.push(new Conversation(socket, promptString));
	}
	destroy(socket) {
		this.conversations.forEach(function(index) {
			if (index.socket == socket) {
				index.destroyed = true;
				var i = this.conversations.indexOf(index);
				if (i > -1) {
					this.conversations.splice(i, 1);
				}
			}
		}.bind(this));
	}
}
class Conversation {
	constructor(_socket, promptString) {
		this.socket = _socket;
		this.promptA(promptString);
		this.destroyed = false;
	}
	promptA(message) {
		if (this.destroyed) return;
		Cleverbot.prepare(function() {
			CleverbotA.write(message, function(response) {
				console.log("Cleverbot A: " + response.message);
				this.socket.emit('response', "Cleverbot A: " + response.message);
				this.promptB(response.message);
			}.bind(this));
		}.bind(this));
	}
	promptB(message) {
		if (this.destroyed) return;
		Cleverbot.prepare(function() {
			CleverbotB.write(message, function(response) {
				console.log("Cleverbot B: " + response.message);
				this.socket.emit('response', "Cleverbot B: " + response.message);
				this.promptA(response.message);
			}.bind(this));
		}.bind(this));
	}
}
var ch = new ConversationHandler();

io.sockets.on('connection', function (socket) {
	console.log("Client connected: " + socket.id);
    socket.on('cleverbot_prompt', function(initialPrompt) {
		console.log("PROMPT: " + initialPrompt);
		ch.add(socket, initialPrompt);
    });
	socket.on('disconnect', function() {
		ch.destroy(socket);
		console.log("Client disconnected: " + socket.id);
    });
	socket.on('cleverbot_stop', function() {
		ch.destroy(socket);
	});
});