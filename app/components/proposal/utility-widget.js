import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function () {
    var potential = this.get('potential');

    var utilityUsage = potential.get('utilityUsage');

    //utilityUsage.set('electricUtility', 'bayern');
  }
});
