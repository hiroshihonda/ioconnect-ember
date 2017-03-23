import Ember from 'ember';

export default Ember.Component.extend({

  table: null

  /*
  didInsertElement: function(){
    this.table = Ember.$('#' + this.get('table-id')).DataTable({
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
  },

  watchChanges: function(){
    // this.table.draw();
    //this.table.draw();
    console.log(this.table);
  }.observes('proposals')
     */
	 
	 ,actions: {
		 cloneProposal(id) {
			 this.sendAction('cloneProposal', id)
		 },
		 
		 acceptProposal(id) {
			 this.sendAction('acceptProposal',id)
		 }
	 }

});
