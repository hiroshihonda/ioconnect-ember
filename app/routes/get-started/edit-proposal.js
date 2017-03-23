import Ember from 'ember';
import SettingsRoute from '../../mixins/settings-route';
import files from '../../utils/files';
import config from '../../config/environment';

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

  controllerName: 'get-started.item.index',

  model: function(params) {
    var store = this.store;
	
	let propLoaded = store.recordIsLoaded('proposal', params.proposal_id)
	let propPromise = new Ember.RSVP.Promise(function(resolve, reject) {
		store.find('proposal', params.proposal_id).then(function(model) {
			if(propLoaded)
			{
				resolve(model)
				// model.reload().then(function(model) {
					// resolve(model)
				// })
			}
			else
				resolve(model)
		})
	})

    return Ember.RSVP.hash({
      settings: store.findAll('setting'),
      proposal: propPromise,
	  setOptions: store.findAll('setoption'),
	  loanOptions: store.findAll('loan'),
	  shouldRefresh: propLoaded
    });
  },

  renderTemplate: function(){
	  Ember.run.later(()=> this.render('get-started.item.index'))
  },

  setupController: function(controller, resp){

  // if(resp.shouldRefresh)
  // {
	 //  window.location.reload()
	 //  return
  // }
  
    var proposal = resp.proposal;

    this._super(controller, resp);

    controller.set('proposal', proposal);
    controller.set('model', proposal.get('potential'));
	
	controller.set('marketProfiles', this.store.findAll('market-profile/profile'));

    controller.set('files', files);
	
	let marketProfile = proposal.get('marketProfile')
	controller.set('selectedMarketProfile', marketProfile);
	
	let loanNoLoan = null;
    // Inject loan options to proposal
    resp.loanOptions.forEach( (loan) => {
		let l = this.store.createRecord('proposal/loan', loan.serialize())
		if(loan.get('term') == 0)
		{
			loanNoLoan = l
		}
		
		if(!proposal.get('loanOptions').findBy('name', loan.get('name')))
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

    controller.set('usageCalendar', this.store.createRecord('potential/calendar'));

    controller.set('billCalendar', this.store.createRecord('potential/calendar'));
  }
});
