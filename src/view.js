const base = require ('./base');


//Convert country code for tours API request
function countryCode(code){
    var indx = base.resorts.findIndex(item => (item.destination == code));
    return base.resorts[indx].country;
};

//Convert departure city code for tours API request
function depcityCode(code){
    var indx = base.departureCities.findIndex(item => (item.iso == code));
    return base.departureCities[indx].id;
};

//Convert destination code for avia API request
function destinAvia(code){
    var indx = base.resorts.findIndex(item => (item.destination == code));
    return base.resorts[indx].iso;
};

// Convert airport iso into name
function namePort(code){
    var indx = base.departureCities.findIndex(item => (item.iso == code));
    return base.departureCities[indx].name;
};

// Convert API code from ticket into name
function nameArrival(code){
    var indx = base.resorts.findIndex(item => (item.iso == code));
    return base.resorts[indx].name;
};

// Convert destination code into name
function nameDesti(code){
    var indx = base.resorts.findIndex(item => (item.destination == code));
    return base.resorts[indx].name;
};

// Convert API code from tour into name
function nameResort(code){
    var indx = base.resorts.findIndex(item => (item.id == code));
    return base.resorts[indx].name;
};

// Add comma in the price
const formatPrice = function (price) {
    const exp = /\d{1,3}(?=(\d{3})+(?!\d))/g; 
    let p = exp.exec(price);
    return p;
};

module.exports = {
    namePort: namePort,
    nameDesti: nameDesti,
    countryCode: countryCode,
    depcityCode: depcityCode,
    destinAvia: destinAvia,
    formatPrice: formatPrice,
    nameResort: nameResort,
    nameArrival: nameArrival
};
