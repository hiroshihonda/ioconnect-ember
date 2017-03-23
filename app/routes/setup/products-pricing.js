import Ember from 'ember';

export default Ember.Route.extend({


  model: function() {
    return this.store.findAll('product', {
      reload: true
    });
  },

  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set("newProduct", controller.createNewProduct());
  }

});
