import Ember from 'ember';
import SettingsRoute from '../../mixins/settings-route';

export default Ember.Route.extend(SettingsRoute, {

  settingsNames: [
    'description',
    'whyChooseUs',
    'testimonial',
    'systemSize',
    'installedDate',
    'utilityCompanyName',
    'utilityCompanyInformation'
  ]
});
