
const ClientAuth = require("./src/core/auth.client.socket");

var Server = require("./src/core/auth.server.socket");

var server = new Server();

server.start(5000);

var client = new ClientAuth("client1");
    
client.connect(5000);

setTimeout(function(){
	client.send("Teste");
	setTimeout(function(){
		client.disconnect();
	},500);
},1000);
