import Ember from 'ember';

export default Ember.Controller.extend({
  currentPathName: function() {
    console.log(this.get('currentPath'));

    return this.get('currentPath');
  }.observes('currentPath'),
  
  fromApplication: function() {
	  if(arguments.length > 1)
		  this.set('_fromApplication', arguments[1])
	  else if(this.get('currentPath') && this.get('currentPath') != 'index')
		  this.set('_fromApplication', true)
	  else if(this.get('currentPath'))
		  this.set('_fromApplication', false)
	  
	  let value = this.get('_fromApplication')
	  
	  return value
  }.property('currentPath'),
  
  actions: {
	  gotoApp() {
		  this.set('fromApplication', true)
		  this.transitionTo('more')
	  },
	  
	  goHome() {
		  this.set('fromApplication', false)
		  Ember.run.later(()=>this.transitionTo('index'))
	  },
	  
	  logout() {
		  this.get("session").invalidate().then(()=>
			this.transitionTo('index'))
	  }
  }
});
