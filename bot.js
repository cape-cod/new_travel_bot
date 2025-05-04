require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOTTOKEN);
const fetch = require('node-fetch');
const Search = require('./src/Search');
const messages = require('./src/messages');
const dateImp = require('./src/dates');
const stringToWords = dateImp.stringToWords;
const base = require ('./src/base');
const view = require ('./src/view');
const stat = require('./src/webhooks');
const error = require('./src/commands/error');
const contact = require('./src/commands/contact');


// Отправляем кнопки с выбором стран, городов вылета, курортов России, Турции, кол-ва дней отдыха
const sendCountriesList = require('./src/buttons/sendCountriesList');
const sendCitiesList = require('./src/buttons/sendCitiesList');
const sendRussiaList = require('./src/buttons/sendRussiaList');
const sendTurkeyList = require('./src/buttons/sendTurkeyList');
const sendCalendar = require('./src/buttons/sendCalendar');
const sendDurationList = require('./src/buttons/sendDurationList');

// Создаем переменную для хранения ответов юзера
const state = require('./src/state');

// Запуск бота и первый вопрос
bot.start((ctx) => {
    // Статистика на юзеров, запустивших бот
    stat.statStart(ctx);
    ctx.telegram.sendMessage(ctx.chat.id, ctx.from.first_name + messages.startMessage);

    typing(ctx);
    sendCountriesList(ctx);
});

// Повторный запуск бота
const newStart = 'newStart';
bot.action(newStart, ctx => {
    ctx.telegram.sendMessage(ctx.chat.id, ctx.from.first_name + messages.newStartMessage);
    typing(ctx);
    sendCountriesList(ctx);
});

// Слушаем команды от пользователей
error(bot);
contact(bot);


function typing(ctx){
    bot.telegram.sendChatAction(ctx.chat.id, "typing");
};

const countriesList = ['russia', 'turkey', 'cyprus', 'uae', 'zanzibar', 'cuba', 'abkhazia'];
const citiesList = ['MOW', 'KZN', 'KUF', 'OVB', 'LED', 'SVX', 'UFA', 'KRR'];
const citiesRuList = ['sochi', 'crimea', 'anapa', 'kalin'];
const citiesTrList = ['ayt', 'ege', 'ist'];
const durationList = ['2-3', '4-5', '6-7', '8-9', '10-12', '13-14', '15-19', '20-25'];

// Подтверждение ответ на вопрос по странам и переход на вопрос по городам вылета
bot.action(countriesList, ctx => {
    state.country = ctx.match;
    ctx.deleteMessage();
    //ctx.reply("Вы выбрали страну: " + state.country);
    if (state.country === "russia"){
        sendRussiaList(ctx);
    } else if (state.country === "turkey") {
        sendTurkeyList(ctx);
    } else {
        state.destination = state.country;
        sendCitiesList(ctx);
    };
});

// Подтверждение ответа на вопрос по России и переход к городам вылета
bot.action(citiesRuList, ctx => {
    state.destination = ctx.match;
    ctx.deleteMessage();
    //ctx.reply("Вы выбрали: " + state.destination);
    sendCitiesList(ctx);
});

// Подтверждение ответа на вопрос по Турции и переход к городам вылета
bot.action(citiesTrList, ctx => {
    state.destination = ctx.match;
    ctx.deleteMessage();
    //ctx.reply("Вы полетите в: " + resortName(state.destination));
    sendCitiesList(ctx);
});

// Подтверждение ответа на вопрос о городах вылета и переход на календарь
bot.action(citiesList, ctx => {
    state.city = ctx.match;
    ctx.deleteMessage();
    //ctx.telegram.sendMessage(ctx.chat.id, "Вы вылетаете " + airportName(state.city));
    sendCalendar(bot, ctx);
});

// Подтверждение ответа на вопрос о кол-ве дней
bot.action(durationList, ctx => {
    state.duration = ctx.match;
    durationSplit(state.duration, '-');

    state.run = new Search (state.country, state.nightsFrom, state.nightsTo, state.destination, state.checkInFrom, state.checkInTo, state.city);
    ctx.deleteMessage();
    //ctx.telegram.sendMessage(ctx.chat.id, `Вы хотите улететь на ${state.duration} ночей`);
    ctx.telegram.sendMessage(ctx.chat.id, `Мы уже ищем самые выгодные авиабилеты и туры в ${resortName(state.destination)} ${airportName(state.city)} на ${state.duration} ночей. Скоро пришлём вам ответ!`);
    typing(ctx);
    send(ctx, state.run);
});

