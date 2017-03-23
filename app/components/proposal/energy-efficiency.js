import Ember from 'ember';
import Energy from 'zoho-web/models/energy-efficiency';

export default Ember.Component.extend({

  /*
   energyEfficiencyValue: function (val) {
   var value = this.get('energy-efficiency-value');
   //this.send('valueUpdated');
   this.sendAction('update');
   }.observes('energy-efficiency-value'),
   */

  /*
   watcher: function(){
   console.log('really???');
   }.observes('energy.existingPoolPump'),
   */

  didInsertElement: function () {

    var energy = this.get('energy');
    if(energy==null){
      return;
    }

    if(
      energy.hoursUsed != null &&
      energy.newPoolPump != null &&
      energy.existingPoolPump != null
    ) {
      Ember.$("#pool-pump-fields").show();
    }

    /*
     Energy.reopen({
     smt: function () {
     console.log('aaaaaadddd');
     }.observes('existingPoolPump')
     });
     */

    Ember.$('#energy-fields').validate({
      rules: {
        'existing-pool-pump': {
          minlength: 1,
          number: true
        },
        'new-pool-pump': {
          minlength: 1,
          number: true
        },
        'hours-used': {
          minlength: 1,
          number: true
        },
        'aerosol-percentage': {
          minlength: 1,
          number: true
        },
        'solar-hours-used': {
          minlength: 1,
          number: true
        }
      }
    });
  },

  poolpump: undefined,
  aerosol: undefined,
  solar: undefined,

  poolPumpCheckbox: function () {
    var checkbox = this.get('poolpump');

    var required_fields = ['#existing-pool-pump', '#new-pool-pump', '#hours-used'];



    if (checkbox) {
      Ember.$('#pool-pump-fields').show();
      //make some fields required
      /*
      for (var f = 0; f < required_fields.length; f++) {
        Ember.$(required_fields[f]).rules('add', {required: true});
      }
      */

    } else {
      //make some fields required
      /*
      for (var i = 0; i < required_fields.length; i++) {
        Ember.$(required_fields[i]).rules('remove', 'required');
      }
      */

      Ember.$('#pool-pump-fields').hide();
    }

  }.observes('poolpump'),

  aerosolCheckbox: function () {
    var checkbox = this.get('aerosol');

    if (checkbox) {
      Ember.$('#aerosol-fields').show();
    } else {
      Ember.$('#aerosol-fields').hide();
    }
  }.observes('aerosol'),

  solarCheckbox: function () {
    var checkbox = this.get('solar');

    if (checkbox) {
      Ember.$('#solar-fields').show();
    } else {
      Ember.$('#solar-fields').hide();
    }
  }.observes('solar'),

  actions: {
    updateData: function () {
      if (Ember.$("#energy-fields").valid()) {
        this.sendAction('update', {key: 'energy', value: this.get('energy')});
      }
    }
  }

});
