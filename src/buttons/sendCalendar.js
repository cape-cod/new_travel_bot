const Calendar = require('telegraf-calendar-telegram');
const state = require('../state');
const sendDurationList = require('../buttons/sendDurationList');
const dateImp = require('../dates');
const dateSplit = dateImp.dateSplit;

// Отправляем календарь с выбором дат
module.exports = (bot, ctx) => {
    const calendar = new Calendar(bot, {
        startWeekDay: 1,
        weekDayNames: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
        monthNames: [
            "ЯНВ", "ФЕВ", "МАР", "АПР", "МАЙ", "ИЮН",
            "ИЮЛ", "АВГ", "СЕН", "ОКТ", "НОЯ", "ДЕК"
        ],
        minDate: null,
        maxDate: null
    });


    calendar.setDateListener((ctx, date) => dateSaver(ctx, date));
    
    const today = new Date();
    const minDate = new Date();
    minDate.setMonth(today.getMonth());
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3);
    maxDate.setDate(today.getDate());

    ctx.reply("Теперь нужно выбрать дату вылета", calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar());
};

function dateSaver(ctx, day) {
    state.date = day;
    state.checkInFrom = dateSplit(day).checkFrom;
    state.checkInTo = dateSplit(day).checkTo;
    ctx.deleteMessage();
    //ctx.reply("Вы выбрали дату вылета: " + state.date);
    sendDurationList(ctx);
};