import Ember from 'ember';
import WizardComponent from '../mixins/wizard-component';
import files from '../utils/files';
import colors, {rgba} from '../utils/colors';

export default Ember.Component.extend(WizardComponent, {

  isFullScreen: false,
  solarProductionColor: rgba(colors.charts.green),
  usageAfterColor: rgba(colors.charts.blue),
  files: files,
  settings: undefined,
  componentId: "presentation-slider",
  showArrows: true,

  cashFlowYears: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25
  ],

  backgrounds: [
    0, 1, 3, 7, 9, 8
  ],
  currentBackgroundIndex: -1,

  backgroundUrl: function() {
    var currentBackgroundIndex = this.get('currentBackgroundIndex'),
      nameSpace = '/images/presentation/',
      backgrounds = this.get('backgrounds');

    if (currentBackgroundIndex < backgrounds.length - 1) {
      currentBackgroundIndex++;
    } else {
      currentBackgroundIndex = 0;
    }

    this.set('currentBackgroundIndex', currentBackgroundIndex);

    return nameSpace + backgrounds[currentBackgroundIndex] + '.jpg';
  }.property('currentSlideIndex'),

  barChartStyle: function () {
    var is = this.get('isFullScreen');

    if (is) {
      return "width: 100%; height: 420px;";
    } else {
      return "width: 100%; height: 400px;";
    }
  }.property('isFullScreen'),

  nameSpace: "components/presentation-slider",

  slidesNames: [
    'introduction',
    'company-info',
    'electricity-usage',
    'energy-reduction',
    'panel-layout',
    'energy-production',
    'energy-mix',
    'financial-summary',
    'cumulative-savings',
    'annual-cash-flow',
    'assumptions'
  ],

  slides: function() {
    var names = this.get('slidesNames').slice(),
      panelLayout = 'panel-layout',
      energyEfficiency = 'energy-reduction',
      solarPv = 'energy-production';

    //panel layout
    if (!this.get('proposal.panelLayoutFile.available')) {
      this._removeSlide(names, panelLayout);
    }
    //energy efficiency
    if (!this.get('proposal.selectedItems.firstObject')) {
      this._removeSlide(names, energyEfficiency);
    }
    //solar pv
    if (!this.get('proposal.ac_annual')) {
      this._removeSlide(names, solarPv);
    }

    return names;
  }.property('slidesNames',
    'proposal.panelLayoutFile.available',
    'proposal.selectedItems.firstObject',
    'proposal.ac_annual'
  ),

  _removeSlide: function(slides, slide) {
    slides.splice(slides.indexOf(slide), 1);
  },

  footers: [
    'energy-reduction',
    'energy-production'
  ],
  disclaimers: [
    '',
    'Disclaimer', // company info
    'Utility usage data based on customer provided',
    'Energy reduction estimates based on historical customer installations. Actual savings may vary.',
    'Panel Layout',
    'Solar PV system production based on NREL PV Watts calculator. Actual production may vary depending on final system configuration and site conditions.',
    'Actual energy mix may vary depending on future energy usage habits and solar PV production.',
    'Actual incentives, tax credits and rebates are subject to change. It is the customer\'s responsability to check with their CPA for tax credit eligibility.',
    'Disclaimer',
    'Disclaimer',
    'Disclaimer',
    'Disclaimer',
    ''
  ],

  currentSlideIndex: 0,

  currentSlideNumber: function (){
    return this.get('currentSlideIndex') + 1;
  }.property('currentSlideIndex'),

  currentSlideDisclaimer: function () {
    var index = this.get('currentSlideIndex') || 0,
      descriptions = this.get('disclaimers') || [];

    return descriptions[index] || null;
  }.property('currentSlideIndex'),

  currentSlideFooter: function () {
    var name = this.get('currentSlideName'),
      footers = this.get('footers'),
      nameSpace = this.get('nameSpace');

    if (footers.indexOf(name) !== -1) {
      return nameSpace + '/' + name + '-footer';
    }

    return false;
  }.property('currentSlide'),

  toggleFullscreenClass: function () {
    var element = this.$('#presentation-slider'),
      is = this.get('isFullScreen');

    if (is) {
      element.addClass('full-screen');
    } else {
      element.removeClass('full-screen');
    }
  }.observes('isFullScreen'),

  didInsertElement: function () {
    var elem = document.getElementById("presentation-slider"),
      self = this,
      exitHandler = function () {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

        if (!fullscreenElement) {
          self.set('isFullScreen', false);
        }
      };
    this.set('currentSlideIndex', 0);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
  },

  actions: {

    goFullScreen: function () {
      var elem = document.getElementById("presentation-slider");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      this.set('isFullScreen', true);
    },

    exitFullScreen: function () {
      this.set('isFullScreen', false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
});
