# [Telegram Pomodoro Bot][1]

## Description
This bot let you work more effective. It reminds you when it's time to work and relax.  
For example, if it's 9:00 and you send two numbers to the bot 50 and 10 (minutes) it will write you at 9:50, 10:00, 10:50, 11:00, and so on.  

## Deploy on [Glitch][2]
1. Sign in / sign up.
2. Create a *NewProject*.
3. *Import from GitHub* and paste the path to your repository.
4. Then you should remove unused modules paths to exclude errors. I recommend adding the telegram bot token to *.env* and name it TOKEN, for example. And use `const token = process.env.TOKEN;` to create token.  


If you don't see any errors in *Tools*, congratulations!  
Otherwise continue reading.
***

Open the terminal in *Tools*, *Terminal* and write:  
`apt-get update`  
`apt-get install git -su`.  
`git`. There must be no mistake.  
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`.  
The next command is quite large:  
`export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`.  
Write `nvm` to check if the loading was correct.  
If there are any errors check the command [in this repository][4].  
`nvm install <version>`. Вместо *version* указываем ту версию, которая использовалась при разработке проекта.  
Чтобы ее узнать, необходимо ввести в терминале своего ПК `node -v`.  
`nvm use <version>`. Вместо *version* указать ту же версию, что и на предыдущем шаге.  
`node -v`. Должна появиться используемая версия.  
Осталось установить пакеты, используемые в проекте:
`npm i`.  
Запускаем бота:  
`npm run start`.  
Если через несколько секунд появляется ошибка ` {"code":"ETELEGRAM","message":"ETELEGRAM: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running"}`, значит, ваш бот уже работает. Просто нажмите Ctrl + C.  
После чего заходим в профиль, находим *Recent Projects* и кликаем на проект.  
Появится окошко с надписью *Started*. Пока оно активно, бот работает. В противном случае он отключится через 5 мин. Подробнее можно прочитать [здесь][3].  

## Может быть полезно
* [nvm-sh/nvm][4]  
* [Telegram bot on JavaScript with free hosting][5]  
* [Deploying a GitHub app to Glitch][6]



[1]: https://t.me/pomodoro_25and5_bot                                                     "bot"
[2]: https://glitch.com/                                                                  "Glitch"
[3]: https://glitch.com/help/restrictions/                                                "timing-Glitch"
[4]: https://github.com/nvm-sh/nvm                                                        "nvm"
[5]: https://medium.com/roomjs/telegram-bot-on-javascript-with-free-hosting-53ae01bce991  "medium"
[6]: https://andrewlock.net/creating-my-first-github-app-with-probot-part-3-deploying-to-glitch/
