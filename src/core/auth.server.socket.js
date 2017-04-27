const config = require("../config");
const _ = require("lodash");
const debug = require("debug")("socket::server::auth");
const Server = require("./server.socket");
const Message = require("./message");
const TOKEN_AUTH = config.AUTH_TOKEN;
const TOKEN_PUSH = config.PUSH_TOKEN;

class Auth{

}
Auth.verify = function(key){
	return key === TOKEN_AUTH;
};
Auth.verifyPush = function(key){
	return key === TOKEN_PUSH;
};

class SocketServer extends Server{
    constructor(){
        super();
    }
    onMessage(data,socket) {
        let self = this;
        message = data;
        try{
        	var message = JSON.parse(data);
	        if(Message.REGISTER === message.type || !self.clients.hasOwnProperty(socket.name)){
	        	if(Auth.verify(message.key,socket)){
	        		message = super.onMessage(data,socket);
	        	}else{
	        		self.destroyClient(socket);
	        	}
	        }else{
	        	if(Auth.verifyPush(message.key,socket) || self.clients.hasOwnProperty(socket.name)){
	        		message = super.onMessage(data,socket);
	        	}else{
	        		self.destroyClient(socket);
	        	}
	        }
	    }catch(e){
	    	message = super.onMessage(data,socket);
	    	return message;
	    }
    }
    destroyClient(socket){
    	let self = this;
    	debug("Destroy %s...",socket.name);
    	debug(_.keys(self.clients));
    	self.emit({to:socket.name,message:"Invalid authentication."});
		setTimeout(function(){
			socket.destroy();
		},100);
    }
}

module.exports = SocketServer;