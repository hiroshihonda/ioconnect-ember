import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({

  actions: {
    register: function() {
      var model = this.get('model'),
        that = this;

      Ember.$.ajax({
        type: "POST",
        url: config.apiHost + "/public/users",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          user: model.serialize()
        })
      }).then(function(data) {
        that.transitionToRoute("login");
      }, function(xhr) {
        console.log("failed to register the user");
      });
    }
  }
});
