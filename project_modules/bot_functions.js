const myKeyboard = require('./keyboard'); // модуль с клавиатурой 
let timerId; // таймер проверки сообщений. Сбрасывется, чтобы бот не продолжал работу после нажатия на кнопку Stop
let infoObject; // объект, содержащий информацию для уведомления
let currentDate = new Date(); // текущее время
let bot;

// ф-ия подсчета и вывода времени, оставшегося после нажатия кнопки паузы
function timeLeft() {
    let leftMin = infoObject.currentPlus - infoObject.pastMin;
    let leftHours = parseInt(leftMin / 60);
    let leftMinutes = parseInt(leftMin - (leftHours * 60));

    if (leftHours == 0)
        return (leftMinutes + 'min');
    else
        return (leftHours + 'h ' + leftMinutes + 'min');
}

// ф-ия подготавливает данные, которые передадутся в ф-ию ожидания отправки уведомления 
function notePreparing(msg, match) {
    // сброс таймера, чтобы интервалы не накладывались 
    clrTimeout(timerId);

    let userId = msg.from.id; // id отправителя сообщения 
    let work = match[1];
    let relax = match[3];
    let retNote = {
        'usID': userId,
        'workTime': parseInt(work),
        'relaxTime': parseInt(relax)
    }
    return retNote;
}

// отсчет времени при передаче боту двух чисел 
function countdown(bot_, note, timeFromPause = false) {
    bot = bot_;
    let startDate = new Date(); // начальная дата
    let endDate = new Date(); // дата уведомления
    let currentPlus; // текущее надбавка к дате (зависит от того, работал ты или отдыхал)
    let timeToWork = true;

    let promise = new Promise((resolve, reject) => {
        startDate.setHours(currentDate.getHours());
        // значение по умолчанию - длительность рабочего цикла
        if (timeFromPause == false)
            currentPlus = note.workTime;
        // если была нажата кнопка PAUSE а затем RESUME
        else
            currentPlus = parseInt(parseInt(infoObject.currentPlus - infoObject.pastMin)); // время от паузы до старта отсчета (мин)
        // установка конечной даты
        endDate.setHours(startDate.getHours());
        endDate.setMinutes(startDate.getMinutes() + currentPlus);
        resolve();
    });
    promise.then(() => {
        infoObject = {
            'note': note,
            'startDate': startDate,
            'endDate': endDate,
            'timeToWork': timeToWork,
            'currentPlus': currentPlus
        }
        // появление клавиатуры
        let noteTxt = 'It is ' + infoObject.startDate.getHours() + ':' + minuteFormat(infoObject.startDate.getMinutes()) + "\n" + 'I will call you at ' + infoObject.endDate.getHours() + ':' + minuteFormat(infoObject.endDate.getMinutes());
        bot.sendMessage(note.usID, noteTxt, {
            reply_markup: {
                resize_keyboard: true,
                keyboard: myKeyboard.stopKb
            }
        });
        checkCurTime(infoObject);
    });
    promise.catch(error => {
        console.log(error);
    })
}

// ф-ия дописывает ведущий 0 к минутам, если число состоит из одной цифры
function minuteFormat(minute) {
    if (Math.floor(minute / 10) == 0)
        return '0' + minute;
    else
        return minute;
}

// ф-ия проверяет каждую секунду, не пора ли присылать уведомление
function checkCurTime() {
    let pastMin = parseInt((currentDate - infoObject.startDate) / 1000 / 60); // прошедшее время (мин) 
    infoObject.pastMin = pastMin;
    // если пришло время, присылать уведомление
    if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
        let word;

        if (infoObject.timeToWork == true) {
            infoObject.timeToWork = false;
            infoObject.currentPlus = infoObject.note.relaxTime;
            word = 'relax';
        } else {
            infoObject.timeToWork = true;
            infoObject.currentPlus = infoObject.note.workTime;
            word = 'work';
        }

        infoObject.startDate = currentDate;
        infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
        bot.sendMessage(infoObject.note.usID, 'It\'s time to ' + word + '!\nI will call you at ' + infoObject.endDate.getHours() + ':' + minuteFormat(infoObject.endDate.getMinutes()));
    }
    timerId = setTimeout(checkCurTime, 500);
}

function clrTimeout() {
    clearTimeout(timerId);
}

function setNewTime(newTime) {
    currentDate = newTime;
}

module.exports = {
    'timeLeft': timeLeft,
    'countdown': countdown,
    'clrTimeout': clrTimeout,
    'notePreparing': notePreparing,
    'setNewTime': setNewTime
}