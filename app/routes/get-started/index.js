import Ember from 'ember';
import DS from 'ember-data';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  controllerName: 'get-started',

  setupController: function (controller, potentials) {
    controller.set('potentials', potentials);



    controller.set('energy', this.store.createRecord('energy-efficiency'));

    controller.set('project-design', this.store.createRecord('proposal/project-design'));

    controller.set('utility', this.store.createRecord('potential/utility'));

    controller.set('usageCalendar', this.store.createRecord('potential/calendar'));

    controller.set('billCalendar', this.store.createRecord('potential/calendar'));
  },

  model: function () {
    return this.store.findAll('potential');
  },

  deactivate: function () {

    /*
     this.store.unloadAll('proposal');
     this.store.unloadAll('potential');
     this.store.unloadAll('proposal/project-design');
     this.store.unloadAll('energy-efficiency');
     */
    //this.store.unloadRecord(this.get('proposal'));

    /*
     var proposals = this.store.all('proposal');

     proposals.forEach(function(i){
     i.unloadRecord();
     });

     var potentials = this.store.all('potential');

     potentials.forEach(function(i){
      i.unloadRecord();
     });
     */

    /*
     this.store.find('proposal', '').then(function (proposal) {
     console.log(proposal);
     });
     */
    //this.store.destroy();

  },

  actions: {

    //willTransition: function (transition) {
    //
    //  var transitionName = transition.targetName;
    //  var currentRoute = this.controllerFor('application').get('currentRouteName');
    //
    //  var transitionSpaces = transitionName.split('.');
    //  var currentSpaces = currentRoute.split('.');
    //
    //  if(transitionSpaces[0] != currentSpaces[0]){
    //      this.store.unloadAll('proposal');
    //      this.store.unloadAll('potential');
    //      this.store.unloadAll('proposal/project-design');
    //      this.store.unloadAll('energy-efficiency');
    //  }
    //}
  }

});
