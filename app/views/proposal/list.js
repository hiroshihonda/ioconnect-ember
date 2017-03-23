import Ember from 'ember';
import Widget from 'zoho-web/views/widget';

export default Widget.extend({
  templateName: 'views/proposal/list',

  title: 'Customer Lookup',
  widgetId: 'customer-lookup-widget',
  
  willClearRender() {
	  this.get('controller').off('updateTable', this, this.refreshDataTable)
	  this.get('controller').off('destroyTable', this, this.destroyDataTable)
  },
  
  didInsertElement() {
	  this._super(...arguments)
	  
	  this.get('controller').on('destroyTable', this, this.destroyDataTable)
	  this.get('controller').on('updateTable', this, this.refreshDataTable)
  },
  
  refreshDataTable() {
	  this.rerender()
	  // this._dataTable()
  },
  
  destroyDataTable() {
	  Ember.$('#zoho-table').dataTable().fnDestroy()
  },

  _dataTable: function () {
	
    Ember.$('#zoho-table').dataTable({
      fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Row click
        $(nRow).on('click', function () {
          // console.log('Row Clicked. Look I have access to all params, thank You closures.', this, aData, iDisplayIndex, iDisplayIndexFull);
        });

        // Cell click
        $('td', nRow).on('click', function () {
          // console.log('Col Clicked.', this, aData, iDisplayIndex, iDisplayIndexFull);
        });
      },
	  
	  columnDefs: [{
		  orderable:false,
		  targets:[0]
	  }],
	  
	  order: [[1,'asc']]

    });
  }.on('didInsertElement')
});
