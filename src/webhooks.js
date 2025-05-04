const fetch = require('node-fetch');
const dateImp = require('./dates');
const stringifyDate = dateImp.stringifyDate;


async function statStart(ctx) {
    let now = (ctx.update.message.date)*1000;
    let yourDate = new Date(now);
    
    let user = {
        date: stringifyDate(yourDate),
        name: ctx.from.first_name,
        lastname: ctx.from.last_name,
        username: ctx.from.username,
        lang: ctx.from.language_code,
        uid: ctx.from.id
    };
    
    fetch('https://hook.integromat.com/qepwwnfirh33473atobr46jn8qs5twjk', {
            method: 'post',
            body:    JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(json => console.log(json));
};

async function statSearch(ctx, state) {
    let searchDate = new Date();

    let search = {
        date: stringifyDate(searchDate),
        username: ctx.from.username,
        uid: ctx.from.id,
        where: state.destination,
        from: state.city,
        calendar: state.date,
        nights: state.duration
    };
    
    fetch('https://hook.integromat.com/fndplotvqq87raj6t4o7546r2joev4fb', {
            method: 'post',
            body:    JSON.stringify(search),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(json => console.log(json));
};

module.exports = {
    statStart: statStart,
    statSearch: statSearch
};
