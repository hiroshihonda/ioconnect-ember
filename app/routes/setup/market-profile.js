import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    var store = this.store;

    return Ember.RSVP.hash({
      profiles: store.findAll('market-profile/profile'),
      products: store.findAll('product')
    });
  },

  setupController(controller, model) {
    controller.set('products', model.products);
    controller.set('newProfile', controller.createNewProfile());

    model.profiles.forEach(function(profile) {
      if (!profile.get('solarItem')) {
        profile.set('solarItem', controller.createNewSolarItem())
      }
    });

    controller.set('model', model.profiles);
  }
});
