import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: [
    'set-option'
  ],
  setOption: undefined,
  savePromise: undefined,


  actions: {
    addSetOptionItem: function() {
      this.get('setOption.items').addObject(this.store.createRecord('setoption-item'));
    },

    deleteSetOptionItem: function(item) {
      item.deleteRecord();
      this.get('setOption').save();
    },

    saveSetOption: function() {

    var setOption = this.get('setOption'),
      promise = setOption.save();

      this.set('savePromise', promise);

      promise.then(function() {
        setOption.get('items').filterBy('id', null).invoke('deleteRecord');
      });
    }
  }

});
