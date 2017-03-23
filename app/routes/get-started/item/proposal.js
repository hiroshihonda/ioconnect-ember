import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'get-started',
  renderTemplate: function(){
    this.render({outlet: 'proposal-item'});
  },

  controllerSetup: function(controller, potential){
    controller.set('potential', potential);
  }
});
