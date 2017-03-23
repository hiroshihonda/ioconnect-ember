import DS from 'ember-data';

export default DS.Model.extend({
  parentProposal: DS.belongsTo('proposal', {
    inverse: 'tiers'
  }),
  percentage: DS.attr('number'),
  kwhPrice: DS.attr('number')
});
