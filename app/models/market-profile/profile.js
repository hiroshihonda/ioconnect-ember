import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  solarItem: DS.attr(),
  items: DS.hasMany('market-profile/item'),
  inflationRate: DS.attr('number'),
  connectionFee: DS.attr('number'),
  defaultSolarPrice: DS.attr('number')
});
