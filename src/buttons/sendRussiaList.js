// Отправляем кнопки с выбором курортов в России

module.exports = (ctx) => {
    const citiesRu = {
        reply_markup: {
            inline_keyboard:  [
                [{ text: 'Сочи и Красная поляна', callback_data: 'sochi' }, {text: 'Крым', callback_data: 'crimea'}],
                [{ text: 'Анапа', callback_data: 'anapa' }, {text: 'Калининград', callback_data: 'kalin'}]
            ]
        }
    };
    ctx.telegram.sendMessage(ctx.chat.id, 'Россия большая! Куда именно вы полетите?', citiesRu);
};