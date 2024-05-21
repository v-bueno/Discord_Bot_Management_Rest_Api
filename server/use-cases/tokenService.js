const { tokens, salon_id } = require('../token/tokens_discord_bot.json');

// Import the custom error class
const CustomError = require('../customError');


class TokenService extends Map{
	constructor(){
		super();
		this.instance;
	}

    static getInstance(){ //Singleton
        if(!this.instance){
            this.instance = new TokenService();
        }
        return this.instance;
    }

    getToken(workerName){
        if (tokens.length > 0){
            var i = 0;
            var explore = true
            while (explore){
                if (i < tokens.length) {
                    if (this.has(tokens[i])){
                        i++;
                    }
                    else{
                        explore = false;
                    }
                }
                else{
                    explore = false;
                }
            }
            if (i < tokens.length){
                this.set(tokens[i],workerName);
                return{"token":tokens[i],"salon_id":salon_id};
            }
            else{
                throw new CustomError('Cannot get a Token, no more token available.','no more token available');
            }
        }
    }

    giveBackToken(token){
        if (this.has(token)){
            this.delete(token);
        }
        else{
            throw Error(`cannot give back Token : token not found. ${error} ${error.stack}`);
        }
    }
}

module.exports = TokenService;