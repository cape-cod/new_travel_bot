const destinations = require('./config/destinations');

// Для авиабилетов
const aviaPartnerCode = 'https://tp.media/r?marker=125405&trs=26086&p=4114&u=';
const flightCampaignSuffix = '&campaign_id=100';

// Для туров
const tourPartnerCode = 'https://tp.media/r?marker=125405&trs=26086&p=771&u=';

module.exports = {
  aviaPartnerCode,
  flightCampaignSuffix,
  tourPartnerCode
};
