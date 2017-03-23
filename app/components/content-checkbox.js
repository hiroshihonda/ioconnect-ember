import Ember from 'ember';

export default Ember.Component.extend({

  checkedContent: function(){
    var checkbox = this.get('checked-content');

    var div = this.get('content-id');
    div = Ember.$('#' + div);

    if(checkbox){
      div.show();
    } else {
      div.hide();
    }
  }.observes('checked-content')
});
