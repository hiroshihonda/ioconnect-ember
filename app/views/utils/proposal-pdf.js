import Ember from 'ember';
import presentationPdf from '../../utils/presentation-pdf';

export default Ember.View.extend({

  currentSlideIndex: 0,
  slider: undefined,

  didInsertElement: function () {
    var proposal = this.get('controller.proposal'),
      settings = this.get('controller.settings'),
      element = this.$('#pdf-workspace').get(0),
      app = this.get('application'),
      slider = app.__container__.lookup('component:presentation-slider');

    slider.set('settings', settings);
    slider.set('proposal', proposal);

    var el = document.createElement("div");
    slider.replaceIn(el);
    slider.set('showArrows', false);
    slider.set('currentSlideIndex', 0);

    $(element).html(el);

    this.set('slider', slider);
  },

  actions: {
    nextSlide: function () {
      var newSlide = this.get('currentSlideIndex') + 1,
        maxSlide = this.get('slider.slides.length');

      if (newSlide <= maxSlide) {
        this.set('slider.currentSlideIndex', newSlide);
        this.set('currentSlideIndex', newSlide);
      }

    }
  }
});
