import Ember from 'ember';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');

  Ember.LinkView.reopen({
    init: function() {
      this._super();
      var self = this;
      Em.keys(this).forEach(function(key) {
        if (key.substr(0, 5) === 'data-') {
          self.get('attributeBindings').pushObject(key);
        }
      });
    }
  });
}

export default {
  name: 'linkview',
  initialize: initialize
};
