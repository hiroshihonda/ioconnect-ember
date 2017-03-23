import DS from 'ember-data';

export default DS.Model.extend({

  product: DS.belongsTo('product'),

  federal: DS.belongsTo('market-profile/tax'),
  state: DS.belongsTo('market-profile/tax'),
  utility: DS.belongsTo('market-profile/tax'),
  tax: DS.belongsTo('market-profile/tax'),
  rebates: DS.belongsTo('market-profile/tax')
});
