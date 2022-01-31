import tmi from 'tmi.js';
import {ENV_VARIABLES} from './environment.js';
import {TEXT_COMMANDS, REDES_COMMAND} from './text-commands.js';

// Setup client

const opts = {
  identity: {
    username: ENV_VARIABLES.BOT_USERNAME,
    password: ENV_VARIABLES.OAUTH_TOKEN
  },
  channels: [
    ENV_VARIABLES.CHANNEL_NAME
  ]
};

const spamRedesInterval = null;

const client = new tmi.client(opts);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();


const sameCommand = (input, command) => {
    return input.toUpperCase() === command.toUpperCase();
}

const checkCommandsAndReact = (commandInput, target) => {
    const foundCommand = TEXT_COMMANDS.find(command => sameCommand(command.name, commandInput))
    if (foundCommand) {
        client.say(target, foundCommand.message);
        console.log(`* Executed ${foundCommand.name} command`);
    }
    else {
        console.log(`* Unknown command ${commandInput}`);
    }
};

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandInput = msg.trim();

  // If message is a command and the command is known, let's execute it
  if(commandInput[0] === '!') {
    checkCommandsAndReact(commandInput.substring(1), target);
  }
}

const spamRedes = () => {
    client.say(ENV_VARIABLES.CHANNEL_NAME, REDES_COMMAND.message)
}

const initSpamRedesInterval = () => {
    spamRedesInterval = setInterval(()=> {
        spamRedes();
    }, 60*60*1000);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    initSpamRedesInterval();
}
