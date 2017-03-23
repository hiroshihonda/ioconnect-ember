import Ember from 'ember';
import {initializeFiles} from '../utils/files';

export default Ember.Controller.extend({

  email: undefined,
  password: undefined,

  actions: {

    login: function () {
      var email = this.get("email"),
        password = this.get("password"), self=this;

      this.get("session").authenticate("authenticator:application", {
        email: email,
        password: password
      }).then(function() {
        console.log("Success logged in");
		// self.controllerFor('application').set('fromApplication', false)
			initializeFiles()
		self.transitionTo('index')
		// window.location.hash = ''
		// window.location.reload()
      }, function(err) {
        console.log("error logging in", err);
      });
    }
	
  }
});
