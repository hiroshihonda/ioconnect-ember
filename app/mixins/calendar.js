import Ember from 'ember';

export default Ember.Mixin.create({


  changedMonths: "",
  /**
   * Trigger an event when any month changed
   */
  monthHasChanged: function(value) {
    this.set('changedMonths', Math.random());
  }.observes('jan', 'feb', 'mar', 'apr', 'may',
    'jun', 'jul', 'sep', 'oct', 'nov', 'dec'
  )
});
