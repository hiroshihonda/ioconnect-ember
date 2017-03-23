import Ember from 'ember';
import SettingsRoute from '../../mixins/settings-route';
import config from '../../config/environment';

export default Ember.Route.extend(SettingsRoute, {

  settingsNames: [
    'companyName',
    'companyAddress',
    'companyPhone',
    'companyEmail',
    'companyLicense',
    'companyGrossProfitMargin',
    'zohoAuthToken'
  ],

  setOptions: config.setOptions
});
