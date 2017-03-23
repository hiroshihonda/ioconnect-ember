import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'views/crm/zoho/view',

  didInsertElement: function(){
    Ember.$(".editable").editable({
      success: function(response, newValue){
      }
    });
  }

});
