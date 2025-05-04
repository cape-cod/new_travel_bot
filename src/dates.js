
function stringifyDate(yourDate) {
    let yourYear, yourMonth, yourDay, strDate;
    yourYear = yourDate.getFullYear();
    yourMonth = yourDate.getMonth() + 1;
    yourMonth = addZero(yourMonth);
    
    yourDay = yourDate.getDate();
    yourDay = addZero(yourDay);

    strDate = yourYear.toString()+"-"+yourMonth+"-"+yourDay;
    return strDate;
};

function addZero(digit) {
    if(digit < 10) {
        newDigit = "0"+digit.toString();
    } else {
        newDigit = digit.toString();
    };
    return newDigit;
}

function dateSplit(date) {
    let checkInFrom, checkInTo;
    checkInFrom = new Date(date);
    checkInFrom.setDate(checkInFrom.getDate() - 2);

    checkInTo = new Date(date);
    checkInTo.setDate(checkInTo.getDate() + 3);
    return {
        'checkFrom': stringifyDate(checkInFrom),
        'checkTo': stringifyDate(checkInTo)
    };
};

// Convert API string dates into day and month words
const stringToWords = (strDate) => {
    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const dateArray = strDate.split("-");
    const month = monthArray[parseInt(dateArray[1]-1)];
    const date = dateArray[2]+" "+month;
    return date;
};

module.exports = {
    dateSplit,
    stringifyDate,
    stringToWords
};