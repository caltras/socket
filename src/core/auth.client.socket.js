const config = require("../config");
const Client = require("./client.socket");
var RegisterMessage = require("./register.message");
const debug = require("debug")("client:auth");

class ClientAuth extends Client{
	register(){
		debug("Registering..."+this.name);
	    let messageObj = new RegisterMessage(this.name,this.group);
	    messageObj.key = config.AUTH_TOKEN;
	    this.client.write(messageObj.toString());
	}
	onMessage(data){
		console.log(data);	
	}
}
module.exports = ClientAuth;