var telegramBot = require('node-telegram-bot-api');
const TOKEN = '207227159:AAG4lmrh8mQaa3zmF9PWi4gf5ymNjasiEs8';
var request = require('request');
var fs = require('fs');

let bot = new telegramBot(TOKEN, { polling: true });

bot.onText(/\/setadmin/, function (msg) {
    let echo = 'send token';
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, echo);
    bot.on('message', function (msg) {
        let confrim = msg.text;
        let username = msg.chat.username;
        if (confrim == TOKEN) {
            fs.appendFile('log.txt', '\n' + '*' + chatId + "-►" + username + ".", function (err) {
                if (err) throw err;
                console.log(`@${username} is admin`);
            })
            let echo = 'you are admin now';
            bot.sendMessage(chatId, echo);
        } else {
            let echo = 'token is wrong';
            bot.sendMessage(chatId, echo);
            console.log(`@${username} try to be admin with this token ${confrim} `);
        }
    })
})

bot.onText(/\/start/, function (msg) {
    console.log(`${msg.chat.username} using start`);
    let chatId = msg.chat.id;
    let username = msg.chat.username;
    fs.appendFile('log.txt', chatId + "-►" + username + ".", function (err) {
        if (err) throw err;
        console.log('user add');
    })
    let echo = 'hi there welcome';
    bot.sendMessage(chatId, echo);
})
bot.onText(/\/echo(.+)/, function (msg, match) {
    console.log(`${msg.chat.username} is using echo`);
    let chatId = msg.chat.id;
    let echo = match[1];
    bot.sendMessage(chatId, echo)
})
bot.onText(/\/movie(.+)/, function (msg, match) {
    console.log(`${msg.chat.username} using movie`);
    let chatId = msg.chat.id;
    let movie = match[1];
    request(`http://www.omdbapi.com/?t=${movie}&apikey=7aaaaff4`, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            console.log(`${msg.chat.username} get the answer`);
            bot.sendMessage(chatId, '__looking for__' + movie + '...', { parse_mode: "Markdown" })
                .then(function (msg) {
                    let res = JSON.parse(body)
                    bot.sendMessage(chatId, 'found it').then(
                        bot.sendPhoto(chatId, res.Poster, {
                            caption: 'result:\n' + 'title:' + res.Title + '\n' +
                                'relese year:' + res.Released + '\n' +
                                'actors:' + res.Actors + '\n'
                        })
                    )
                })

        }


    })
})