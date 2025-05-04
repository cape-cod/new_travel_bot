const startMessage = `, привет! Наш бот поможет найти самый выгодный способ улететь. Проверим все авиакомпании и турагентства.`;
const newStartMessage = `, давайте ещё раз посмотрим, что интересного есть по билетам и турам.`;
const errorThanks = `Спасибо! Мы получили ваше замечание и обязательно его учтём!

`;
const contactThanks = `Спасибо! Мы получили ваше сообщение и передали его владельцам бота.

`;

const firstPhrase000 = `Плохие новости. Мы ничего не нашли. Давайте попробуем другие даты или кол-во дней?
`;
const firstPhrase001 = `Покажется странным, но по вашему запросу есть только туры.
`;
const firstPhrase110 = `Билетов куча! А вот пакетных туров не нашлось, извините.
`;
const firstPhrase100 = `Туров не нашли. Зато есть билеты на прямые рейсы.
`;
const firstPhrase010 = `Кажется, вы выбрали популярные даты или редкое направление. Удалось найти только билеты с одной пересадкой.
`;
const firstPhrase011 = `Увы, билетов на прямые рейсы по вашему направлению нет. Но есть билеты с пересадкой и туры с прямыми рейсами!
`;
const firstPhrase101 = `Нашли для вас билеты на прямые рейсы и турпакеты.
`;
const firstPhrase111 = `Готово. Мы всё нашли — и билеты, и туры!
`;


module.exports = {
    startMessage: startMessage,
    newStartMessage: newStartMessage,
    errorThanks: errorThanks,
    contactThanks: contactThanks,
    firstPhrase000: firstPhrase000,
    firstPhrase001: firstPhrase001,
    firstPhrase110: firstPhrase110,
    firstPhrase100: firstPhrase100,
    firstPhrase010: firstPhrase010,
    firstPhrase011: firstPhrase011,
    firstPhrase101: firstPhrase101,
    firstPhrase111: firstPhrase111
};