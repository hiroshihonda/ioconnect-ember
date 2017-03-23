import Ember from 'ember';

export default Ember.Mixin.create({

  currentSlideIndex: 0,
  nameSpace: "",
  slides: [],

  _onSlideCountChange: function() {
    this.set('currentSlideIndex', 0);
  }.observes('slides').on('init'),

  currentSlideName: function () {
    var names = this.get('slides'),
      index = this.get('currentSlideIndex');

    return names[index];
  }.property('currentSlideIndex', 'slides'),

  currentSlide: function () {
    var name = this.get('currentSlideName'),
      nameSpace = this.get('nameSpace');

    return nameSpace + '/' + name;

  }.property('currentSlideName'),

  hasNextSlide: function () {
    var index = this.get('currentSlideIndex'),
      length = this.get('slides').length;

    return index < length - 1;
  }.property('currentSlideIndex', 'slides'),

  hasPrevSlide: function () {
    var index = this.get('currentSlideIndex');

    return index > 0;
  }.property('currentSlideIndex', 'slides'),

  actions: {
    setSlide: function (direction) {
      var index = this.get('currentSlideIndex'),
        length = this.get('slides').length;
      if (direction === 'next' && index < length - 1) {
        this.set('currentSlideIndex', index + 1);
      } else if (direction === 'prev' && index > 0) {
        this.set('currentSlideIndex', index - 1);
      }
    }
  }

});
