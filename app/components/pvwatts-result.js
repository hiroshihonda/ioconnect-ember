import Ember from 'ember';

export default Ember.Component.extend({

  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  _formatNumber: function(n) {
    if (!n) {
      return n;
    }
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  /**
   * Format the total ac
   */
  acAnnual: function() {
    return this._formatNumber(this.get('pvwatts.ac_annual'))
  }.property('pvwatts.ac_annual'),

  /**
   *
   * @returns {*}
   */
  solradAnnual: function() {
    return this._formatNumber(this.get('pvwatts.solrad_annual'));
  }.property('pvwatts.solrad_annual'),

  /**
   * Normalize the result
   */
  result: function() {
      var i = 0,
      result = [];

    for (i; i<12; i++) {
      result.push({
        month: this.get('months.' + i),
        solrad: this._formatNumber(this.get('pvwatts.solrad_monthly.' + i)),
        ac: this._formatNumber(this.get('pvwatts.ac_monthly.' + i))
      })
    }

    return result;

  }.property('pvwatts.ac_monthly', 'pvwatts.solrad_monthly')

});
