// Отправляем кнопки с выбором курортов в Турции

module.exports = (ctx) => {
    const citiesTr = {
        reply_markup: {
            inline_keyboard:  [
                [{ text: 'Анталийское побережье', callback_data: 'ayt' }],
                [{ text: 'Эгейское побережье', callback_data: 'ege'}],
                [{ text: 'Стамбул', callback_data: 'ist' }]
            ]
        }
    };
    ctx.telegram.sendMessage(ctx.chat.id, 'Куда именно в Турции?', citiesTr);
};