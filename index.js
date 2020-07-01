process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./project_modules/keyboard'); // модуль с клавиатурой 
const messages = require('./project_modules/messages'); // модуль с уведомлениями 
const botFunctions = require('./project_modules/bot_functions'); // модуль с функциями и методами бота 

const token = process.env.TOKEN; // TOKEN бота
const bot = new TelegramBot(token, {
  polling: true
});
messages.setBot(bot); // добавляем bot в модуль messages, чтобы оттуда отправлять сообщения
let note = {}; // объект, содержащий данные, которые передадутся в ф-ию ожидания отправки уведомления 
let currentDate = new Date(); // текущее время

bot.on('message', msg => {
  let userId = msg.from.id; // id отправителя сообщения 
  messages.setUserID(userId); // добавляем userId в модуль messages, чтобы оттуда отправлять сообщения

  switch (msg.text) {
    case '/start':
      botFunctions.resetTimeToWork();
      // появление клавиатуры
      bot.sendMessage(userId, ('Hello, ' + msg.from.first_name + '!\n' + messages.botAnswers('firstStart')), {
        reply_markup: {
          resize_keyboard: true,
          keyboard: myKeyboard.startKb
        }
      });
      break;
    case 'START':
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, messages.botAnswers('butStart'), {
        reply_markup: {
          resize_keyboard: true,
          keyboard: myKeyboard.intervalsKb
        }
      });
      break;
    case 'WRONG TIME':
      botFunctions.resetTimeToWork();
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, 'What\'s time is it (for example 15:30)?', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: myKeyboard.stopOnlyKb
        }
      });
      break;
    case 'STOP':
      botFunctions.resetTimeToWork();
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, messages.botAnswers('butStop'), {
        reply_markup: {
          resize_keyboard: true,
          keyboard: myKeyboard.startKb
        }
      });
      break;
    case 'PAUSE':
      // сброс таймера
      botFunctions.clrTimeout();
      // появление кнопки RESUME
      bot.sendMessage(userId, messages.botAnswers('butPause'), {
        reply_markup: {
          resize_keyboard: true,
          keyboard: myKeyboard.pauseKb
        }
      });
      break;
    case 'RESUME':
      // появление кнопки PAUSE
      bot.sendMessage(userId, 'I\'m working again', {
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

// интервал работы - отдыха или новое время
bot.onText(/(\d{1,4})( |:)(\d{1,4})/, (msg, match) => {
  botFunctions.resetTimeToWork();
  let promise = new Promise((resolve, reject) => {
    // если указан интервал
    if (/([1-9]\d{0,3})( )([1-9]\d{0,3})/.test(match[0])) {
      note = botFunctions.notePreparing(msg, match);
      resolve();
    }
    // если указано новое время
    else {
      let res = match[0].split(':');
      note.startHours = res[0];
      note.startMinutes = res[1];
      currentDate.setHours(res[0]);
      resolve();
    }
  });
  promise.then(() => {
    // отсчет времени до уведомления
    botFunctions.countdown(bot, note);
  });
  promise.catch(error => {
    console.log(error);
  });
})

// каждую секунду обновляем время
setInterval(() => {
  console.log("Main: " + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
  currentDate.setSeconds(currentDate.getSeconds() + 1);
  botFunctions.setNewTime(currentDate);
}, 1000);

// каждые 20 секунд синхронизируем время
setInterval(() => {
  let updateHours = currentDate.getHours();
  currentDate = new Date();
  currentDate.setHours(updateHours)
  console.log('New Time: ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
}, 20000);