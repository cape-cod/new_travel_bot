


// Отправляем выбор кол-ва дней отдыха
module.exports = (ctx) => {
    const duration = {
        reply_markup: {
            inline_keyboard:  [
                [{ text: '2-3 ночи', callback_data: '2-3' }, {text: '4-5 ночей', callback_data: '4-5'}],
                [{text: '6-7 ночей', callback_data: '6-7'}, {text: '8-9 ночей', callback_data: '8-9'}],
                [{text: '10-12 ночей', callback_data: '10-12'}, {text: '13-14 ночей', callback_data: '13-14'}],
                [{text: '15-19 ночей', callback_data: '15-19'}, {text: '20-25 ночей', callback_data: '20-25'}]
            ]
        }
    };
    ctx.telegram.sendMessage(ctx.chat.id, 'На сколько ночей вы хотите улететь?', duration);
};