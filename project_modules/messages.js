// ! ОТПРАВКА СООБЩЕНИЙ ОТ БОТА
let bot;
let userID;
// установка бота, чтобы отправлять сообщения из этого модуля
function setBot(mainBot) {
  bot = mainBot;
}
// !
function setUserID(user_id) {
  userID = user_id;
}

// ! руководство; ф-ия принимает заголовок (optional) и тип руководства (firstStart / butStart / butStop / butHelp / butPause), возвращает текст руководства
function botAnswers(commandText, optional_text = '') {
  if (commandText == 'firstStart')
    return ('This bot will write you, when you have to work and relax.\nPress START to begin.');
  if (commandText == 'butStart')
    return ('You can select the interval or state your own one,\nfor example: 30 15.\n\nMinimum: 1min\nMaximum: 1439min (23h 59min)\n\nNotifications will be sent until then you press or write STOP.');
  if (commandText == 'butStop')
    return ('Press START to restart me or \/help for help.');
  if (commandText == 'butPause')
    return ('On pause.\n\nTime left: ' + optional_text);
  if (commandText == 'butHelp')
    return ('Available commands:\n\n\/start - restart the bot\nSTART - select a new interval\nSTOP - stop working\nPAUSE - pause the bot. After restarting it\'ll continue working');

  return commandText;
}

function botSendMyMessage(textOrCommand) {
  textOrCommand = botAnswers(textOrCommand); // если введена не команда, то botAnswers вернет переданное сообщение, иначе - подсказку
  bot.sendMessage(userID, textOrCommand);
}

module.exports = {
  'setBot': setBot,
  'setUserID': setUserID,
  'botAnswers': botAnswers,
  'botSendMyMessage': botSendMyMessage
}