import Ember from 'ember';
import Authenticated from 'zoho-web/routes/authenticated';

export default Authenticated.extend({
  setupController: function (controller, potentials) {
    controller.set('potentials', potentials);
  },

  model: function () {
    return this.store.find('potential');
  }
});
