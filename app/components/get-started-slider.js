import Ember from 'ember';

export default Ember.Component.extend({
  slides: {
    'lookup': 'Customer Lookup',
    'utility-data': 'Utility Data',
    'energy-efficiency': 'Upgrades',
    'address': 'Address',
    'solar-production': 'Solar Production',
    'financing': 'Loan Options',
    'solution-presentation': 'Quote'
  },

  currentSlideNumber: function() {
    var now = 0,
      slides = this.get('slides'),
      current = this.get('slideName');

    for (var key in slides) {
      if (current == key) {
        break;
      }
      now ++;
    }

    return now + 1;
  }.property('slideName'),

  /**
   * Show the selected slide label
   */
  currentSlideLabel: function() {
    var slides = this.get('slides'),
      label = this.get('slideName');

    return slides[label];
  }.property('slideName'),

  /**
   * Determines the number of slides
   */
  slidesCount: function() {
    var count = 0;

    for (var key in this.get('slides')) {
      count ++;
    }

    return count;
  }.property(),

  actions: {
    setSlide: function(slide) {
      this.sendAction('action', slide);
    }
  }
});
