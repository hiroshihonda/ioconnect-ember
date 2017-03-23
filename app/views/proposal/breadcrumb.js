import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'views/proposal/breadcrumb',

  didInsertElement: function () {

    //var topFix = $("#top-fix-container");
    //var breadcrumb = $("#fixed-breadcrumb");
    //
    //$("#fixed-breadcrumb a").click(function(event){
    //
    //  var el = $(this);
    //
    //  var scrollElement = $(el.data('where'));
    //
    //  $('html,body').animate({scrollTop: scrollElement.offset().top || 0});
    //})
    //
    //$('body').scrollspy({
    //  target: '#fixed-breadcrumb',
    //  offset: 100,
    //  min: 50,
    //  max: 9999,
    //  onEnter: function (element, position) {
    //    topFix.addClass('navbar-fixed-top');
    //    topFix.addClass('navbar-top-bg');
    //    breadcrumb.addClass('breadcrumb-padding');
    //  },
    //  onLeave: function (element, position) {
    //    console.log(element);
    //    console.log(position);
    //    topFix.removeClass('navbar-fixed-top');
    //    topFix.removeClass('navbar-top-bg');
    //    breadcrumb.removeClass('breadcrumb-padding');
    //  }
    //});
  }
});
