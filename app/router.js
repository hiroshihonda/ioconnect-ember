import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  "use strict";

  this.route('login');
  
  this.route('more');

  this.route('crm', function() {
    this.route('zoho', function() {
      this.route('potentials', function(){
        this.route('view', {path: '/:potential_id'});
      });

    });
  });
  this.route('proposal', {path: 'proposal-lookup'}, function() {
    this.route('view-potential', {path: 'potential/:potential_id'}, function(){
      this.route('view-proposal', {path: 'proposal/:proposal_id'}, function() {
		  // this.route('edit-proposal', {path: 'edit'})
	  })
    });
  });
  this.route('done-deals', function() {
	  this.route('view-potential', {path: 'potential/:potential_id'}, function() {
		  this.route('view-proposal', {path: 'proposal/:proposal_id'}, function() {
			  
		  });
	  });
  });
  this.route('get-started', function() {
    this.route('index', {path: '/'});

    this.route('item', {path: '/potential'}, function() {
      this.route('index', {path: '/:potential_id'}, function() {
		  this.route('slide', {path: '/slide/:slide'});
		  
	  });
    });
	
	   this.route('edit-proposal', {path:'edit/:proposal_id'})
  });

  // PROP-49 - hide about page
  // this.route('about');
  this.route('presentation');

  this.route('setup', function() {
    this.route('market-profile');
    this.route('products-pricing');
    this.route('products-services');
    this.route('pv-watts');
    this.route('company-info');
    this.route('marketprofile');
    this.route('presentation');
    this.route('loan');
  });
  this.route('register');

  this.route('utils', function() {
    this.route('proposal-pdf', {path: '/proposal-pdf/:proposal_id'});
  });
});
