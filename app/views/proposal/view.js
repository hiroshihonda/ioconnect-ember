import Ember from 'ember';
import Widget from 'zoho-web/views/widget';

export default Widget.extend({
  templateName: 'views/proposal/view',

  title: 'Potential Data',
  widgetId: 'potential-data-widget',

  didInsertElement: function () {
    this._super();
    console.log("view called!");

    Ember.$(".editable").editable({
      success: function (response, newValue) {
      }
    });

  }
});
