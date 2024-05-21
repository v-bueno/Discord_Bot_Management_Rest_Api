// Require the necessary discord.js classes
const { Client,  Events, GatewayIntentBits } = require('discord.js');
const RiveScript = require('rivescript')
const { parentPort, workerData } = require('worker_threads')

var token;
var salon_id;

var bot = new RiveScript();

// Load a directory full of RiveScript documents (.rive files). This is for
// Node.JS only: it doesn't work on the web!
//bot.loadDirectory("brain").then(loading_done).catch(loading_error);

// Load an individual file.
//bot.loadFile("brain/testsuite.rive").then(loading_done).catch(loading_error);

// Load a list of files all at once (the best alternative to loadDirectory
// for the web!)
bot.loadFile(["brains/english.rs"
]).then(loading_done).catch(loading_error);

// All file loading operations are asynchronous, so you need handlers
// to catch when they've finished. If you use loadDirectory (or loadFile
// with multiple file names), the success function is called only when ALL
// the files have finished loading.
function loading_done() {
  console.log("Bot has finished loading!");

  // Now the replies must be sorted!
  bot.sortReplies();

  // And now we're free to get a reply from the brain!

  // RiveScript remembers user data by their username and can tell
  // multiple users apart.
  let username = "local-user";

  // NOTE: the API has changed in v2.0.0 and returns a Promise now.
  bot.reply(username, "Hello, bot!").then(function(reply) {
    console.log("The bot says: " + reply);
  });
}

// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}








parentPort.onmessage = function (message) {
  if('suspend'== message.data[0]){
    stop();
    parentPort.postMessage(`${workerData.workerName} is idle`);
  }
  if('token'== message.data[0]){
    token = message.data[1];
    salon_id = message.data[2];
  }
  if('start'== message.data[0]){
    start();
    parentPort.postMessage(`${workerData.workerName} is activated`);
  }
}

function start(){
  console.log('Starting bot');
  // Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers,] });

const channel = client.channels.cache.get(salon_id);
client.on('messageCreate', async (message) => {

    if (message.channel.id === salon_id) {

        if(message.author.tag != client.user.tag){


          if(message.mentions.members.first() == client.user.id){
            const channel = client.channels.cache.get(salon_id);
            console.log(salon_id);
            bot.reply(message.author.tag, message.content).then(function(reply) {
            channel.send(`<@${message.author.id}> : ${reply}`);
          });
        }
      }
        

    }
}) 



client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
     
    const channel = client.channels.cache.get(salon_id);
    channel.send(`Chat Bot is Ready! Logged in as ${readyClient.user.tag}`);
});


  // Log in to Discord with your client's token
  console.log('Logging in...');
  client.login(token);
}