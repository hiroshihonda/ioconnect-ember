import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextSlide: function() {
      console.log('component');
      this.sendAction();
    },
    prevSlide: function() {
      this.sendAction();
    }
  }
});
