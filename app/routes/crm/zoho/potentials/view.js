import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, potential){
    controller.set('model', potential);
  },

  renderTemplate: function(){
    this.render('crm.zoho.potentials.view', {
      into: 'crm.zoho.potentials'
    });
  },

  model: function(params){
    return this.store.find('potential', params.potential_id);
  }
});
