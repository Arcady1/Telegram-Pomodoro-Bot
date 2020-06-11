// руководство; ф-ия принимает заголовок (optional) и тип руководства (firstStart / butStart / butStop / butHelp), возвращает текст руководства
function fullRules(typeOfRule, title = '') {
  let rulText;

  if (typeOfRule == 'firstStart')
    rulText = 'This bot will write you, when you have to work and relax.\nPress START to begin.';

  else if (typeOfRule == 'butStart')
    rulText = 'You can select the interval or state your own one,\nfor example: 50 10.\n\nMinimum: 1min\nMaximum: 1439min (23h 59min)\n\nNotifications will be sent until then you press or write STOP.';
  else if (typeOfRule == 'butStop')
    rulText = 'Press START to restart me or \/help for help.';
  else if (typeOfRule == 'butHelp')
    rulText = 'Available commands:\n\n\/start - restart the bot\nSTART - select a new interval\nSTOP - stop working';

  return (title + rulText);
}

module.exports = {
  'fullRules': fullRules
}