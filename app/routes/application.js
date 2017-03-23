import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	beforeModel(model, transition)
	{
		if(window.location.hash.search(/^#\/?.+/) == 0)
		{
			this.controllerFor('application').set('fromApplication', true)
		}
	},
	
	sessionAuthenticated() {
		console.log('authenticated')
		// self.controllerFor('application').set('fromApplication', false)
		// this.transitionTo('application')
		window.location.path = '/'
	},
	
	sessionInvalidated() {
		this.transitionTo('application')
	}
	
});
