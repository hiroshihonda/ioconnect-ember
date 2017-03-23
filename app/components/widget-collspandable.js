import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function () {

    $('.collapse').collapse();
  },

  collapse: function(){
    if(this.get('collapsed')){
      return 'in';
    }
    return '';
  }.property('collapsed')
});
