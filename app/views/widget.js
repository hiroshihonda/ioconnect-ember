import Ember from 'ember';

export default Ember.View.extend({
  layoutName: 'views/widget',

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
