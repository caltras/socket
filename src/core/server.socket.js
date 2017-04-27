"use strict";
const net = require("net");
const config = require("../config");
const debug = require("debug")("socket::server");
const Message =require("./message");
class Server {
    
    constructor() {
        this.clients = {};
        this.groups = {};
    }
    
    start(port,server) {
        debug("Starting server socket...");
        let self = this;
        this.server = net.createServer(function(socket){
            self.onConnect(socket,self);
        }).listen((port || config.PORT), (server || config.SERVER));
        return this;
    }
    onConnect(socket,self) {
        socket.name = socket.name || (socket.remoteAddress + ":" + socket.remotePort);
        
        socket.on('data', function(data) {
            self.onMessage(data,socket);
        });

        socket.on('end', function(){
            self.onDisconnect.bind(socket,self);
        });

    }
    onMessage(data,socket) {
        try{
            var message = JSON.parse(data);
            if (Message.REGISTER === message.type) {
                if(socket.name || this.clients.hasOwnProperty(socket.name)){
                    var oldName = socket.name;
                    delete this.clients[oldName];
                }
                socket.name = message.message;
                this.clients[socket.name] = socket;
                var group= this.groups[message.group] || {};
                group[socket.name] = socket;
                this.groups[message.group] = group;
            }else{
                if (Message.BROADCAST === message.type) {
                    this.broadcast(message, socket);
                }else {
                    if(message.hasOwnProperty("to") || message.hasOwnProperty("group")){
                        this.emit(message);
                    }
                }
            }
            return message;
        }catch(e){
            return data;
        }
        
    }
    onDisconnect(socket,self) {
        self.clients.splice(self.clients.indexOf(socket), 1);
        self.broadcast(socket.name + " left the pool.\n");
    }

    emit(message) {
        if (this.clients.hasOwnProperty(message.to)) {
            this.clients[message.to].write(message.message);
        }else{
            if (this.groups.hasOwnProperty(message.group)) {
                var clientsGroup = this.groups[message.group];
                Object.keys(clientsGroup).forEach(function(key) {
                    let client = clientsGroup[key];
                    if (key === message.from) {
                        return;
                    }
                    client.write(message.message);
                });
            }
        }
    }

    broadcast(message, sender) {
        debug("Broadcasting message...");
        let self =this;
        Object.keys(self.clients).forEach(function(key) {
            let client = self.clients[key];
            if (client === sender) {
                return;
            }
            client.write(message.message);
        });
    }
}

module.exports = Server;
