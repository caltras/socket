"use strict";
const debug = require("debug")("socket::client");
const net = require("net");
const config = require("../config");
const Message = require("./message");
const BroadcastMessage = require("./broadcast.message");
const RegisterMessage = require("./register.message");

class Client {
    constructor(name,group){
        this.name = name;
        this.group = group || "ALL";
    }
    connect(port,server){
        var self =this;
        this.client = new net.Socket();
        
        this.client.connect({port:(port || config.PORT),host: (server || config.SERVER)},function(data){
            self.register();
        });
        this.client.on("connect",this.onConnect);
        this.client.on("data",this.onMessage);
        this.client.on("end",this.onDisconnect);
        this.client.on("close",this.onClose);
        
        return this;
        
    }
    disconnect(){
        this.client.destroy();
    }
    onConnect(data){
        debug("Client connected");
    }
    onMessage(data){
        debug("Received message");
        debug(Message.build(data).message);
    }
    
    onDisconnect(){
        debug("Disconnected client");
    }
    onClose(){
        debug("Closed client");
    }
    register(){
        let messageObj = new RegisterMessage(this.name);
        this.client.write(messageObj.toString());
    }
    broadcast(message,group){
        let messageObj = new BroadcastMessage(message);
        messageObj.group = group || "ALL";
        messageObj.from = this.client.name;
        
        this.client.write(messageObj.toString());
        return this;
    }
    send(message,receiver){
        debug("sending message...");
        let messageObj = new Message(message);
        if(receiver){
            messageObj.to = receiver;
        }
        messageObj.from = this.client.name;
        this.client.write(messageObj.toString());
        return this;
    }
}

module.exports = Client;