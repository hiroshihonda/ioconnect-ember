import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'views/tables/zoho',
  layoutName: 'views/widget',
  title: 'Customer Lookup - step 1',

  didInsertElement: function () {
    Ember.$('#zoho-table').dataTable({
      fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Row click
        $(nRow).on('click', function () {
          //console.log('Row Clicked. Look I have access to all params, thank You closures.', this, aData, iDisplayIndex, iDisplayIndexFull);
        });

        // Cell click
        $('td', nRow).on('click', function () {
          //console.log('Col Clicked.', this, aData, iDisplayIndex, iDisplayIndexFull);
        });
      }

    });

  }
});
