import DS from 'ember-data';
import {savingsCalculation, productPricing} from '../product';
import {types} from '../market-profile/tax';
import config from '../../config/environment';

export var overrideType = {
  PERCENT: "PERCENT",
  AMOUNT: "AMOUNT"
};

export var overrideTypes = [
  {name: "AMOUNT", value: "$"},
  {name: "PERCENT", value: "%"}
];

export default DS.Model.extend({
  marketItem: DS.belongsTo('proposal/market-item'),

  _initPriceOverride: function () {
    var key = 'priceOverride';

    if (!this.get(key)) {
      this.set(key, this.get('marketItem.product.price'));
    }

  }.observes('marketItem.product.price').on('ready'),

  price: function () {
    var product = this.get('marketItem.product');
    var price = product.get('price');

    switch (product.get('productPricingName')) {
      case productPricing.EACH:
      default:
        return price;
    }
  }.property('marketItem.product.price'),

  parentProposal: DS.belongsTo('proposal', {
    inverse: 'items',
    async: true
  }),

  calculation: DS.belongsTo('product/calculation', {
    inverse: 'parentItem'
  }),
  kwh: DS.belongsTo('product/kwh', {
    inverse: 'parentItem'
  }),
  percent: DS.belongsTo('product/percent', {
    inverse: 'parentItem'
  }),

  netCost: function () {
    var price = this.get('price'),
      incentives = this.get('incentives');

    return price - incentives;
  }.property('incentives'),

  incentives: function () {
    var price = 0,
      federal = this.get('federalIncentive'),
      state = this.get('stateIncentive'),
      utility = this.get('utilityIncentive'),
      rebates = this.get('rebatesIncentive');

    price += federal + state + utility + rebates;

    return price;
  }.property('federalIncentive', 'stateIncentive', 'utilityIncentive', 'rebatesIncentive'),

  federalIncentive: function () {
    return this._calculateTax(this.get('marketItem.federal'));
  }.property('price', 'marketItem.federal.value', 'marketItem.federal.type'),

  stateIncentive: function () {
    return this._calculateTax(this.get('marketItem.state'));
  }.property('price', 'marketItem.state.value', 'marketItem.state.type'),

  utilityIncentive: function () {
    return this._calculateTax(this.get('marketItem.utility'));
  }.property('price', 'marketItem.utility.value', 'marketItem.utility.type'),

  rebatesIncentive: function () {
    return this._calculateTax(this.get('marketItem.rebates'));
  }.property('price', 'marketItem.rebates.value', 'marketItem.rebates.type'),

  taxIncentive: function () {
    return this._calculateTax(this.get('marketItem.tax'));
  }.property('price', 'marketItem.tax.value', 'marketItem.tax.type'),

  /**
   * Calculate tax value
   *
   * @param tax
   * @private
   */
  _calculateTax: function (tax) {
    var price = this.get('price'),
      cap = tax.get('cap'),
      taxValue = parseFloat(tax.get('value')),
      taxType = tax.get('type'),
      systemCapacity = parseFloat(this.get('parentProposal.pvwatts.systemCapacityKw')) || 0,
      value = 0;

    if (!taxValue) {
      return value;
    }

    switch (taxType) {
      case types.AMOUNT:
        value = taxValue;
        break;
      case types.PERCENT:
        value = price * (taxValue / 100);
        break;
      case types.PPW:
        value = taxValue * systemCapacity;
        break;
      default:
        break;
    }

    if (cap && value > cap) {
      return cap;
    }

    return value;
  },

  selected: DS.attr(),

  /**
   * Return savings calculation strategy
   */
  savingsCalculation: function () {
    var strategy = this.get('marketItem.product.savingsCalculationName');

    switch (strategy) {
      case savingsCalculation.CALCULATION:
        return this.get('calculation');
      case savingsCalculation.KWH:
        return this.get('kwh');
      case savingsCalculation.PERCENTAGE_TOTAL:
        return this.get('percent');
      default:
        return this;
    }
  }.property('calculation.monthlyKwhSavings', 'calculation.avgMonthlyKwhSavings', 'calculation.annualKwhSavings',
    'kwh.monthlyKwhSavings', 'kwh.avgMonthlyKwhSavings', 'kwh.annualKwhSavings',
    'percent.monthlyKwhSavings', 'percent.avgMonthlyKwhSavings', 'percent.annualKwhSavings'
  ),

  annualUSDSavings: function () {
    return this._calcKwhPrice(this.get('savingsCalculation.annualKwhSavings'));
  }.property('savingsCalculation.annualKwhSavings'),

  avgMonthlyUSDSavings: function () {
    return this._calcKwhPrice(this.get('savingsCalculation.annualKwhSavings')) / 12;
    // return this._calcKwhPrice(this.get('savingsCalculation.avgMonthlyKwhSavings'));
  }.property('savingsCalculation.avgMonthlyKwhSavings'),

  _calcKwhPrice: function (kwh) {
    var priceKwh = config.calc.priceKwh,
      potentialKwh = parseFloat(this.get('parentProposal.potential.utilityUsage.kwhPrice'));

    kwh = parseFloat(kwh);

    if (kwh <= 0) {
      return 0;
    }

    if (potentialKwh) {
      priceKwh = potentialKwh;
    }

    return kwh * priceKwh - config.calc.kwhTax;
  },

  proposal: function () {
    return this.get('parentProposal');
  }.property('parentProposal'),

  rgbColor: [],

  rgbColorCss: function () {
    return 'rgb(' + this.rgbColor.join(', ') + ')';
  }.property('rgbColor')
});
