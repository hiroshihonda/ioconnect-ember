import Ember from 'ember';
import config from '../../../config/environment';
import files from '../../../utils/files';
import SettingsRoute from '../../../mixins/settings-route';

export default Ember.Route.extend(SettingsRoute, {

  settingsNames: [
    'description',
    'whyChooseUs',
    'testimonial',
    'companyName',
    'systemSize',
    'installedDate',
    'utilityCompanyName',
    'utilityCompanyInformation'
  ],

  setOptions: config.setOptions,

  model: function (params, transition) {
    var store = this.store,
		email = transition.queryParams.email || null,
		password = transition.queryParams.password || null;
		
		let hashes = () => Ember.RSVP.hash({
		  settings: store.findAll('setting'),
		  setOptions: store.findAll('setoption'),
		  loanOptions: store.findAll('loan'),
		  potential: store.find('potential', params.potential_id)
		});
		
		if(email && password && transition.queryParams.addressMap)
		{
			var session = this.get("session"),
			  authenticatorName = 'authenticator:application',
			  authenticator = this.container.lookup(authenticatorName);

			return new Ember.RSVP.Promise(function (resolve, reject) {

			  authenticator.authenticate({
				email: email,
				password: password
			  }).then(

				// Authenticated
				function (content) {
				  console.log('Authenticated', content);
				  session.setup(authenticatorName, content, false);

				  hashes().then(function (models) {
					console.log('resolved models');
					
					models.addressMap = transition.queryParams.addressMap
					resolve(models);
				  });
				},

				// Failed authentication
				function (err) {
				  session.clear();
				  session.trigger('sessionAuthenticationFailed', err);
				  reject(err);
				});

			});
		}
		
		return hashes();

  },

  setupController: function (controller, resp) {
    var potential = resp.potential,
      settings = resp.settings,
      store = this.store;

    this._super(controller, resp);

    this.loadGoogleMap()
    controller.set('model', potential);
    controller.set('marketProfiles', this.store.findAll('market-profile/profile'));

    controller.set('files', files);

    controller.set('proposal', this.store.createRecord('proposal', {
      //utilityUsage: this.createRecord('')
      panelLayoutFileName: Math.random().toString(36) + ".png",
      potential: potential,
      // pvwatts: this.store.createRecord('proposal/pvwatt'),
      design: this.store.createRecord('proposal/project-design'),
      savingsCalculationType: 'average'
    }));
	
	controller.get('proposal.pvwatts').addObject(this.store.createRecord('proposal/pvwatt'));

    controller.get('proposal.tiers').addObject(this.store.createRecord('proposal/tier', {
      percentage: 100
    }));

	let loanNoLoan = null;
    // Inject loan options to proposal
    resp.loanOptions.forEach(function (loan) {
		let l = store.createRecord('proposal/loan', loan.serialize())
		if(loan.get('term') == 0)
		{
			loanNoLoan = l
		}
      controller.get('proposal.loanOptions').addObject(l)
        
      
    });
	
	if(!loanNoLoan)
	{
		loanNoLoan = this.store.createRecord('proposal/loan', {
			federal: false,
			firstYearSavings: null,
			interestCapitalization: null,
			interestRate: 0,
			name: "No Loan",
			rebate: false,
			state: false,
			term: 0,
			utility: false,
			selected: true
		})
		
		controller.get('proposal.loanOptions').forEach((l)=>l.set('selected',false))
		controller.get('proposal.loanOptions').addObject(loanNoLoan);
	}
	else
	{
		controller.get('proposal.loanOptions').forEach((l)=>l.set('selected',false))
		loanNoLoan.set('selected', true)
	}
	
	if(resp.addressMap)
	{
		let addressUrl = resp.addressMap
		potential.set('address', decodeURIComponent(addressUrl))
	}

	if(window.location.href.indexOf('address')>-1)
		controller.set('currentSlideName','address');
	else
		controller.set("currentSlideName", "lookup");

    this.store.findAll('setting').then(function (settings) {
      var pv = controller.get('proposal.pvwatts'),
        dc_ac_ratio = settings.findBy('name', 'dc_ac_ratio'),
        inv_eff = settings.findBy('name', 'inv_eff'),
        gcr = settings.findBy('name', 'gcr'),
        ppw = settings.findBy('name', 'ppw'),
        module_type = settings.findBy('name', 'module_type'),
        array_type = settings.findBy('name', 'array_type'),
        losses = settings.findBy('name', 'losses');

      pv.forEach((pv)=>pv.setProperties({
        'dc_ac_ratio': dc_ac_ratio ? dc_ac_ratio.get('value') : null,
        'inv_eff': inv_eff ? inv_eff.get('value') : null,
        'gcr': gcr ? gcr.get('value') : null,
        'module_type': module_type ? module_type.get('value') : 0,
        'array_type': array_type ? array_type.get('value') : 0,
        'losses': losses ? losses.get('value') : 14
      }));

      controller.get('proposal.design').set('pricePerWatt', ppw ? ppw.get('value') : null);
    });


    var utility = potential.get('utilityUsage');

    if (typeof utility == 'undefined' || utility == null) {
      potential.set('utilityUsage', this.store.createRecord('potential/utility'));

      utility = potential.get('utilityUsage');

      utility.set('usageCalendar', this.store.createRecord('potential/calendar'));
      utility.set('billCalendar', this.store.createRecord('potential/calendar'));
    }

  },

  actions: {
    willTransition: function (transition) {
      var transitionName = transition.targetName;
      var currentRoute = this.controllerFor('application').get('currentRouteName');

      var transitionSpaces = transitionName.split('.');
      var currentSpaces = currentRoute.split('.');

      if (transitionSpaces[0] != currentSpaces[0]) {
        this.store.all('proposal').filterBy('id', null).invoke('deleteRecord');

      }
      /*
       this.store.unloadAll('proposal');
       this.store.unloadAll('potential');
       this.store.unloadAll('potential/utility');
       this.store.unloadAll('potential/calendar');
       */
    },
	
	addArray() {
		let controller = this.controllerFor('get-started.item.index');
		if(controller.get('proposal.pvwatts').length < 4)
		{
			let record = this.store.createRecord('proposal/pvwatt');
			
			this.store.findAll('setting').then(function (settings) {
			  var pv = controller.get('proposal.pvwatts'),
				dc_ac_ratio = settings.findBy('name', 'dc_ac_ratio'),
				inv_eff = settings.findBy('name', 'inv_eff'),
				gcr = settings.findBy('name', 'gcr'),
				ppw = settings.findBy('name', 'ppw'),
				module_type = settings.findBy('name', 'module_type'),
				array_type = settings.findBy('name', 'array_type'),
				losses = settings.findBy('name', 'losses');

			  record.setProperties({
				'dc_ac_ratio': dc_ac_ratio ? dc_ac_ratio.get('value') : null,
				'inv_eff': inv_eff ? inv_eff.get('value') : null,
				'gcr': gcr ? gcr.get('value') : null,
				'module_type': module_type ? module_type.get('value') : 0,
				'array_type': array_type ? array_type.get('value') : 0,
				'losses': losses ? losses.get('value') : 14
			  });

			  controller.get('proposal.pvwatts').addObject(record);
			});
			
		}
	},
	
	removeArray() {
		let controller = this.controllerFor('get-started.item.index');
		if(controller.get('proposal.pvwatts').length > 1)
			controller.get('proposal.pvwatts').popObject();
	}
  }
});
