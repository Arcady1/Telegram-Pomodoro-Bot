process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./keyboard'); // модуль с клавиатурой
const messages = require('./messages'); // модуль с уведомлениями
const config = require('./config'); // модуль с конфигурацией проекта

let timerId; // таймер проверки сообщений. Сбрасывется, чтобы бот не продолжал работу после нажатия на кнопку Stop
const token = config.TOKEN(); // TOKEN бота
const bot = new TelegramBot(token, {
  polling: true
});

// при старте бота
bot.onText(/\/start/, msg => {
  let userId = msg.from.id;
  // появление клавиатуры
  bot.sendMessage(userId, '' + messages.fullRules('firstStart', ('Hello, ' + msg.from.first_name + '!\n')), {
    reply_markup: {
      keyboard: myKeyboard.startKb
    }
  });
})
// при вводе Start / Stop / интервал
bot.onText(/\/?(\w+)(\s)*(\w+)*/, (msg, match) => {
  let userId = msg.from.id; // id отправителя сообщения 
  let userText = msg.text; // текст отправителя 
  let expectInput = /(\d\d*)(\s)*(\d\d*)/; // ожидаемый интервал работы - отдыха 

  if (userText == 'START') {
    // сброс таймера
    clearTimeout(timerId);
    // появление клавиатуры
    bot.sendMessage(userId, messages.fullRules('butStart'), {
      reply_markup: {
        keyboard: myKeyboard.stopKb
      }
    });
  }
  // если введен интервал работы - отдыха
  else if (expectInput.test(match[0])) {
    // если введен интервал работа - отдых
    let work = match[1];
    let relax = match[3];

    // создание напоминания
    let note = {
      'usID': userId,
      'workTime': parseInt(work),
      'relaxTime': parseInt(relax)
    }

    let startDate = new Date(); // начальная дата
    let endDate = new Date(); // дата уведомления
    let currentPlus; // текущее надбавка к дате (зависит от того, работал ты или отдыхал)
    let timeToWork = true;

    currentPlus = note.workTime; // значение по умолчанию - длительность рабочего цикла
    endDate.setMinutes(startDate.getMinutes() + currentPlus); // установка конечной даты
    // объект, содержащий информацию для уведомления
    let infoObject = {
      'note': note,
      'startDate': startDate,
      'endDate': endDate,
      'timeToWork': timeToWork,
      'currentPlus': currentPlus
    }

    bot.sendMessage(note.usID, 'It is ' + startDate.getHours() + ':' + minuteFormat(startDate.getMinutes()) + "\n" + 'I will call you at ' + endDate.getHours() + ':' + minuteFormat(endDate.getMinutes()));
    checkCurTime(infoObject);
  }
  // если ввели STOP
  else if (userText == 'STOP') {
    // сброс таймера
    clearTimeout(timerId);
    // появление клавиатуры
    bot.sendMessage(userId, messages.fullRules('butStop'), {
      reply_markup: {
        keyboard: myKeyboard.startKb
      }
    });
  }
  // если ввели /help
  else if (userText == '/help') {
    bot.sendMessage(userId, messages.fullRules('butHelp'));
  }
  // если команды не существует и не является /start
  else if (userText != '/start') {
    bot.sendMessage(userId, 'Sorry, I don\'t understand you.\nSend me \/help to help you');
  }
})

// ф-ия проверяет каждую секунду, не пора ли присылать уведомление
function checkCurTime(infoObject) {
  let currentDate = new Date();

  // если пришло время, присылать уведомление
  if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
    let word;

    if (infoObject.timeToWork == true) {
      infoObject.timeToWork = false;
      infoObject.currentPlus = infoObject.note.relaxTime;
      word = 'relax';
    }
    // 
    else {
      infoObject.timeToWork = true;
      infoObject.currentPlus = infoObject.note.workTime;
      word = 'work';
    }

    infoObject.startDate = currentDate;
    infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
    bot.sendMessage(infoObject.note.usID, 'It\'s time to ' + word + '!\nI will call you at ' + infoObject.endDate.getHours() + ':' + minuteFormat(infoObject.endDate.getMinutes()));
  }

  timerId = setTimeout(checkCurTime, 1000, infoObject);
}
// ф-ия дописывает ведущий 0 к минутам, если число состоит из одной цифры
function minuteFormat(minute) {
  if (Math.floor(minute / 10) == 0)
    return '0' + minute;
  else
    return minute;
}