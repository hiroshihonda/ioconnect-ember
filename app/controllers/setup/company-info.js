import Ember from 'ember';
import SettingsSaver from '../../mixins/settings-saver';
import files from '../../utils/files';
import {fileNames} from '../../utils/files';

export default Ember.Controller.extend(SettingsSaver, {

  files: files,
  fileNames: fileNames

});
