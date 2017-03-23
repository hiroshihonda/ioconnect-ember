import DS from 'ember-data';

export var savingsCalculation = {
  "KWH": "Kwh Savings",
  "PERCENTAGE_TOTAL": "Percentage of Total Usage",
  "CALCULATION": "Calculation"
};

export var productPricing = {
  "EACH": "Each",
  "PPW": "PPW",
  "PPSQFT": "PPSQFT"
};

export default DS.Model.extend({
  name: DS.attr('string'),
  savingsCalculation: DS.attr('string'),
  productPricing: DS.attr('string'),
  price: DS.attr(),
  cost: DS.attr(),

  savingsCalculationName: function() {
    return savingsCalculation[this.get('savingsCalculation')];
  }.property('savingsCalculation'),

  productPricingName: function() {
    return productPricing[this.get('productPricing')];
  }.property('savingsCalculation')
});
