const messages = require('./messages'); // модуль с уведомлениями 
const myKeyboard = require('./keyboard'); // модуль с клавиатурой 
let timerId; // таймер проверки сообщений. Сбрасывется, чтобы бот не продолжал работу после нажатия на кнопку Stop
let infoObject; // объект, содержащий информацию для уведомления

function timeLeft(needMin = false) {
    let currentDate = new Date();
    let remains = infoObject.endDate - currentDate; // остаток в мс (от текущего момента до конца)
    let hours = parseInt(remains / (1000 * 60 * 60));
    let minutes = parseInt((remains / (1000 * 60)) - (hours * 60));

    if (needMin == true)
        return minutes;

    if (hours == 0)
        return (minutes + 'min');
    else
        return (hours + 'h ' + minutes + 'min');
}

// отсчет времени при передаче боту двух чисел 
function countdown(bot, note, pauseTimeLeft = 0) {
    let startDate = new Date(); // начальная дата
    let endDate = new Date(); // дата уведомления
    let currentPlus; // текущее надбавка к дате (зависит от того, работал ты или отдыхал)
    let timeToWork = true;

    // значение по умолчанию - длительность рабочего цикла
    if (pauseTimeLeft == 0)
        currentPlus = note.workTime;
    // если была нажата пауза
    else
        currentPlus = pauseTimeLeft;

    endDate.setMinutes(startDate.getMinutes() + currentPlus); // установка конечной даты

    infoObject = {
        'note': note,
        'startDate': startDate,
        'endDate': endDate,
        'timeToWork': timeToWork,
        'currentPlus': currentPlus
    }
    // появление клавиатуры
    let noteTxt = 'It is ' + startDate.getHours() + ':' + minuteFormat(startDate.getMinutes()) + "\n" + 'I will call you at ' + endDate.getHours() + ':' + minuteFormat(endDate.getMinutes());
    bot.sendMessage(note.usID, noteTxt, {
        reply_markup: {
            keyboard: myKeyboard.stopKb
        }
    });

    checkCurTime(infoObject);
}

// ф-ия дописывает ведущий 0 к минутам, если число состоит из одной цифры
function minuteFormat(minute) {
    if (Math.floor(minute / 10) == 0)
        return '0' + minute;
    else
        return minute;
}

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
        messages.botSendMyMessage('It\'s time to ' + word + '!\nI will call you at ' + infoObject.endDate.getHours() + ':' + minuteFormat(infoObject.endDate.getMinutes()));
    }

    timerId = setTimeout(checkCurTime, 1000, infoObject);
}

function clrTimeout() {
    clearTimeout(timerId);
}

module.exports = {
    'timeLeft': timeLeft,
    'countdown': countdown,
    'clrTimeout': clrTimeout
}