import Ember from 'ember';
import config from '../config/environment';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  _newModel: function () {
    return Ember.Object.extend({
      name: null,
      url: function () {
        return config.apiHost + '/api/files?name=' + this.get('name')
      }.property('name')
    });
  },

  setupController: function (controller) {
    var logoName = 'company-logo.png',
      pdfName = 'company-info.pdf',
      logo = this._newModel().create(),
      pdf = this._newModel().create();

    controller.set('logo', logo);
    controller.set('pdf', pdf);

    Ember.$.ajax({
      url: config.apiHost + '/api/files',
      data: {
        name: pdfName
      },
      type: 'GET'
    }).then(function () {
      pdf.set('name', pdfName);
    });

    Ember.$.ajax({
      url: config.apiHost + '/api/files',
      data: {
        name: logoName
      },
      type: 'GET'
    }).then(function () {
      logo.set('name', logoName);
    });
  }
});
