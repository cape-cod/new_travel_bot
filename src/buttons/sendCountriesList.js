// Отправляем кнопки с выбором стран

module.exports = (ctx) => {
    const countries = {
        reply_markup: {
            inline_keyboard:  [
                [{ text: 'Россия', callback_data: 'russia' }, {text: 'Турция', callback_data: 'turkey'}],
                [{text: 'Кипр', callback_data: 'cyprus'}],                        
                [{text: 'ОАЭ', callback_data: 'uae'}],
                [{text: 'Танзания', callback_data: 'zanzibar'}],
                [{text: 'Абхазия', callback_data: 'abkhazia'}],
                [{text: 'Куба', callback_data: 'cuba'}]
            ]
        }
    };
    ctx.telegram.sendMessage(ctx.chat.id, 'Сначала выберите, куда вы хотите улететь.', countries);
}