import Ember from 'ember';
import {values, callPVWatts} from '../../models/proposal/pvwatt';
import SaverController from '../../mixins/settings-saver';

export default Ember.Controller.extend(SaverController, {

  saveSettingsPromise: undefined,
  moduleTypes: values.module_type,
  arrayTypes: values.array_type

});
