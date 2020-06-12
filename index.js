process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./project_modules/keyboard'); // модуль с клавиатурой 
const messages = require('./project_modules/messages'); // модуль с уведомлениями 
const config = require('./project_modules/config'); // модуль с конфигурацией проекта 
const botFunctions = require('./project_modules/bot_functions'); // модуль с функциями и методами бота 

const token = config.TOKEN; // TOKEN бота
const bot = new TelegramBot(token, {
  polling: true
});
messages.setBot(bot); // добавляем bot в модуль messages, чтобы оттуда отправлять сообщения

// при старте бота
bot.onText(/\/start/, msg => {
  let userId = msg.from.id; // id отправителя сообщения 
  // появление клавиатуры
  bot.sendMessage(userId, ('Hello, ' + msg.from.first_name + '!\n' + messages.botAnswers('firstStart')), {
    reply_markup: {
      keyboard: myKeyboard.startKb
    }
  });
})

// при вводе команд
bot.onText(/\/?(\w+)(\s)*(\w+)*/, (msg, match) => {
  let userId = msg.from.id; // id отправителя сообщения 
  messages.setUserID(userId); // добавляем userId в модуль messages, чтобы оттуда отправлять сообщения
  let userText = msg.text; // текст отправителя 
  let workRealxRegExp = /(\d\d*) (\d\d*)/; // ожидаемые интервалы работы / отдыха; хранятся в match[1] и match[3] 
  let wrongTimeRegExp = /(\d)(\d)\:(\d)(\d)/; // время пользователя
  let work = match[1];
  let relax = match[3];
  let note = {
    'usID': userId,
    'workTime': parseInt(work),
    'relaxTime': parseInt(relax)
  }
  console.log(match[0]);
  if (userText == 'START') {
    // сброс таймера
    botFunctions.clrTimeout();
    // появление клавиатуры
    bot.sendMessage(userId, messages.botAnswers('butStart'), {
      reply_markup: {
        keyboard: myKeyboard.intervalsKb
      }
    });
  }
  // интервал работы - отдыха
  else if (workRealxRegExp.test(match[0])) {
    // сброс таймера, чтобы интервалы не накладывались 
    botFunctions.clrTimeout();
    // отсчет до уведомления
    botFunctions.countdown(bot, note);
  }
  // WRONG TIME 
  else if (userText == 'WRONG TIME') {
    // сброс таймера
    botFunctions.clrTimeout();
    bot.sendMessage(userId, 'Send me the correct time (for example 15:30):', {
      reply_markup: {
        keyboard: myKeyboard.stopOnlyKb
      }
    });
  }
  // указано время 
  // ! НЕТ СООТВЕТСВИЯ REGEXP  в 26 строке
  
  else if (wrongTimeRegExp.test(match[0])) {
    console.log("Yes!");
  }
  // STOP
  else if (userText == 'STOP') {
    // сброс таймера
    botFunctions.clrTimeout();
    // появление клавиатуры
    bot.sendMessage(userId, messages.botAnswers('butStop'), {
      reply_markup: {
        keyboard: myKeyboard.startKb
      }
    });
  }
  // PAUSE
  else if (userText == 'PAUSE') {
    // сброс таймера
    botFunctions.clrTimeout();
    // появление кнопки RESUME
    bot.sendMessage(userId, messages.botAnswers('butPause', botFunctions.timeLeft()), {
      reply_markup: {
        keyboard: myKeyboard.pauseKb
      }
    });
  }
  // RESUME
  else if (userText == 'RESUME') {
    // появление кнопки PAUSE
    bot.sendMessage(userId, 'I\'m working again', {
      reply_markup: {
        keyboard: myKeyboard.stopKb
      }
    }).then(() => {
      botFunctions.countdown(bot, note, botFunctions.timeLeft(true)); // последний аргумент - оставшееся время до уведомления (в min) 
    })
  }
  // /help
  else if (userText == '/help') {
    messages.botSendMyMessage('butHelp');
  }
  // если команды не существует и не является /start
  else if (userText != '/start') {
    messages.botSendMyMessage('butHelp');
  }
})