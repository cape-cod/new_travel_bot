// Отправляем кнопки с выбором городов вылета

module.exports = (ctx) => {
    const cities = {
        reply_markup: {
            inline_keyboard:  [
                [{ text: 'Москва', callback_data: 'MOW' }, {text: 'С.-Петербург', callback_data: 'LED'}],
                [{ text: 'Казань', callback_data: 'KZN' }, {text: 'Екатеринбург', callback_data: 'SVX'}],
                [{ text: 'Самара', callback_data: 'KUF' }, {text: 'Уфа', callback_data: 'UFA'}],
                [{ text: 'Новосибирск', callback_data: 'OVB' }, {text: 'Краснодар', callback_data: 'KRR'}]
            ]
        }
    };
    ctx.telegram.sendMessage(ctx.chat.id, 'Выберите откуда вы хотите улететь.', cities);
};