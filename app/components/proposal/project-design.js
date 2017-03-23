import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function () {

    Ember.$('#project-design-form').validate({
      rules: {
        'system-size-input': {
          minlength: 1,
          number: true
        },
        'system-production-input': {
          minlength: 1,
          number: true
        },
        'price-per-watt': {
          minlength: 1,
          number: true
        }
      }
    });
  },

  actions: {
    updateData: function () {
      this.sendAction('update', {key: 'design', value: this.get('project-design')});
    }
  }
});
