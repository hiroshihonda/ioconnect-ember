import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import config from '../config/environment';
import {initializeFiles} from '../utils/files';

export default EmberUploader.FileField.extend({

  url: undefined,
  name: undefined,
  model: undefined,

  filesDidChange: function(files) {
    var uploadUrl = config.apiHost + this.get('url');
    var name = this.get('name') || this.get('model.name'),
      model = this.get('model');

    if (model) {
      model.set('available', false);
    }
	
	if(!name)
	{
		name = Math.random().toString(36)
		try
		{
			let ext = files[0].name.match(/(\.\w+)$/)[1]
			name += ext
		}
		catch(e)
		{
			
		}
		
		if(!Ember.isEmpty(files) && model)
			model.set('name', name)
	}

    var uploader = EmberUploader.Uploader.create({
      url: uploadUrl
    });

    uploader.on('didUpload', function(e) {
      initializeFiles();
      if (model) {
        model.set('available', true);
      }
    });

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0], {
        name: name
      });
    }
  }
});
