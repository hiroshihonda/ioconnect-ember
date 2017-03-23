import Ember from 'ember';
import {types} from '../../models/market-profile/tax';

export default Ember.Controller.extend({

  newProfile: null,
  newItem: null,
  products: Ember.A([]),
  saveProfilePromise: undefined,

  _createIncentive: function (val) {
    val = val || {};

    return Ember.Object.createWithMixins({
      type: types.PERCENT,
      value: 0,
      cap: undefined
    }, val);
  },

  createNewSolarItem: function () {
    var self = this;

    return Ember.Object.create({
      name: 'Solar',
      federal: self._createIncentive({value: 30}),
      state: self._createIncentive(),
      utility: self._createIncentive(),
      tax: self._createIncentive(),
      rebates: self._createIncentive()
    });
  },

  /**
   * Create a new profile object for form binding
   *
   * @returns {*}
   */
  createNewProfile: function () {
    var self = this;

    return Ember.Object.createWithMixins(Ember.Copyable, {
      name: null,
      items: Ember.A([]),
      solarItem: self.createNewSolarItem(),
      inflationRate: null,
      connectionFee: 10,
      defaultSolarPrice: null
    });
  },

  actions: {

    addItem: function () {
      this.get('newProfile').items.pushObject(this.get('newItem'));
      this.set('newItem', this.createNewItem());
    },

    /**
     * Push a new profile to the server
     *
     */
    saveProfile: function () {
      var profile = this.store.createRecord('market-profile/profile'),
        newProfile = this.get('newProfile'),
        newItems = newProfile.get('items'),
        store = this.store,
        promise = null;

      profile.setProperties(newProfile.getProperties('name', 'solarItem', 'inflationRate', 'connectionFee', 'defaultSolarPrice'));

      newItems.forEach(function (item) {
        profile.get('items').addObject(item);
      });

      promise = profile.save();

      this.set('saveProfilePromise', promise);

      promise.then(function (savedProfile) {
        savedProfile.get('items').filterBy('id', null).invoke('deleteRecord');
        this.set('newProfile', this.createNewProfile());
        this.set('saveProfilePromise', null);
      }.bind(this));
    },


    deleteSavedProfile: function (profile) {
      profile.destroyRecord();
    },

    editSavedProfile: function (profile) {
      this.set('model', profile);
    },

    updateSavedProfile: function (profile) {
      var promise = profile.save();

      profile.set('updatePromise', promise);

      promise.then(function (savedProfile) {
        savedProfile.get('items').filterBy('id', null).invoke('deleteRecord');
        profile.set('updatePromise', null);
      });
    },

    addNewItem: function (profile) {
      var newItem = this.store.createRecord('market-profile/item');

      profile.get('items').addObject(newItem);
    },

    cancelAddItem: function (item) {
      this.store.deleteRecord(item);
    }
  },

  generateNewModel: function () {
    return this.store.createRecord('market-profile/profile');
  }
});
