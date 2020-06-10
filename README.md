# [Telegram bot 52/17][1]

## Описание
Telegram bot 52/17 позволяет работать эффективнее, напоминая, когда пришло время поработать, а когда - отдохнуть.  
Представим, что сейчас 9:00. Вы отправляете два числа, например: <50> <17>, где 50 - время на работу, 17 - время на отдых. 
Тогда бот напишет в 9:50 и 10:00; 10:50 и 11:00 и т.д.

## Деплой Telegram бота на [Glitch][2]
1. Регистрируемся на сайте (есть возможность авторизоваться с помощью GitHub)
2. Создаем новый проект *NewProject*
3. Нажимаем *Import from GitHub* и прописываем путь к репозиторию 
4. В левом нижнем углу нажимаем *Tools*, *Terminal* и пишем следующие команды:  
`apt-get update`  
`apt-get install git -su`  
В качестве проверки вводим команду `git`. Ошибок быть не должно  
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`  
`export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`  
Чтобы проверить, установился ли nvm вводим команду `nvm`.   
Если появились ошибки или ничего не отобразилось, посмотрите команды [в этом репозитории][4].  
`nvm install <version>`. Вместо *version* указываем ту версию, которая использовалась при разработке проекта.  
Чтобы ее узнать, необходимо ввести в терминале своего ПК: `node -v`  
`nvm use <version>`. Вместо *version* указать ту же версию, что и на предыдущем шаге
`node -v`. Должна появиться используемая версия  
Осталось установить пакеты, используемые в проекте:
`npm i`  
Запускаем бота:  
`npm run start`  
Если через несколько секунд появляется ошибка ` {"code":"ETELEGRAM","message":"ETELEGRAM: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running"}`, значит, ваш бот уже работает. Просто нажмите Ctrl + C.  
Чтобы удостовериться в работоспособности бота, заходим в профиль, находим *Recent Projects* и кликаем на проект.  
После чего вы увидите окошко с надписью *Started*. Пока оно активно, бот работает. В противном случае он отключится через 5 мин. Подробнее можно прочитать [по этой ссылке][3].  

## Будет полезно
[nvm-sh/nvm][4]  
[Telegram bot on JavaScript with free hosting][5]  



[1]: https://t.me/X_52_17_bot                                                             "bot"
[2]: https://glitch.com/                                                                  "Glitch"
[3]: https://glitch.com/help/restrictions/                                                "timing-Glitch"
[4]: https://github.com/nvm-sh/nvm                                                        "nvm"
[5]: https://medium.com/roomjs/telegram-bot-on-javascript-with-free-hosting-53ae01bce991  "medium"
