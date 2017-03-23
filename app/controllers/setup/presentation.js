import Ember from 'ember';
import files from '../../utils/files';
import {fileNames} from '../../utils/files';
import SettingsSaver from '../../mixins/settings-saver';

export default Ember.Controller.extend(SettingsSaver, {

  files: files,
  fileNames: fileNames

});
