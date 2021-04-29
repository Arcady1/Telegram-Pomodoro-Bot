process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./keyboard');
const messages = require('./messages');
const botFunctions = require('./bot_functions');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {
    polling: true
});
messages.setBot(bot); // Add a bot to the messages module to send messages from there

let note = {}; // The object containing the data that will be sent to the notification waiting function 
let currentDate = new Date();

bot.on('message', msg => {
    let userId = msg.from.id; // Message sender id 
    messages.setUserID(userId); // Add userId to the messages module to send messages from there

    switch (msg.text) {
        case '/start':
            botFunctions.resetTimeToWork();
            // Keyboard appearance
            bot.sendMessage(userId, ('Hello, ' + msg.from.first_name + '!\n' + messages.botAnswers('firstStart')), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: myKeyboard.startKb
                }
            });
            break;
        case 'START':
            botFunctions.clrTimeout();
            // Keyboard appearance
            bot.sendMessage(userId, messages.botAnswers('butStart'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: myKeyboard.intervalsKb
                }
            });
            break;
        case 'STOP':
            botFunctions.resetTimeToWork();
            botFunctions.clrTimeout();
            // Keyboard appearance
            bot.sendMessage(userId, messages.botAnswers('butStop'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: myKeyboard.startKb
                }
            });
            break;
        case 'PAUSE':
            botFunctions.clrTimeout();
            // RESUME button appears
            bot.sendMessage(userId, messages.botAnswers('butPause'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: myKeyboard.pauseKb
                }
            });
            break;
        case 'RESUME':
            // PAUSE button appears
            bot.sendMessage(userId, messages.botAnswers('butResume'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: myKeyboard.stopKb
                }
            }).then(() => {
                botFunctions.countdown(bot, note, true);
            })
            break;
        case '/help':
            messages.botSendMyMessage('butHelp');
            break;
        default:
            break;
    }
})

// Work or rest interval or new time
bot.onText(/(\d{1,4})( |:)(\d{1,4})/, (msg, match) => {
    botFunctions.resetTimeToWork();
    let promise = new Promise((resolve, reject) => {
        // If an interval is specified
        if (/([1-9]\d{0,3})( )([1-9]\d{0,3})/.test(match[0])) {
            note = botFunctions.notePreparing(msg, match);
            resolve();
        }
        // If a new time is specified
        else {
            let res = match[0].split(':');
            note.startHours = res[0];
            note.startMinutes = res[1];
            currentDate.setHours(res[0]);
            resolve();
        }
    });
    promise.then(() => {
        // Countdown to notification
        botFunctions.countdown(bot, note);
    });
    promise.catch(error => {
        console.log(error);
    });
})

// Updating the time every second
setInterval(() => {
    console.log("Main: " + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
    currentDate.setSeconds(currentDate.getSeconds() + 1);
    botFunctions.setNewTime(currentDate);
}, 1000);

// Time synchronization every 20s
setInterval(() => {
    let updateHours = currentDate.getHours();
    currentDate = new Date();
    currentDate.setHours(updateHours)
    console.log('New Time: ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
}, 20000);

module.exports = bot;