import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  term: DS.attr(),
  interestRate: DS.attr(),
  federal: DS.attr(),
  state: DS.attr(),
  utility: DS.attr(),
  rebate: DS.attr(),
  firstYearSavings: DS.attr(),
  interestCapitalization: DS.attr(),

  updatePromise: undefined
});