//Конвертация кода в название города вылета
function airportName(iso){
    var indx = base.departureCities.findIndex(item => (item.iso == iso));
    return base.departureCities[indx].namefrom;
};

//Конвертация кода в название курорта
function resortName(rsrt){
    var indx = base.resorts.findIndex(item => (item.destination == rsrt));
    return base.resorts[indx].name;
};

// Подготовка переменных для API запроса
function durationSplit(string, separator){
    const arrayDur = string.split(separator);
    state.nightsFrom = arrayDur[0];
    state.nightsTo = arrayDur[1];
};

// Отправка запросов на API
async function send(ctx, run){
    try {
        await run.getResults(ctx);
        console.log(run.minimalAirPrice);
        console.log(run.minimalTourPrice);
        // Статистика отправленных запросов

        output(ctx, run.minimalAirPrice, run.minimalTourPrice);

    } catch (error) {
        console.log(error);
    }
};

//Функция выводит финальное сообщение юзеру с его результатами
function output(ctx, ticket, tour) {
    const ti0 = ticket.ti0;
    const ti1 = ticket.ti1;
    const tu = tour.tu;
    let firstPhrase, ticketPhrase, tourPhrase, endButtons;
    
    // Сочиняем фразу
    switch (true) {
        // Нет ни билетов, ни туров
        case ticket.min0 == 10000000 && ticket.min1 == 10000000 && tour.min2 == 10000000:
            firstPhrase = messages.firstPhrase000;
            ticketPhrase = "";
            tourPhrase = "";
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                         [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Нет билетов, но есть туры
        case ticket.min0 == 10000000 && ticket.min1 == 10000000 && tour.min2 !== 10000000:
            firstPhrase = messages.firstPhrase001;
            ticketPhrase = "";
            tourPhrase = `
✌ <b>Туры ${view.namePort(state.city)} ⇄ ${view.nameResort(tu.resortId)}</b>
Вылет ${stringToWords(tu.checkinDate)} на ${tu.nights} нч. — <a href="${tour.url2}">от ${view.formatPrice(parseInt(tour.min2/2))} руб / чел</a>
Включены перелёт, проживание в отеле и др услуги.
При переходе цена будет пересчитана на 2 человек.

            `;
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{text: `Туры от ${view.formatPrice(parseInt(tour.min2/2))} руб`, url: tour.url2}],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть все билеты, но нет туров
        case ticket.min0 !== 10000000 && ticket.min1 !== 10000000 && tour.min2 == 10000000:
            firstPhrase = messages.firstPhrase110;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti0.destination)}</b>
Прямые рейсы ${stringToWords(ti0.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url0}">от ${view.formatPrice(ticket.min0)} руб / чел</a>
Рейсы с 1 пересадкой ${stringToWords(ti1.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url1}">от ${view.formatPrice(ticket.min1)} руб / чел</a>
            
`;
            tourPhrase = "";
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min0)} руб`, url: ticket.url0 }],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть прямой билет, но нет туров
        case ticket.min0 !== 10000000 && ticket.min1 == 10000000 && tour.min2 == 10000000:
            firstPhrase = messages.firstPhrase100;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti0.destination)}</b>
Прямые рейсы ${stringToWords(ti0.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url0}">от ${view.formatPrice(ticket.min0)} руб / чел</a>
            
`;
            tourPhrase = "";
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min0)} руб`, url: ticket.url0 }],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть билеты с пересадкой, но нет туров
        case ticket.min0 == 10000000 && ticket.min1 !== 10000000 && tour.min2 == 10000000:
            firstPhrase = messages.firstPhrase010;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti1.destination)}</b>
Рейсы с 1 пересадкой ${stringToWords(ti1.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url1}">от ${view.formatPrice(ticket.min1)} руб / чел</a>
            
`;
            tourPhrase = "";

            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min1)} руб`, url: ticket.url1 }],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть билеты только с пересадкой и есть туры
        case ticket.min0 == 10000000 && ticket.min1 !== 10000000 && tour.min2 !== 10000000:
            firstPhrase = messages.firstPhrase011;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti1.destination)}</b>
