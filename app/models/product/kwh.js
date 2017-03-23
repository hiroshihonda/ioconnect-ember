import DS from 'ember-data';
import monthData from '../../utils/months';

export default DS.Model.extend({
  kwhUsage: DS.attr(),
  parentItem: DS.belongsTo('proposal/item', {
    inverse: 'kwh'
  }),

  monthlyKwhSavings: function() {
    var calendar = monthData.shortCodes,
      months = Ember.Object.create(),
      usage = parseFloat(this.get('kwhUsage')) || 0;

    calendar.forEach(function(item) {
      months.set(item, usage);
    });

    return months;
  }.property('kwhUsage'),

  avgMonthlyKwhSavings: function() {
    return parseFloat(this.get('kwhUsage')) || 0;
  }.property('kwhUsage'),

  annualKwhSavings: function() {
    return (parseFloat(this.get('kwhUsage')) * 12) || 0;
  }.property('kwhUsage')
});
