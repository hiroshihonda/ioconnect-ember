import Loan from '../loan';

export default Loan.extend({

  parentProposal: DS.belongsTo('proposal', {
    inverse: 'loanOptions',
    async: true
  }),

  selected: DS.attr(),

  /**
   * Calculate the interest rate as ratio 0.xx
   */
  interestRatio: function () {
    var rate = this.get('interestRate') || 0;

    if (!rate) {
      return rate;
    }

    return rate / 100;
  }.property('interestRate'),

  /**
   * Get the amount financed by this loan type
   */
  amountFinanced: function () {
    var gross = this.get('parentProposal.grossPrice'),
      net = this.get('parentProposal.netPrice'),
      ratio = parseFloat(this.get('interestRatio')),
      incentives = this.get('incentives'),
      downPayment = parseFloat(this.get('parentProposal.downPayment')) || 0,
      intCap = this.get('interestCapitalization'),
      amount = gross - incentives - downPayment;

    if (intCap) {
      return amount * ratio + net;
    }

    return amount;
  }.property(
    'parentProposal.netPrice',
    'parentProposal.grossPrice',
    'parentProposal.downPayment',
    'incentives'
  ),

  /**
   * Calculate the monthly rate of this loan type
   */
  monthlyRate: function () {
    return this._calcMonthlyRate(this.get('amountFinanced'));
  }.property('amountFinanced'),
  
  financing: function() {
	  return this.get('monthlyRate') * 12;
  }.property('monthlyRate'),

  /**
   * Calculate the total of incentives (if any selected)
   */
  incentives: function () {
    var sum = 0,
      inc = {
        'federal': 'federal',
        'rebate': 'rebates',
        'utility': 'utility',
        'state': 'state'
      };

    for (var key in inc) {
      if (this.get(key)) {
        sum += this.get('parentProposal.' + inc[key]);
      }
    }

    return sum;

  }.property(
    'parentProposal.federal',
    'parentProposal.rebates',
    'parentProposal.state',
    'parentProposal.utility'
  ),

  /**
   * Calculate the monthly rate for a given price
   *
   * @param price
   * @returns {number}
   * @private
   */
  _calcMonthlyRate: function (price) {
    var r = this.get('interestRate'),
      n = this.get('term'),
      down = this.get('proposal.downPayment') || 0,
      pv = price - down;

    if (!pv || !n || !r) {
      return 0;
    }

    r = r / 100;

    return (
      (r / 12 * pv) /
      (1 - Math.pow(1 + r / 12, 0 - n))
    );

  },

});
