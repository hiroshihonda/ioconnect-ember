import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function(){
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
