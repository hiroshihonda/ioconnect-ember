import config from '../config/environment';
import Ember from 'ember';

var fileModel = Ember.Object.extend({
    name: null,
    available: false,
    url: function () {
      if (!this.get('available')) {
        return null;
      }
      return config.apiHost + '/api/files?name=' + this.get('name')
    }.property('name', 'uploaded')
  }),
  filesNames = {
    logo: 'company-logo.png',
    pdf: 'company-info.pdf',
    presentationTestimonial: 'presentation-testimonial.png',
    presentationImage2: 'presentation-image-2.png'
  },
  files = {
    model: fileModel,
    pdf: fileModel.create(),
    logo: fileModel.create(),
    presentationTestimonial: fileModel.create(),
    presentationImage2: fileModel.create()
  };

var callFile = function(key) {
  Ember.$.ajax({
    url: config.apiHost + '/api/files',
    data: {
      name: filesNames[key]
    },
    type: 'GET'
  }).then(function () {
    files[key].set('name', filesNames[key]);
    files[key].set('available', true);
  });
};


export var initializeFiles = function () {
  for(var key in filesNames) {
    files[key].set('available', false);
    callFile(key);
  }
};

export var fileNames = filesNames;
export default files;
