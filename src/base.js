const destinations = require('./config/destinations');

// Для авиабилетов (Aviasales)
const aviaPartnerCode = 'https://tp.media/r?marker=125405&trs=26086&p=4114&u=';
const flightCampaignSuffix = '&campaign_id=100';

// Для туров (Travelata и др.)
const tourPartnerCode = 'https://tp.media/r?marker=125405&trs=26086&p=771&u=';

module.exports = {
  aviaPartnerCode,
  flightCampaignSuffix,
  tourPartnerCode
};
