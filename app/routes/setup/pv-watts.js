import Ember from 'ember';
import SettingsRoute from '../../mixins/settings-route';
import {values, callPVWatts} from '../../models/proposal/pvwatt';

export default Ember.Route.extend(SettingsRoute, {

  settingsNames: [
    'dc_ac_ratio',
    'inv_eff',
    'gcr',
    'system_size',
    'system_production',
    'ppw',
    'module_type',
    'array_type',
    'losses'
  ],

  onSettingsApplied: function() {
    var ns = 'controller.settings.',
      losses = ns + 'losses.value',
      array_type = ns + 'array_type.value',
      module_type = ns + 'module_type.value',
      tmp;

    console.log('mod', this.get(losses), this.get(array_type), this.get(module_type));

    this.get(losses) || this.set(losses, 14);
    (tmp = this.get(array_type)) ? this.set(array_type, parseInt(tmp) || 0) : this.set(array_type, values.array_type[0].value);
    (tmp = this.get(module_type)) ? this.set(module_type, parseInt(tmp) || 0) : this.set(module_type, values.module_type[0].value);

    console.log('mod1', this.get(losses), this.get(array_type), this.get(module_type));
  }
});
