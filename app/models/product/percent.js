import DS from 'ember-data';
import months from '../../utils/months';

export default DS.Model.extend({
  percentUsage: DS.attr(),
  parentItem: DS.belongsTo('proposal/item', {
    inverse: 'percent'
  }),


  avgMonthlyKwhSavings: function() {
    return (this.get('annualKwhSavings') / 12);
  }.property('annualKwhSavings'),

  annualKwhSavings: function() {
     var sum = 0,
       calendar = months.shortCodes,
       savings = this.get('monthlyKwhSavings');

    calendar.forEach(function(month) {
      if (!isNaN(savings[month])) {
        sum += savings[month];
      }
    });

    return sum;
  }.property('monthlyKwhSavings'),

  monthlyKwhSavings: function() {
    var potential = this.get('parentItem.parentProposal.potential');
    var utilityUsage = potential.get('utilityUsage');
    var calendar = months.shortCodes;
    if(utilityUsage==null){
      return;
    }
    var usageCalendar = utilityUsage.get('usageCalendar');
    var resultCalendar = {};
    var percent = (parseFloat(this.get('percentUsage')) || 0) / 100;
    var minimumUsage = utilityUsage.get('minimumUsage');
    var month, monthUsage;

    calendar.forEach(function(month) {
      monthUsage = usageCalendar.get(month);

      if(monthUsage){
        resultCalendar[month] = ((monthUsage - minimumUsage) * percent);
      } else {
        resultCalendar[month] = 0;
      }
    });

    return resultCalendar;
  }.property('parentItem.parentProposal.potential.utilityUsage.usageCalendar.changedMonths', 'percentUsage')
});
