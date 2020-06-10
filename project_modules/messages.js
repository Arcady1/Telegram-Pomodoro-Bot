// руководство; ф-ия принимает заголовок (optional) и тип руководства (firstStart / butStart / butStop / butHelp), возвращает текст руководства
function fullRules(typeOfRule, title = '') {
  let rulText;

  if (typeOfRule == 'firstStart')
    rulText = 'This bot will write you,\nwhen you have to work and relax.\nPress START for detals.';

  else if (typeOfRule == 'butStart')
    rulText = 'Send me two numbers, for example: 50 10.\nI\'ll notify you after 50 and 60 minutes\n\nMinimum: 1min\nMaximum: 1439min (23h 59min)\n\nIt\'ll be repeated until then you press STOP.';
  else if (typeOfRule == 'butStop')
    rulText = 'Press START to restart me and find out some details.';
  else if (typeOfRule == 'butHelp')
    rulText = 'Send me \/start to restart me.';

  return (title + rulText);
}

module.exports = {
  'fullRules': fullRules
}