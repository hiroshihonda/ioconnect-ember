import Ember from 'ember';

export default Ember.Component.extend({

  value: 0,

  didInsertElement: function () {
    this.watchEnergy();
  },

  watchEnergy: function () {
    var energy = this.get('energy');

    if (
      energy != null &&
      energy.hoursUsed != null &&
      energy.existingPoolPump != null &&
      energy.newPoolPump != null
    ) {
      var c = (energy.existingPoolPump-energy.newPoolPump);
      c = c*energy.hoursUsed;
      c = c*30;
      c = c/1000;

      this.set('value', c);
    } else {
      this.set('value', 0);
    }

    //console.log(energy.hoursUsed);
  }.observes('energy')


});
