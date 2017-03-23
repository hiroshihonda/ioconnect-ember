import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function (jqXHR, options) {
    var data = this.get('session.store').restore().secure || {};

    options.headers = options.headers || {};
    options.headers["X-Requested-With"] = "XMLHttpRequest";

    if (data && data.auth && data.auth.email && data.auth.password) {
      options.crossDomain = true;
      options.xhrFields = {
        withCredentials: true

      };
      options.headers["Authorization"] = "Basic " + btoa(data.auth.email + ":" + data.auth.password)
    }

  }
});
