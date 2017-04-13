var Socket = require("./index.js");

var debug = require("debug")("main");
const _ = require("lodash");

var Server = Socket.Server;
var Client = Socket.Client;

var server = new Server().start();

var clients = [];
var groups = ["message::foo","message::others"];
for(var i=1;i<=10;i++){
    var c = new Client("teste"+i);
    c.connect();
    c.group = _.sample(groups);
    clients.push(c);    
}

setTimeout(function(){
    debug("Created clients");
    debug(_.map(server.clients,"name"));
    
    server.broadcast({message:"Welcome all..."});

    setInterval(function(){
            
        var group = _.sample(groups);
        var client1 = _.sample(clients);
        var idClient2 = "teste"+_.random(1,10);
        var m = `from: ${client1.name}, to: ${idClient2}`;
        var m2 = `from: ${client1.name}, group: ${group}`;
        
        client1.send(m,idClient2);
        setTimeout(function(){
            client1.broadcast(m2,group);
        },100);

    },5000);
},500);
