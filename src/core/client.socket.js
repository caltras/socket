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
        if(this.client && !this.client.destroyed){
            console.log("Registering..."+this.group);
            let messageObj = new RegisterMessage(this.name,this.group);
            this.client.write(messageObj.toString());
        }else{
            debug("Destroyed client");
        }
        return this;
    }
    broadcast(message,group){
        if(this.client && !this.client.destroyed){
            let messageObj = new BroadcastMessage(message);
            messageObj.group = group || "ALL";
            messageObj.from = this.client.name;
            
            this.client.write(messageObj.toString());
        }else{
            debug("Destroyed client");
        }
        return this;
    }
    send(message,receiver){
        if(this.client && !this.client.destroyed){
            debug("sending message...");
            let messageObj = new Message(message);
            if(receiver){
                messageObj.to = receiver;
            }
            messageObj.from = this.name;
            this.client.write(messageObj.toString());
        }else{
            debug("Destroyed client");
        }
        return this;
    }
}

module.exports = Client;