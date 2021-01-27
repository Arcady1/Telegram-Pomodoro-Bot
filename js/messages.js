let bot;
let userID;
// Setting up a bot to send messages from this module
function setBot(mainBot) {
  bot = mainBot;
}

function setUserID(user_id) {
  userID = user_id;
}

// The function accepts the message text and returns an output
function botAnswers(commandText) {
  if (commandText == 'firstStart')
    return ('This bot will write you, when you have to work and relax.\n\nPress START to begin.\n/\help');
  else if (commandText == 'butStart')
    return ('You can select the interval or state your own one, for example: 30 15.\n\nMinimum: 1min\nMaximum: 1439min (23h 59min)\n\nNotifications will be sent until then you press or write STOP.\n/\help');
  else if (commandText == 'butStop')
    return ('Press START to restart me or \/help for help.');
  else if (commandText == 'butPause')
    return ('PAUSE');
  else if (commandText == 'butResume')
    return ('RESUME');
  else if (commandText == 'butHelp')
    return ('Available commands:\n\n\/start - restart the bot\nSTART - select a new interval\nSTOP - stop working\nPAUSE - pause the timer');

  return commandText;
}

function botSendMyMessage(textOrCommand) {
  let txt = botAnswers(textOrCommand); // If no command is entered, botAnswers will return the message passed, otherwise it will return a hint
  bot.sendMessage(userID, txt);
}

module.exports = {
  'setBot': setBot,
  'setUserID': setUserID,
  'botAnswers': botAnswers,
  'botSendMyMessage': botSendMyMessage
}