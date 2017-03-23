import Ember from 'ember';
export default Ember.Route.extend({
  controllerName: 'proposals',
  setupController: function(controller, proposals){
    controller.set('proposals', proposals);  
  },	
  renderTemplate: function(){
    // var controller = this.controllerFor('proposals');
    this.render('proposal.singleview', {outlet: 'proposal'})
  },
  model: function (params) {
  	let potential_id = params.potential_id;
  	return this.store.find('proposal', { potential_id: potential_id, accepted: false});
  }

});
