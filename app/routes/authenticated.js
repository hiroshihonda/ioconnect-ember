/**
 * Created by rgb24 on 4/14/15.
 */

import Ember from 'ember';

var Authenticated = Ember.Route.extend({
  beforeModel: function(){
    console.log("dddd");
  }
});

export default Authenticated;

