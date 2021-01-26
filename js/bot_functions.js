const myKeyboard = require('./keyboard');
let timerId; // Message check timer. It is reset to prevent the bot from continuing to work after the Stop button is pressed
let infoObject; // Object containing information for notification
let currentDate = new Date();
let bot;

// Function for counting and displaying the time left after pressing the pause button
function timeLeft() {
    let leftMin = infoObject.currentPlus - infoObject.pastMin;
    let leftHours = parseInt(leftMin / 60);
    let leftMinutes = parseInt(leftMin - (leftHours * 60));

    if (leftHours == 0)
        return (leftMinutes + 'min');
    else
        return (leftHours + 'h ' + leftMinutes + 'min');
}

// The function prepares the data that will be sent to the function waiting for the notification to be sent 
function notePreparing(msg, match) {
    clrTimeout(timerId);

    let userId = msg.from.id; // Message sender id 
    let work = match[1];
    let relax = match[3];
    let retNote = {
        'usID': userId,
        'workTime': parseInt(work),
        'relaxTime': parseInt(relax)
    }
    return retNote;
}

let timeToWork = true;

// Time countdown when passing two numbers to the bot 
function countdown(bot_, note, timeFromPause = false) {
    bot = bot_;
    let startDate = new Date();
    let endDate = new Date(); // Date of notification
    let currentPlus; // Current date allowance (depends on whether you were working or vacationing)  
    let promise = new Promise((resolve, reject) => {
        startDate.setHours(currentDate.getHours());
        // The default value is the duration of the duty cycle
        if (timeFromPause == false)
            currentPlus = note.workTime;
        // If the PAUSE button was pressed and then the RESUME button was pressed
        else
            currentPlus = parseInt(parseInt(infoObject.currentPlus - infoObject.pastMin)); // Time from pause to start of counting (min)
        // Setting the end date
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
        // Keyboard appearance
        let noteTxt = `I'll call you after ${infoObject.currentPlus} min`;
        minuteFormat(infoObject.endDate.getMinutes());

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

// The function adds a leading 0 to the minutes if the number consists of one digit
function minuteFormat(minute) {
    if (Math.floor(minute / 10) == 0)
        return '0' + minute;
    else
        return minute;
}

// The function checks every second if it is time to send a notification
function checkCurTime() {
    let pastMin = parseInt((currentDate - infoObject.startDate) / 1000 / 60);
    infoObject.pastMin = pastMin;

    // If the time is right, send a notice
    if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
        let word;

        if (infoObject.timeToWork == true) {
            timeToWork = false;
            infoObject.timeToWork = false;
            infoObject.currentPlus = infoObject.note.relaxTime;
            word = 'relax';
        } else {
            timeToWork = true;
            infoObject.timeToWork = true;
            infoObject.currentPlus = infoObject.note.workTime;
            word = 'work';
        }

        infoObject.startDate = currentDate;
        infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
        bot.sendMessage(infoObject.note.usID, `It's time to ${word}!\nI'll call you after ${infoObject.currentPlus} min`);
    }
    timerId = setTimeout(checkCurTime, 500);
}

function clrTimeout() {
    clearTimeout(timerId);
}

function setNewTime(newTime) {
    currentDate = newTime;
}

function resetTimeToWork() {
    timeToWork = true;
}

module.exports = {
    'timeLeft': timeLeft,
    'countdown': countdown,
    'clrTimeout': clrTimeout,
    'notePreparing': notePreparing,
    'setNewTime': setNewTime,
    'resetTimeToWork': resetTimeToWork
}