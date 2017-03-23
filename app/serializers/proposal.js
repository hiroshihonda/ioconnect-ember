import DS from 'ember-data';
import AppSerializer from './application';

export default AppSerializer.extend({

  extractSingle: function(store, type, payload, id) {

    payload.proposal = this._extractProposal(payload.proposal);

    return this._super(store, type, payload, id);
  },

  extractArray: function(store, type, payload) {
    var self = this;

    payload.proposals.forEach(function(proposal, i) {
      payload.proposals[i] = self._extractProposal(proposal);
    });

    return this._super(store, type, payload);
  },

  _extractProposal: function(proposal) {

    proposal.items.forEach(function(item) {
      item.parentProposal = proposal.id;

      item.kwh.parentItem = item.id;
      item.percent.parentItem = item.id;
      item.calculation.parentItem = item.id;
    });

    proposal.loanOptions.forEach(function(loan) {
      loan.parentProposal = proposal.id;
    });

    return proposal;
  }

});
