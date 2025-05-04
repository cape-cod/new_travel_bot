const messages = require('../messages');
const sendCountriesList = require('../buttons/sendCountriesList');


module.exports = (bot) => {
    // Команды из меню бота
    bot.command('contact', (ctx) => {
        ctx.reply("Если вы хотите предложить сотрудничество или у вас есть какое-то важное сообщение для нас, вы можете отправить его здесь.");
        bot.use((ctx, next) => {
    
            let input = ctx.message.text;
            if(ctx.updateSubTypes[0] == "text") {
                bot.telegram.sendMessage(-493189799, "@" + ctx.from.username + " прислал сообщение: " + input);
            } else {
                bot.telegram.sendMessage(-493189799, ctx.from.username + " прислал " + ctx.updateSubTypes[0]);
            }
            
            ctx.telegram.sendMessage(ctx.chat.id, messages.contactThanks + ctx.from.first_name + messages.newStartMessage);
            sendCountriesList(ctx);
            next();
        });
    });
};
