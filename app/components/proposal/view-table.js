import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    savePotential: function(){
      var potential = this.get('model');

      console.log(potential.get('potentialName'));

      this.sendAction('update', {potential: potential});
    }
  },

  didInsertElement: function () {

    //this._super();

    var model = this.get('model');

    Ember.$("#view-potential-table").editable({
      success: function (response, newValue) {
        var el = Ember.$(this);
        var property = el.data('model-property');
        //model.set(property, newValue);

        console.log(newValue);
      },
      validate: function(){
      },
      selector: '.editable',
      display: false
    });

    /*
    Ember.$(".editable").each(function () {
      if (Ember.$(this).text() == '') {
        Ember.$(this).html('none');
      }
    });
    */
  },

  modelChanged: function () {

  }.observes('model')
});
