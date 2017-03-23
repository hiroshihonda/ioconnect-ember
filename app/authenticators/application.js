import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import config from '../config/environment';

export default Base.extend({

  _getPromise: function(opt) {
    opt = opt || {};



    var options = Ember.Object.create(opt, {
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      url: config.apiHost + "/api/1.0/users/logged"
    });

    return Ember.$.ajax(options);
  },

  restore(data) {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      self._getPromise().then(function(resp) {
        if (data.user.id == resp.user.id) {
          data.user = resp.user;
          resolve(data);
        }
      }, function(errXhr) {
        reject(data);
      });
    });
  },



  authenticate(options) {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      self._getPromise({
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        beforeSend: function(xhr) {
          console.log("setting authorization");
          xhr.setRequestHeader("Authorization", "Basic " + btoa(options.email + ":" + options.password))
        }
      }).then(function(data) {
        data.auth = options;
        resolve(data);
      }, function(xhr) {
        reject(options);
      });
    });
  },

  invalidate(data) {
    return Ember.RSVP.resolve();
  }
});
