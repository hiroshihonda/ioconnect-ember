import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  controllerName: 'done-deals',

  setupController: function(controller, potentials){
    controller.set('potentials', potentials);
	
	  // controller.set('model', {})
	
   //  controller.set('potentials', this.store.all('potential').filter(function(item) {
   //    return item.get('acceptedProposalsLength') > 0;
   //  }));

  },

  model: function(){
    return this.store.find('potential',  {proposal_accepted: true})
	
  }
})