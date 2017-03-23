import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		cloneProposal(id) {
			this.sendAction('cloneProposal', id)
		},
		
		acceptProposal(id) {
			this.sendAction('acceptProposal', id)
		}
	}
});
