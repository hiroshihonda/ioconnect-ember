import DS from 'ember-data'
import Ember from 'ember'
import files from '../../utils/files'

export default DS.Model.extend({
	fileName: DS.attr(),
	category: DS.attr(),
	
	fileAvailable:false,
	
	fileModel:null,

	file: function () {
		var name = this.get('fileName'),
		  available = name && this.get('fileAvailable');
		  
		  if(!available && name)
		  {
			  Ember.run.next(()=> {
				  Ember.$.ajax({
					url: files.model.create({name:name,available:true}).get('url'),
					type: 'GET'
				  }).then(() => {
					this.set('fileAvailable', true);
				  });
			  })
		  }

		  let model;
		  if(!this.get('fileModel'))
		  {
			model = files.model.create({
			  name: name,
			  available: available
			});
			
			this.set('fileModel', model)
		  }
		  else
		  {
			  model = this.get('fileModel')
			  model.set('name', name)
			  model.set('available', available)
		  }

		return model;
	}.property('fileName','fileAvailable'),
  
	fileUrlRand:'',
  
	fileUrl: function() {
		return this.get('file.url')+
		(this.get('fileUrlRand') ? `&rand=${this.get('fileUrlRand')}`:'')
	}.property('file.url','fileUrlRand'),
	
	fileNameChanged: function() {
		let fileName = this.get('file.name')
		this.set('fileName', fileName)
	}.observes('file.name'),
	
	fileAvailableChanged: function() {
		let available = this.get('file.available')
		if(available)
			this.set('fileUrlRand', Math.random().toString(20))
		
		this.set('fileAvailable', available)
	}.observes('file.available')
})