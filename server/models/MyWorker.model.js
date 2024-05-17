
const { Worker, workerData } = require('worker_threads')

const workerScripts = [];
workerScripts['bot1'] = './server/index_discordChatBot1.js';
workerScripts['bot2'] = './server/index_discordChatBot2.js';
workerScripts['bot3'] = './server/index_discordChatBot3.js';
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
 *     scriptName:
 *      type: string
 *      description: The script name
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
        this.workersService.set(this.workerName,this);
        this.tokenList = [];
    }

    start(){
        const worker = new Worker( this.scriptFile, {workerData: {workerName:this.workerName}} );
        this.job = worker;

        worker.on(
            'online', 
            () => { 

                this.status = 'functionning';
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
                this.status = 'sleeping';
            }
        );
          
    }

    dump(){
        return `This is worker ${this.workerName}`
    }

    kill(){
        if(this.status=='functionning' || this.status=='updating' || this.status=='initializing'){
            this.job.terminate()
        }
    }

    delete(){
        this.kill();
        this.workersService.delete(this.workerName);
    }

    isStatus(status){
        return (status == this.status);
    }

    setStatus(status){
        console.log(`setStatus to ${status}, current is ${this.status}`)
        if('sleeping'== status){
            this.delete();
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