
const { Worker, workerData } = require('worker_threads')
const tokenService = require('../use-cases/tokenService.js');
const logService = require('../use-cases/LogService.js');

const fs = require ('fs');

// Import the custom error class
const CustomError = require('../customError');

const workerScripts = [];
workerScripts['worker3'] = './models/workerScripts/worker3.js';
workerScripts['index_discordChatBot'] = './models/workerScripts/index_discordChatBot.js';

//workerScripts['worker3'] = './workerScripts/worker3.js';


const statusSet = new Set(['initializing','functionning','updating','sleeping']);

/**
 * @swagger
 * components:
 *  schemas:
 *   Worker:
 *    type: object
 *    required:
 *     - workerName
 *     - scriptName
 *    properties:
 *     workerName:
 *      type: string
 *      description: The worker name
 *     scriptFile:
 *      type: string
 *      description: The script file path
 *     logFile:
 *      type: string
 *      description: The log file path
 *      default: public/logs/workerName.log
 *     status:
 *      type: string
 *      description: The worker status
 *      default: sleeping
 *    example:
 *     workerName: Tle
 *     scriptName: index_discordChatBot
 *     status: sleeping
 */
class MyWorker{
    constructor({workerName,scriptName,workersService}){
        this.workerName = workerName;
        this.scriptFile = workerScripts[scriptName];
        this.workersService = workersService
        this.job;
        this.status = 'sleeping';
        this.logService = logService.getInstance();
        this.workersService.set(this.workerName,this);
        this.TokenService = tokenService.getInstance();
        this.token;
        this.salon_id;

        //Création fichier log
        this.logService.addLog({workerName:this.workerName,logpath:`./public/logs/${this.workerName}.log`});
        this.logService.writeLog({workerName:this.workerName,log:`Worker ${this.workerName} is installed\n`})
        this.logService.writeLog({workerName:this.workerName,log:`Script file is ${this.scriptFile}\n`})
        this.logService.writeLog({workerName:this.workerName,log:`Initial status is ${this.status}\n`})
    }
    
    start(){
        try{
        this.logService.writeLog({workerName:this.workerName,log:`Trying to get a token\n`})
        const { token, salon_id } = this.TokenService.getToken(this.workerName);
        this.salon_id = salon_id;
        this.token = token;
        } catch (error){
            if (error instanceof CustomError) {
                this.logService.writeLog({workerName:this.workerName,log:`Couldn t get a token: ${error.message}\n`});
                throw new CustomError('Couldn t get a token','Couldn t get a token',error);

            } else {
                this.logService.writeLog({workerName:this.workerName,log:`Caught an unknown error: ${error.message}\n`});
                console.error(`Caught an unknown error: ${error.message}`);
            }
        }
        this.logService.writeLog({workerName:this.workerName,log:`Starting job\n`});
        const worker = new Worker( this.scriptFile, {workerData: {workerName:this.workerName}} );
        this.job = worker;
        
        //send a message containing the string 'token' and the token and salon_id and the ownership of the token and salon_id
        console.log('Sending token and salon_id to worker : '+this.token+' '+this.salon_id);
        this.job.postMessage(["token",this.token,this.salon_id]);
        this.job.postMessage(["start"]);
        worker.on(
            'online', 
            () => { 

                this.status = 'functionning';
                this.logService.writeLog({workerName:this.workerName,log:'Launching intensive CPU task\n'});
                console.log('Launching intensive CPU task') ;
                
            }
        );
        worker.on(
            'message', 
            messageFromWorker => {
                this.logService.writeLog({workerName:this.workerName,log:`message from worker : ${messageFromWorker}\n`});
                console.log(`message from worker  ${this.workerName}: ${messageFromWorker}`);
            }
        );
        worker.on(
            'error', 
            (code)=>{ this.logService.writeLog({workerName:this.workerName,log:`Worker issued an error with code ${code}\n`});
                throw Error(`Worker ${this.workerName} issued an error with code ${code}`)}
        );
        worker.on(
            'exit', 
            code => {
                this.logService.writeLog({workerName:this.workerName,log:`Worker exited with code ${code}. Changing status to sleeping\n`});
                this.status = 'sleeping';
            }
        );
          
    }

    dump(){
        return `This is worker ${this.workerName}`
    }

    kill(){
        if(this.status=='functionning' || this.status=='updating' || this.status=='initializing'){
            this.logService.writeLog({workerName:this.workerName,log:`Received a kill signal, terminating job and giving back token\n`});
            this.TokenService.giveBackToken(this.token);
            this.job.terminate()
        }
    }

    delete(){
        this.logService.writeLog({workerName:this.workerName,log:`Received a delete signal, terminating job and giving back token, then deleting worker.\n`});
        console.log(`Received a delete signal, terminating job and giving back token, then deleting worker ${this.workerName}.`);
        this.kill();
        this.workersService.delete(this.workerName);
    }

    isStatus(status){
        return (status == this.status);
    }

    setStatus(status){
        this.logService.writeLog({workerName:this.workerName,log:`setStatus to ${status}, current is ${this.status}\n`});
        console.log(`setStatus to ${status}, current is ${this.status}`);
        if('sleeping'== status){
            this.kill();
        }
        if('functionning' == status){
            if(  this.status == 'sleeping'){
                this.start();
            }
        }
    }


}


module.exports = MyWorker;
  

/*
const { Worker, workerData } = require('worker_threads')

const workerScripts = [];
workerScripts['worker3'] = './models/workerScripts/worker3.js';

const statusSet = new Set(['installed','activated','idle','terminated']);


class MyWorker{
    constructor({workerName,scriptName,workersService}){
        this.workerName = workerName;
        this.scriptFile = workerScripts[scriptName];
        this.workersService = workersService
        this.job;
        this.status = 'installed';
        this.workersService.set(this.workerName,this);
    }

    start(){
        const worker = new Worker( this.scriptFile, {workerData: {workerName:this.workerName}} );
        this.job = worker;

        worker.on(
            'online', 
            () => { 
                this.status = 'activated';
                console.log('Launching intensive CPU task') 
                
            }
        );
        worker.on(
            'message', 
            messageFromWorker => {
                console.log(`message from worker  ${this.workerName}: ${messageFromWorker}`)
            }
        );
        worker.on(
            'error', 
            (code)=>{ throw Error(`Worker ${this.workerName} issued an error with code ${code}`)}
        );
        worker.on(
            'exit', 
            code => {
                this.status = 'terminated';
            }
        );
          
    }

    dump(){
        return `This is worker ${this.workerName}`
    }

    kill(){
        if(this.status=='activated' || 'idle'==this.status=='activated'){
            this.job.terminate()
        }
    }

    delete(){
        this.kill();
        this.workersService.delete(this.workerName);
    }

    suspend(){
        this.job.postMessage('suspend')
        this.status='idle';
    }

    continue(){
        this.job.postMessage('continue')
    }

    isStatus(status){
        return (status == this.status);
    }

    setStatus(status){
        console.log(`setStatus to ${status}, current is ${this.status}`)
        if('terminated'== status){
            this.delete();
        }
        if('idle' == status && this.status == 'activated' ){
            this.suspend();
        }
        if('activated' == status){
            if( this.status == 'idle' ){
                this.continue();
            }
            if(  this.status == 'installed'){
                this.start();
            }
        }
    }


}


module.exports = MyWorker;
  */