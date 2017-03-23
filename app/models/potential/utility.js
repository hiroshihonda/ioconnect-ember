import DS from 'ember-data';
import monthsData from '../../utils/months';

var billMonths = [
  'billCalendar.jan', 'billCalendar.feb', 'billCalendar.mar',
  'billCalendar.apr', 'billCalendar.jun', 'billCalendar.jul',
  'billCalendar.aug', 'billCalendar.sep', 'billCalendar.oct',
  'billCalendar.nov', 'billCalendar.dec', 'billCalendar.may'
];

var utilityMonths = [
  'usageCalendar.jan', 'usageCalendar.feb', 'usageCalendar.mar',
  'usageCalendar.apr', 'usageCalendar.jun', 'usageCalendar.jul',
  'usageCalendar.aug', 'usageCalendar.sep', 'usageCalendar.oct',
  'usageCalendar.nov', 'usageCalendar.dec', 'usageCalendar.may'
];

export default DS.Model.extend({

  electricityUsage: DS.attr(),
  rateSchedule: DS.attr(),
  annualKwh: DS.attr(),
  usageCalendar: DS.belongsTo('potential/calendar'),
  billCalendar: DS.belongsTo('potential/calendar'),
  averageElectricityBill: DS.attr(),
  highElectricityBill: DS.attr(),
  lowElectricityBill: DS.attr(),

  kwhPrice: function() {
    var bill = this.get('avgElectricityBill') || 0,
      usage = this.get('avgUsage') || 1;

    return bill / usage;
  }.property('averageElectricityBill', 'avgUsage'),

  monthlyKwhPrice: function() {
    var monthly = Ember.Object.extend(),
      usage, bill,
      usageCalendar = this.get('usageCalendar'),
      billCalendar = this.get('billCalendar');

    monthsData.shortCodes.forEach(function(code) {
      usage = usageCalendar.get(code) || 1;
      bill = billCalendar.get(code) || 0;

      monthly.set(code, bill / usage);
    });

    return monthly;
  }.property('usageCalendar.changedMonths', 'billCalendar.changedMonths'),

  /**
   * Get the lowest electricity bill
   */
  _lowElectricityBill: function() {
    var attrs = this.get('billCalendar.constructor.attributes');
    var val = this._calcMin(attrs, this.get('billCalendar'));
    this.set('lowElectricityBill', val);
  }.observes('billCalendar.changedMonths').on('ready'),

  _annualKwh: function() {
    var val  =this._calcSum(this.get('usageCalendar.constructor.attributes'), this.get('usageCalendar'));
    this.set('annualKwh', val);
  }.observes('usageCalendar.changedMonths').on('ready'),

  /**
   * Get the highest electricity bill
   */
  _highElectricityBill: function() {
    var val = this._calcMax(this.get('billCalendar.constructor.attributes'), this.get('billCalendar'));
    this.set('highElectricityBill', val);
  }.observes('billCalendar.changedMonths').on('ready'),

  /**
   * Get the average electricity bill
   */
  avgElectricityBill: function() {
    var val = this._calcAvg(this.get('billCalendar.constructor.attributes'), this.get('billCalendar'));
    this.set('averageElectricityBill', val);
    return val;
  }.property('billCalendar.changedMonths'),

  sumElectricityBill: function() {
    return this._calcSum(this.get('billCalendar.constructor.attributes'), this.get('billCalendar'));
  }.property('billCalendar.changedMonths'),

  sumElectricityBill25Years: function() {
    return this.get('sumElectricityBill') * 25;
  }.property('sumElectricityBill'),

  minimumUsage: function() {
    return this._calcMin(this.get('usageCalendar.constructor.attributes'), this.get('usageCalendar'));
  }.property('usageCalendar.changedMonths'),

  sumUsage: function() {
    return this._calcSum(this.get('usageCalendar.constructor.attributes'), this.get('usageCalendar'));
  }.property('usageCalendar.changedMonths'),

  avgUsage: function() {
    return this._calcAvg(this.get('usageCalendar.constructor.attributes'), this.get('usageCalendar'));
  }.property('usageCalendar.changedMonths'),

  _calcSum: function(map, model) {
    var sum = 0, i;

    !map || map.forEach(function(name, item) {
      i = model.get(item);

      if (!isNaN(i)) {
        sum += parseFloat(i);
      }
    });

    return sum;
  },

  /**
   * Calculate the avg of the map
   *
   * @param map
   * @returns {number}
   * @private
   */
  _calcAvg: function(map, model) {
    var sum = 0, i, c = 0;

    !map || map.forEach(function(name, item) {
      i = model.get(item);

      if (!isNaN(i)) {
        sum += parseFloat(i);
        c++;
      }
    });

    if (c == 0) {
      return 0;
    }

    return (sum / c);
  },

  /**
   * Calc the max value
   *
   * @param map
   * @returns {number}
   * @private
   */
  _calcMax: function(map, model) {
    var max = 0, i;

    !map || map.forEach(function(name, item) {
      i = parseFloat(model.get(item));
      if (i > max) {
        max = i;
      }
    });

    return max;
  },

  /**
   * Calculate the minimum value
   *
   * @param map
   * @returns {*}
   * @private
   */
  _calcMin: function(map, model) {
    var min = model ? model.get('jan') : 0, i;

    !map || map.forEach(function(name, item) {
      i = parseFloat(model.get(item));
      if (i < min) {
        min = i;
      }
    });

    return min;
  }
});
