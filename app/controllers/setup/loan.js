import Ember from 'ember';

export default Ember.Controller.extend({

  newLoanPromise: undefined,
  newLoan: undefined,

  loanProperties: [
    'name',
    'term',
    'interestRate',
    'federal', 'state', 'utility',
    'rebate', 'firstYearSavings',
    'interestCapitalization'
  ],

  /**
   * Generate new loan object for form
   */
  _setupNewLoan: function() {
    var loan = Ember.Object.create();

    this.get('loanProperties').forEach(function(prop) {
      loan.set(prop, undefined);
    });

    this.set('newLoan', loan);

  }.on('init'),

  actions: {
    createNewLoan: function() {
      var loan = this.get('newLoan'),
        properties = this.get('loanProperties'),
        store = this.store;

      var model = this.store.createRecord('loan', loan.getProperties.apply(loan, properties));
      var promise = model.save();

      this.set('newLoanPromise', promise);

      promise.then(function() {
        store.all('loan').filterBy('id', null).invoke('deleteRecord');
      });
    },

    updateLoan: function(loan) {
      var promise = loan.save();

      loan.set('updatePromise', promise);

      promise.then(function() {
        Ember.$('#loan' + loan.get('id')).modal('hide');
      });
    },

    deleteLoan: function(loan) {
      loan.destroyRecord();
    }
  }

});
