# [Telegram bot 52/17][1]

## Описание
Telegram bot 52/17 регулярно напоминанет, когда нужно сесть за работу, а когда пора отдыхать.
Представим, что сейчас 9:00. Вы отправляете два числа, например: <50> <17>, где 50 - время на работу, 17 - время на отдых.
Тогда бот напишет в 9:50 и 10:00; 10:50 и 11:00 и т.д.

## Деплой Telegram бота на [Glitch][2]
1. Регистрируемся на сайте (есть возможность авторизироваться с помощью GitHub)
2. Создаем новый проект *NewProject*
3. Нажимаем *Import from GitHub* и прописываем путь к репозиторию 
4. В левом нижнем углу нажимаем *Tools*, *Terminal* и пишем следующие команды:  
`	apt-get update  
	apt-get install git -su`  
  В качестве проверки вводим команду `git`. Ошибок быть не должно  
  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash  
	export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
	[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
	nvm					// для проверки
	nvm install <version>			// ставить ту версию, которая использовалась при разоаботке проекта. Чтобы узнать, ввести в терминале СВОЕГО ПК: node -v
	nvm use <version>			// указать ту же версию, что и выше
	node -v					// для проверки
	npm i
	npm run start`



[1]: https://t.me/X_52_17_bot "bot"
[2]: https://glitch.com/ "Glitch"
