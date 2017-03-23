import Ember from 'ember';
import Wizard from '../mixins/wizard-component';

export default Ember.Component.extend(Wizard, {

  potential: undefined,
  nameSpace: 'components/create-potential',
  action: 'finishCreatePotential',
  modalId: 'createPotentialModal',

  slides: [
    'potential-name',
    'potential-data'
  ],


  init: function() {
    this._super();

    this.set('potential', this._createNewPotential());
  },

  _createNewPotential: function() {
    return Ember.Object.create({
      potentialName: null,
      rateSchedule: null,
      address: null,
      utility: null,
      averageBill: null,
      annualUsage: null,
      proplength: null
    });
  },

  actions: {

    finishCreatePotential: function() {
      var model = this.store.createRecord('potential', this.get('potential').getProperties(
        'potentialName', 'rateSchedule', 'address', 'utility', 'averageBill', 'annualUsage', 'proplength'
      )),
        self = this, store = this.store;

      model.set('utilityUsage', store.createRecord('potential/utility', {
        'usageCalendar': store.createRecord('potential/calendar'),
        'billCalendar': store.createRecord('potential/calendar')
      }));

      model.save().then(function(potential) {
        self.store.all('potential').filterBy('id', null).invoke('deleteRecord');
        self.set('potential', self._createNewPotential());
        Ember.$('#' + self.get('modalId')).modal('hide');
        self.sendAction('action', potential);
      }, function(failXhr) {
        console.log(failXhr);
      });
    }
  }

});
