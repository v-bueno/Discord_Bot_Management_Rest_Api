const MyWorker = require("../models/MyWorker.model.js");

const CustomError = require('../customError');

class WorkersService extends Map{
	constructor(){
		super();
		this.instance;
	}

	static getInstance(){ //Singleton
		if(!this.instance){
			this.instance = new WorkersService();
		}
		return this.instance;
	}
	
	addWorker({workerName,scriptName}){
  		let newWorker;

		//rejeter si le nom est déjà utilisé.
		if(this.has(workerName)){
			throw Error(`cannot create Worker ${workerName} : name already in use. ${error} ${error.stack}`);
		}

  		try{
			newWorker = new MyWorker({workerName,scriptName,workersService:this});
		} catch (error){
			throw Error(`cannot create Worker ${error} ${error.stack}`);
		}
		return newWorker.dump();
	}

	deleteWorker({workerName}){

		try{
			//d'abord arrêter le worker 
			const myWorker = this.getWorker({workerName});
			myWorker.kill();
			myWorker.delete();
		} catch (error){
			throw Error(`cannot delete Worker ${workerName} :  ${error} ${error.stack}`);
		}
	}
	
	getWorkers(){
		return Array.from(this);
	}

	getWorkersByStatus({workerStatus}){
		const arrayOfWorkers = new Array();
		this.forEach((value,key,map)=>{
			if(value.isStatus(workerStatus)){
				arrayOfWorkers.push(value);
			}
		})
		return arrayOfWorkers;
	}

	getWorker({workerName}){
		//renvoie L'élément associée à la clé donnée ou undefined si la clé ne fait pas partie de l'objet Map.
		const myWorker = this.get(workerName);
		if(undefined == myWorker){
			throw Error(`cannot get Worker ${workerName}, undefined `);
		}
		return myWorker;
	}

	patchWorker({workerName,payload}){
		//renvoie L'élément associée à la clé donnée ou undefined si la clé ne fait pas partie de l'objet Map.
		const myWorker = this.get(workerName);
		if(undefined == myWorker){
			throw new CustomError(`cannot get Worker ${workerName}, cannot get Worker undefined `,'cannot get Worker undefined');
		}
		if(payload.status){
			try{
				myWorker.setStatus(payload.status);
			}
			catch (error){
				if (error instanceof CustomError){ 
					if (error.shortMessage == 'Couldn t get a token'){
						throw new CustomError(`can not patch worker ${workerName} to set status ${payload.status}, couldn t get a token`,`can not start worker, couldn t get a token`,error);
					}
				}
				else{ 
					console.error(`Caught an unknown error: ${error.message}`);
				}
			}
		}
		return myWorker;
	}



	activateWorker({workerName}){
		const myWorker = this.getWorker({workerName});
		myWorker.start();
	}

	killWorker({workerName}){
		const myWorker = this.getWorker({workerName});
		myWorker.kill();
	}

	suspendWorker({workerName}){
		const myWorker = this.getWorker({workerName});
		myWorker.suspend();
	}

	continueWorker({workerName}){
		const myWorker = this.getWorker({workerName});
		myWorker.continue();
	}


}

module.exports = { WorkersService };
