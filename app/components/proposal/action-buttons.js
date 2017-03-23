import Ember from 'ember';
import presentationPdf from '../../utils/presentation-pdf';

export default Ember.Component.extend({
  settings: [],
  proposal: undefined,

  didInsertElement: function() {
  },
  
  showEdit: function() {
	  if(this.get('proposal.id') && 
		window.location.href.indexOf('edit') == -1)
		return true;
	
		return false;
  }.property('proposal.id'),

  pdfUrl: function() {
    var port = 8889,
      location = window.location,
      proposalId = this.get('proposal.id'),
	  proposalName = this.get('proposal.proposalName'),
      session = this.get('application').__container__.lookup('simple-auth-session:main'),
      data = session.get('store').restore().secure.auth || {};

    var ourUrl =  [
      'http://', location.hostname,
      ':', location.port,
      '#/utils/proposal-pdf/', proposalId,
      '?email=', data.email,
      '&password=', data.password
    ].join('');

    ourUrl = encodeURIComponent(ourUrl);

    return [
      'http://', location.hostname,
      ':', port,
      '/?url=', ourUrl,
	  '&name=', encodeURIComponent(proposalName)
    ].join('');

  }.property('proposal.id'),

  actions: {
    generatePDF: function() {
      var app = this.get('application'),
        slider = app.__container__.lookup('component:presentation-slider');

      slider.set('proposal', this.get('proposal'));
      slider.set('settings', this.get('settings'));

      presentationPdf(slider);
    },
	
	cloneProposal(id) {
		this.sendAction('cloneProposal', id)
	},
	
	acceptProposal(id) {
		this.sendAction('acceptProposal', id)
	}
  }
});