Рейсы с 1 пересадкой ${stringToWords(ti1.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url1}">от ${view.formatPrice(ticket.min1)} руб / чел</a>
            
`;
            tourPhrase = `
✌ <b>Туры ${view.namePort(state.city)} ⇄ ${view.nameResort(tu.resortId)}</b>
Вылет ${stringToWords(tu.checkinDate)} на ${tu.nights} нч. — <a href="${tour.url2}">от ${view.formatPrice(parseInt(tour.min2/2))} руб / чел</a>
Включены перелёт, проживание в отеле и др услуги.
При переходе цена будет пересчитана на 2 человек.
            
`;

            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min1)} руб`, url: ticket.url1 }, {text: `Туры от ${view.formatPrice(parseInt(tour.min2/2))} руб`, url: tour.url2}],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть только прямые билеты и есть туры
        case ticket.min0 !== 10000000 && ticket.min1 == 10000000 && tour.min2 !== 10000000:
            firstPhrase = messages.firstPhrase101;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti0.destination)}</b>
Прямые рейсы ${stringToWords(ti0.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url0}">от ${view.formatPrice(ticket.min0)} руб / чел</a>
            
`;

            tourPhrase = `
✌ <b>Туры ${view.namePort(state.city)} ⇄ ${view.nameResort(tu.resortId)}</b>
Вылет ${stringToWords(tu.checkinDate)} на ${tu.nights} нч. — <a href="${tour.url2}">от ${view.formatPrice(parseInt(tour.min2/2))} руб / чел</a>
Включены перелёт, проживание в отеле и др услуги.
При переходе цена будет пересчитана на 2 человек.
            
`;

            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min0)} руб`, url: ticket.url0 }, {text: `Туры от ${view.formatPrice(parseInt(tour.min2/2))} руб`, url: tour.url2}],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;

        // Есть всё
        case ticket.min0 !== 10000000 && ticket.min1 !== 10000000 && tour.min2 !== 10000000:
            firstPhrase = messages.firstPhrase111;
            ticketPhrase = `
✈ <b>Билеты ${view.namePort(state.city)} ⇄ ${view.nameArrival(ti0.destination)}</b>
Прямые рейсы ${stringToWords(ti0.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url0}">от ${view.formatPrice(ticket.min0)} руб / чел</a>
Рейсы с 1 пересадкой ${stringToWords(ti1.depart_date)} на ${state.nightsFrom} нч. — <a href="${ticket.url1}">от ${view.formatPrice(ticket.min1)} руб / чел</a>
`;
            tourPhrase = `
✌ <b>Туры ${view.namePort(state.city)} ⇄ ${view.nameResort(tu.resortId)}</b>
Вылет ${stringToWords(tu.checkinDate)} на ${tu.nights} нч. — <a href="${tour.url2}">от ${view.formatPrice(parseInt(tour.min2/2))} руб / чел</a>
Включены перелёт, проживание в отеле и др услуги.
При переходе цена будет пересчитана на 2 человек.
            
`;
            
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: `Билеты от ${view.formatPrice(ticket.min0)} руб`, url: ticket.url0 }, {text: `Туры от ${view.formatPrice(parseInt(tour.min2/2))} руб`, url: tour.url2}],
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
            break;
                 
        default:
            ctx.reply("Какая-то странная ошибка");
            endButtons = {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard:  [
                        [{ text: 'Новый поиск', callback_data: 'newStart' }]
                    ]
                }
            };
    };

    const answer = firstPhrase + ticketPhrase + tourPhrase;
    ctx.telegram.sendMessage(ctx.chat.id, answer, endButtons);

    // Статистика полученных ответов
    stat.statSearch(ctx, state);
};

// Прослушивание ключевых слов для групповых чатов
bot.hears(["авиабилет", "авиабилеты", "Авиабилет", "Авиабилеты", "билет", "билеты", "Билет", "Билеты", "тур", "Тур", "туры", "Туры"], (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, ctx.from.first_name + messages.startMessage);
    sendCountriesList(ctx);
});

bot.launch();