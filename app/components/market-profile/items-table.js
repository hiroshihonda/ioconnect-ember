import Ember from 'ember';
import {typeValues} from '../../models/market-profile/tax';

export default Ember.Component.extend({

  taxTypes: typeValues,
  edit: false,

  /**
   * Create a new market profile item for form binding
   *
   * @returns {*}
   */
  createNewItem: function() {
    var products = this.get('products'),
      store = this.store;

    return store.createRecord('market-profile/item', {
      product: products.objectAt(0),
      federal: store.createRecord('market-profile/tax'),
      state: store.createRecord('market-profile/tax'),
      utility: store.createRecord('market-profile/tax'),
      tax: store.createRecord('market-profile/tax'),
      rebates: store.createRecord('market-profile/tax')
    });
  },


  actions: {
    cancelAddItem: function(item) {
      this.get('profile').get('items').removeObject(item);
      this.store.deleteRecord(item);
    },

    addItem: function() {
      var profile = this.get('profile'),
        store = this.store;

      profile.get('items').addObject(this.createNewItem());
    },

    deleteSavedItem: function(profile, item) {
      this.store.deleteRecord(item);
      profile.save();
    },
  }

});
