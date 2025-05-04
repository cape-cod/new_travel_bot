const axios = require('axios');
require('dotenv').config();
const base = require ('./base');
const view = require ('./view');

class Search {
    constructor (country, nightsFrom, nightsTo, resort, checkInFrom, checkInTo, departureCity) {
        this.country = country;
        this.nightsFrom = nightsFrom;
        this.nightsTo = nightsTo;
        this.resort = resort;
        this.checkInFrom = checkInFrom;
        this.checkInTo = checkInTo;
        this.departureCity = departureCity;
    }

    
    async getResults(ctx) {
        try {
            // Get API data for tickets
            const resAvia = await axios(`http://api.travelpayouts.com/v2/prices/month-matrix?currency=rub&origin=${this.departureCity}&destination=${view.destinAvia(this.resort)}&month=${this.checkInFrom}&trip_duration=${this.nightsFrom}&show_to_affiliates=true&token=${process.env.AVIAAPI}`);
            this.resultAvia = resAvia.data.data;
            
            // Get array of resorts and turn it into a string for API request
            function converter(resortName) {
                var indx = base.resorts.findIndex(item => (item.destination === resortName));
                return base.resorts[indx].id;
            };
            const reso = this.resort;
            function renderResorts() {
                let str = ``;
                let arr = converter(reso);
                let newArr = [];
                if(arr.constructor !== Array) {
                  newArr.push(arr)
                } else {
                  newArr = arr;
                };
                for (var i = 0; i < newArr.length; i++) {
                  str = str + `&resorts[${i}]=${newArr[i]}`;
                };
                return str;
              };

            // Get API data for tours
            const resTour = await axios(`https://api-gateway.travelata.ru/statistic/cheapestTours?countries[]=${view.countryCode(this.country)}&departureCity=${view.depcityCode(this.departureCity)}${renderResorts()}&nightRange[from]=${this.nightsFrom}&nightRange[to]=${this.nightsTo}&touristGroup[adults]=2&touristGroup[kids]=0&touristGroup[infants]=0&checkInDateRange[from]=${this.checkInFrom}&checkInDateRange[to]=${this.checkInTo}`);
            this.resultTour = resTour.data.data;
            
            // Reply in telegram
            //ctx.reply(`http://api.travelpayouts.com/v2/prices/month-matrix?currency=rub&origin=${this.departureCity}&destination=${view.destinAvia(this.resort)}&month=${this.checkInFrom}&trip_duration=${this.nightsFrom}&show_to_affiliates=true&token=${process.env.AVIAAPI}`);
            //ctx.reply(`https://api-gateway.travelata.ru/statistic/cheapestTours?countries[]=${view.countryCode(this.country)}&departureCity=${view.depcityCode(this.departureCity)}${renderResorts()}&nightRange[from]=${this.nightsFrom}&nightRange[to]=${this.nightsTo}&touristGroup[adults]=2&touristGroup[kids]=0&touristGroup[infants]=0&checkInDateRange[from]=${this.checkInFrom}&checkInDateRange[to]=${this.checkInTo}`);


            // Finding minimal price for the ticket
            var min0 = 10000000, min1 = 10000000, id0 = 0, id1 = 0, url0, url1;
            function minAvia(arr, checkInFrom, checkInTo){
                for (var i = 0; i < arr.length; i++) {
                    // Create date interval where cheapest ticket is searched
                    var dateStart = new Date(checkInFrom);
                    var dateEnd = new Date(checkInTo);
                    var date = new Date(arr[i].depart_date);
                    var price = arr[i].value;
                    var changes = arr[i].number_of_changes;
                    console.log('в ' + i + ' объекте ' + changes +' пересадок'+' за '+price+' руб на ' + date);
                    
                    // Convert date for avia link
                    function convertDate(str){
                        const newStr = str.split('-');
                        const convertedDate = newStr[2] + newStr[1];
                        return convertedDate;
                    };

                    // Check prices in interval
                    if (date >= dateStart && date <= dateEnd){
                        console.log(price);
                        console.log(date);
                        
                        if(changes === 0 && price < min0) {
                            console.log("FOUND!")
                            min0 = price;
                            id0 = i;
                            url0 = `${base.partnerCode}https://www.aviasales.ru/search/${arr[i].origin}${convertDate(arr[i].depart_date)}${arr[i].destination}${convertDate(arr[i].return_date)}1`;
                        } else if(changes === 1 && price < min1){
                            console.log("FOUND!")
                            min1 = price;
                            id1 = i;
                            url1 = `${base.partnerCode}https://www.aviasales.ru/search/${arr[i].origin}${convertDate(arr[i].depart_date)}${arr[i].destination}${convertDate(arr[i].return_date)}1`;
                        }
                    }

                };

                return {
                    'min0': min0,
                    'id0': id0,
                    'url0': url0,
                    'ti0': arr[id0],
                    'min1': min1,
                    'id1': id1,
                    'url1': url1,
                    'ti1': arr[id1]
                };

            };


            // Finding minimal price for the tour
            var min2 = 10000000, id2 = 0, url2;
            function minTour(arr, checkInFrom, checkInTo){
                for (var i = 0; i < arr.length; i++) {
                    // Create date interval where cheapest tour is searched
                    var dateStart = new Date(checkInFrom);
                    var dateEnd = new Date(checkInTo);
                    var date = new Date(arr[i].checkinDate);                                                    // diff
                    var price = arr[i].price;                                                                   // diff
                    console.log('в ' + i + ' объекте тур за '+price+' руб на ' + date);
                    
                    // Convert date for avia link
                    function convertDate(str){
                        const newStr = str.split('-');
                        const convertedDate = newStr[2] + newStr[1];
                        return convertedDate;
                    };

                    // Check prices in interval
                    if (date >= dateStart && date <= dateEnd && price < min2){
                        console.log(price);
                        console.log(date);
                        console.log("FOUND!")
                        min2 = price;
                        id2 = i;
                        url2 = `${base.partnerCode}${arr[i].searchPageUrl}&sort=priceUp`;
                    }

                };

                return {
                    'min2': min2,
                    'id2': id2,
                    'url2': url2,
                    'tu': arr[id2]
                };

            };

            this.minimalAirPrice = minAvia(this.resultAvia, this.checkInFrom, this.checkInTo);
            this.minimalTourPrice = minTour(this.resultTour, this.checkInFrom, this.checkInTo);
            
        } catch (error) {
            ctx.reply(error);
        }
    }

}

module.exports = Search;
