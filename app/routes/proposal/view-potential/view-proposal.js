import Ember from 'ember';
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

  controllerName: 'get-started',

  model: function(params) {
    var store = this.store;

    return Ember.RSVP.hash({
      settings: store.findAll('setting'),
      proposal: store.find('proposal', params.proposal_id)
    });
  },

  renderTemplate: function(){
    this.render({outlet: 'view-proposal', into: 'proposal.singleview'});
  },

  setupController: function(controller, resp){

    var proposal = resp.proposal;

    this._super(controller, resp);

    controller.set('proposal', proposal);
    controller.set('model', proposal.get('potential'));

    controller.set('usageCalendar', this.store.createRecord('potential/calendar'));

    controller.set('billCalendar', this.store.createRecord('potential/calendar'));
  }
});
