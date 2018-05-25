process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const token = '565081038:AAHuSG_VwkHuA38PFGrw2C3cUampbKe_QcE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curse/, (msg, match) => {
 
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выбор валюты:', {
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: '€ EUR',
                      callback_data: 'EUR'
                },
                {
                    text: '$ USD',
                    callback_data: 'USD'
              },
              {
                text: '₽ RUR',
                callback_data: 'RUR'
          },
          {
            text: 'Ƀ BTC',
            callback_data: 'BTC'
      }
              ]
          ]
      }
  });
});

bot.on('callback_query', query => {
    const id = query.message.chat.id;

    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, response, body) {
        const data = JSON.parse(body);
        const result = data.filter(item => item.ccy === query.data)[0];
        const flag = {
            'EUR': '🇪🇺',
            'USD': '🇺🇸',
            'RUR': '🇷🇺',
            'UAH': '🇺🇦',
            'BTC': '₿'
        }
        let md = `
        *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
        Покупка: _${result.buy}_
        Продажа: _${result.sale}_
        `;
    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
    })
})
