import Ember from 'ember';
import {savingsCalculation, productPricing} from '../../models/product';

export default Ember.Controller.extend({

  newProduct: null,
  createProductPromise: null,

  createNewProduct: function() {
    return Ember.Object.createWithMixins(Ember.Copyable, {
      name: null,
      savingsCalculation: "KWH",
      productPricing: "EACH",
      price: null
    });
  },

  savingsCalculation: function() {
    return this._computeObjectToArray(savingsCalculation);
  }.property(),

  productPricing: function() {
    return this._computeObjectToArray(productPricing);
  }.property(),

  /**
   * Compute an literal into an array of literals with key and name
   *
   * @param object
   * @returns {Array}
   * @private
   */
  _computeObjectToArray: function(object) {
    var values = [];

    for(var k in object) {
      values.push({
        key: k,
        name: object[k]
      });
    }

    return values;
  },

  actions: {
    createProduct: function() {
      var product = this.store.createRecord('product'),
        promise = null;

      product.setProperties(this.get('newProduct'));

      promise = product.save();

      this.set('createProductPromise', promise);

      promise.then(function(){
        this.set('newProduct', this.createNewProduct());
      }.bind(this));

    },

    deleteProduct: function(product) {
      product.deleteRecord();
      product.save();
    },

    toggleEdit: function(product) {
      var state = product.get('isEditing');

      product.set('isEditing', !state);
    },

    saveProduct: function(product) {
      var promise = null;

      promise = product.save();

      product.set('savePromise', promise);

      promise.then(function() {
        setTimeout(function() {
          product.set('isEditing', false);
          product.set('savePromise', null);
        }, 100);
      });
    }
  }});
