const Message = require("./message");

class JoinMessage extends Message{
    
    constructor(message){
        super(message,Message.JOIN);
    }
}

module.exports = JoinMessage;