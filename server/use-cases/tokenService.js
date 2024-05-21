const { tokens, salon_id } = require('../../token/tokens_discord_bot.json');


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
            while (this.has(tokens[i]) && i < tokens.length){
                i++;
            }
            if (i < tokens.length){
                this.set(tokens[i],workerName);
                return tokens[i];
            }
            else{
                throw Error(`cannot get Token : no more token available. ${error} ${error.stack}`);
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