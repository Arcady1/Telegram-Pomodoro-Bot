process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./project_modules/keyboard'); // модуль с клавиатурой 
const messages = require('./project_modules/messages'); // модуль с уведомлениями 
const config = require('./project_modules/config'); // модуль с конфигурацией проекта 
const botFunctions = require('./project_modules/bot_functions'); // модуль с функциями и методами бота 

const token = config.TOKEN(); // TOKEN бота
const bot = new TelegramBot(token, {
  polling: true
});
messages.setBot(bot); // добавляем bot в модуль messages, чтобы оттуда отправлять сообщения
let note; // !

// при старте бота
bot.onText(/\/start/, msg => {
  let userId = msg.from.id;
  messages.setUserID(userId); // добавляем userId в модуль messages, чтобы оттуда отправлять сообщения
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
  let userText = msg.text; // текст отправителя 
  let expectInput = /(\d\d*)(\s)*(\d\d*)/; // ожидаемый интервал работы - отдыха 

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
  else if (expectInput.test(match[0])) {
    // сброс таймера, чтобы интервалы не накладывались 
    botFunctions.clrTimeout();

    let work = match[1];
    let relax = match[3];
    note = {
      'usID': userId,
      'workTime': parseInt(work),
      'relaxTime': parseInt(relax)
    }

    botFunctions.countdown(bot, note);
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
    bot.sendMessage(userId, messages.botAnswers('butResume', botFunctions.timeLeft()), {
      reply_markup: {
        keyboard: myKeyboard.stopKb
      }
    });
    // ?
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