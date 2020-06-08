process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const token = '1119527180:AAG0EODTNzz7WE0plnesGAayD02jNrq_kJE';
const bot = new TelegramBot(token, {
  polling: true
});

// при написании сообщения боту запускается функция
// минимум - 1 min
bot.onText(/([1-9][0-9]*) ([1-9][0-9]*)/, function (msg, match) {
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

  bot.sendMessage(note.usID, 'It is ' + startDate.getHours() + ':' + startDate.getMinutes() + "\n" + 'I will call you at ' + endDate.getHours() + ':' + endDate.getMinutes());
  checkCurTime(infoObject);
})

// ф-ия проверяет каждую секунду, не пора ли присылать уведомление
function checkCurTime(infoObject) {
  let currentDate = new Date();
  let timeToW = infoObject.timeToWork;
  let modInfoObj;

  // если пришло время присылать уведомление
  if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
    if (timeToW == true) {
      modInfoObj = changeInfoObj(infoObject, currentDate, timeToW);
      infoObject = modInfoObj.infoObj;
      curDate = modInfoObj.curDate;
    } //
    else {
      modInfoObj = changeInfoObj(infoObject, currentDate, timeToW);
      infoObject = modInfoObj.infoObj;
      curDate = modInfoObj.curDate;
    }
  }

  setTimeout(checkCurTime, 1000, infoObject);
}

// ф-ия изменения объекта, содержащего информацию для уведомления и вывода сообщения
function changeInfoObj(infoObject, currentDate, timeToW) {
  let retObj, word;

  if (timeToW == true) {
    infoObject.timeToWork = false;
    infoObject.currentPlus = infoObject.note.workTime;
    infoObject.startDate = currentDate;
    infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
    word = 'relax';
  }
  // 
  else {
    infoObject.timeToWork = true;
    infoObject.currentPlus = infoObject.note.relaxTime;
    infoObject.startDate = currentDate;
    infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
    word = 'work';
  }

  bot.sendMessage(infoObject.note.usID, 'It\'s time to ' + word + '!\nI will call you at ' + infoObject.endDate.getHours() + ':' + infoObject.endDate.getMinutes());

  retObj = {
    'infoObj': infoObject,
    'curDate': currentDate
  }

  return retObj;
}

// ! Включить VPN
// TODO: реагирование на некорректный ввод и вывод ПОДСКАЗКИ (как вводить, min - 1 мин, max - 23ч 59 мин)
// TODO: если минуты - однозначное число, дописывать 0 (пр.: 12:1 -> 12:01)
// TODO: Старт работы по кнопке И вывод            ПОДСКАЗКИ (ВЫНЕСТИ В Ф-ИЮ, ТК ПОВТОРЯЕТСЯ)
// TODO: Кнопка для остановки бота
// TODO: Перенести бота на сервер
// ! Выключить VPN