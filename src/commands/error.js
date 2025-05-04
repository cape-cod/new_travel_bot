const messages = require('../messages');
const sendCountriesList = require('../buttons/sendCountriesList');


module.exports = (bot) => {
    // Команды из меню бота
    bot.command('error', (ctx) => {
        ctx.reply("Если вы столкнулись с ошибками в работе бота, напишите нам. Мы обязательно всё исправим!");
        bot.use((ctx, next) => {
    
            let input = ctx.message.text;
            if(ctx.updateSubTypes[0] == "text") {
                bot.telegram.sendMessage(-493189799, "@" + ctx.from.username + " прислал ошибку: " + input);
            } else {
                bot.telegram.sendMessage(-493189799, ctx.from.username + " прислал " + ctx.updateSubTypes[0]);
            }
            
            ctx.telegram.sendMessage(ctx.chat.id, messages.errorThanks + ctx.from.first_name + messages.newStartMessage);
            sendCountriesList(ctx);
            next();
        });
    });
};
