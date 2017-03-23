import Ember from 'ember';
import SettingsRoute from '../../mixins/settings-route';

export default Ember.Route.extend(SettingsRoute, {
  settingsNames: [
    'description',
    'whyChooseUs',
    'testimonial',
    'companyName',
    'systemSize',
    'installedDate',
    'utilityCompanyName',
    'utilityCompanyInformation'
  ],

  model: function (params, transition) {
    var store = this.store,
      email = transition.queryParams.email || null,
      password = transition.queryParams.password || null,
      session = this.get("session"),
      authenticatorName = 'authenticator:application',
      authenticator = this.container.lookup(authenticatorName);

    return new Ember.RSVP.Promise(function (resolve, reject) {

      authenticator.authenticate({
        email: email,
        password: password
      }).then(

        // Authenticated
        function (content) {
          console.log('Authenticated', content);
          session.setup(authenticatorName, content, false);

          Ember.RSVP.hash({
            settings: store.findAll('setting'),
            proposal: store.find('proposal', params.proposal_id)
          }).then(function (models) {
            console.log('resolved models');
            resolve(models);
          });
        },

        // Failed authentication
        function (err) {
          session.clear();
          session.trigger('sessionAuthenticationFailed', err);
          reject(err);
        });

    });

  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('proposal', model.proposal);
  }
})
;
