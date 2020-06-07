process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const token = '1119527180:AAG0EODTNzz7WE0plnesGAayD02jNrq_kJE';
const bot = new TelegramBot(token, {
  polling: true
});

// при написании сообщения боту запускается функция
// bot.onText(/([0-9][0-9]) ([0-9][0-9])/, function (msg, match) {
bot.onText(/([0-9]) ([0-9])/, function (msg, match) {
  let userId = msg.from.id;
  let work = match[1];
  let relax = match[2];

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

  bot.sendMessage(note.usID, 'It is ' + startDate.getHours() + ':' + startDate.getMinutes());
  bot.sendMessage(note.usID, 'I will call you at ' + endDate.getHours() + ':' + endDate.getMinutes());

  checkCurTime(infoObject);
})

function checkCurTime(infoObject) {
  let currentDate = new Date();

  // если пришло время присылать уведомление
  if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
    if (infoObject.timeToWork == true) {
      bot.sendMessage(infoObject.note.usID, 'It\'s time to relax!');
      infoObject.timeToWork = false;
      infoObject.currentPlus = infoObject.note.relaxTime;
    }
    // 
    else {
      bot.sendMessage(infoObject.note.usID, 'It\'s time to work!');
      infoObject.timeToWork = true;
      infoObject.currentPlus = infoObject.note.workTime;
    }

    infoObject.startDate = currentDate;
    infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
    bot.sendMessage(infoObject.note.usID, 'I will call you at ' + infoObject.endDate.getHours() + ':' + infoObject.endDate.getMinutes());
  }

  setTimeout(checkCurTime, 1000, infoObject);
}

// ! Включить VPN
// TODO: проверка ввода на корректность (регулярное выражение) + реагирование на некорректный ввод
// TODO: Старт работы по кнопке
// TODO: Кнопка для остановки бота
// TODO: Перенести бота на сервер
// ! Выключить VPN