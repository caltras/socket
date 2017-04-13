const Message = require("./message");

class BroadcastMessage extends Message{
    
    constructor(message){
        super(message,Message.BROADCAST);
    }
}

module.exports = BroadcastMessage;