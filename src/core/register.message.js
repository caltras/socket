const Message = require("./message");

class RegisterMessage extends Message{
    
    constructor(message,group){
        super(message,Message.REGISTER);
        this.group=group || "ALL";
    }
}

module.exports = RegisterMessage;