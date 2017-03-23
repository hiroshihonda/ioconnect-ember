import DS from 'ember-data';
import months from '../../utils/months';

export default DS.Model.extend({
  existingDraw: DS.attr(),
  newDraw: DS.attr(),
  hoursDaily: DS.attr(),
  parentItem: DS.belongsTo('proposal/item', {
    inverse: 'calculation'
  }),

  _getCalendar: function() {
    return months.shortCodes;
  },

  calculateMonthlySavings: function() {
    var newDraw = parseFloat(this.get('newDraw')) || 0,
      existingDraw = parseFloat(this.get('existingDraw')) || 0,
      hoursDaily = parseFloat(this.get('hoursDaily')) || 0;
    if (
      isNaN(newDraw)
      || isNaN(existingDraw)
      || isNaN(hoursDaily)
    ) {
      return 0;
    }

     return ((existingDraw - newDraw) * (hoursDaily * 30)) / 1000;
  },

  monthlyKwhSavings: function() {
    var calendar = this._getCalendar(),
      savings = {},
      calculation = this.calculateMonthlySavings();
    if (calculation == 0) {
      return savings;
    }

    calendar.forEach(function(month) {
      savings[month] = calculation;
    });

    return savings;
  }.property('newDraw', 'existingDraw', 'hoursDaily'),

  avgMonthlyKwhSavings: function() {
    return this.calculateMonthlySavings();
  }.property('newDraw', 'existingDraw', 'hoursDaily'),

  annualKwhSavings: function() {
    return this.calculateMonthlySavings() * 12;
  }.property('newDraw', 'existingDraw', 'hoursDaily')
});
