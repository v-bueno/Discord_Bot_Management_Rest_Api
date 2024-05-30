// Import the custom error class
const CustomError = require('../customError');
const fs = require ('fs');

class LogService extends Map{
	constructor(){
		super();
		this.instance;

        // Ensure the directory exists
        const logsDir = './public/logs';
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // Add existing log files to the map
        const logFiles = fs.readdirSync(logsDir);
        logFiles.forEach(file => {
            const workerName = file.split('.')[0];
            const logPath = `${logsDir}/${file}`;
            this.set(workerName, logPath);
        });
        console.log("successfully loaded log files \n");
	}

    static getInstance(){ //Singleton
        if(!this.instance){
            this.instance = new LogService();
        }
        return this.instance;
    }

    addLog({workerName,logpath}){
        if(!(this.has(workerName))){
            this.set(workerName,logpath);
            fs.writeFile(logpath, '', (err) => {
                if (err) throw err;
                console.log(`Log file ${logpath} created`);
            });
            
        }
    }

    getFrenchFormattedDate() {
        const now = new Date();
        const options = {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Intl.DateTimeFormat('fr-FR', options).format(now).replace(',', '');
    }
    
    writeLog({ workerName, log }) {
        const logpath = this.get(workerName);
        if (logpath) {
            const timestamp = this.getFrenchFormattedDate();
            const logMessage = `[${timestamp}] ${log}\n`;
            fs.appendFile(logpath, logMessage, (err) => {
                if (err) throw err;
            });
        }
    }
    getLogs({workerName}){
        const logpath = this.get(workerName);
        if (logpath){
            return fs.readFileSync(logpath, 'utf8');
        }
        else{
            throw new CustomError('Cannot get logs, worker not found.','worker not found');
        }
    }
}

module.exports = LogService;