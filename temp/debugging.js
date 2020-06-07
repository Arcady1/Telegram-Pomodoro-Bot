// let date = new Date();
// console.log("OLD: " + date.getHours() + ":" + date.getMinutes());

// let newdate = new Date();
// newdate.setMinutes(date.getMinutes() + 50);
// console.log("NEW: " + newdate.getHours() + ":" + newdate.getMinutes());

 (function () {
    // создание напоминания
    let note = {
        'usID': 'userId',
        'workTime': 2,
        'relaxTime': 1
    }

    let startDate = new Date();
    let endDate = new Date();
    let currentPlus;
    let timeToWork = true;
    // let noticeDate = new Date();
    // сохраняю текцщцю дату
    // получаю конечную дату
    // указываю текущую надбавку = note.workTime
    // если текущая == конечной, то меняю конечную, увеличивая ее на текущую надбавку (relaxTime)

    currentPlus = note.workTime;
    endDate.setMinutes(startDate.getMinutes() + currentPlus);

    let infoObject = {
        'note': note,
        'startDate': startDate,
        'endDate': endDate,
        'timeToWork': timeToWork,
        'currentPlus': currentPlus
    }

    console.log('It is: ' + startDate.getHours() + ':' + startDate.getMinutes() + ' now');
    console.log('I will call you at: ' + endDate.getHours() + ':' + endDate.getMinutes());

    checkCurTime(infoObject);
})();

function checkCurTime(infoObject) {
    let currentDate = new Date();

    if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
        if (infoObject.timeToWork == true) {
            console.log('It\'s time to relax!');
            infoObject.timeToWork = false;
            infoObject.currentPlus = infoObject.note.relaxTime;
        }
        // 
        else {
            console.log('It\'s time to work!');
            infoObject.timeToWork = true;
            infoObject.currentPlus = infoObject.note.workTime;
        }

        infoObject.startDate = currentDate;
        infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
        console.log('I will call you at ' + infoObject.endDate.getHours() + ':' + infoObject.endDate.getMinutes());
    }

    setTimeout(checkCurTime, 1000, infoObject);
}