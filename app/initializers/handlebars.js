import Ember from 'ember';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
  Number.prototype.formatMoney = function (c, d, t) {

  };

  Ember.Handlebars.registerBoundHelper('formatDate', function(string, format) {
    var frm = (format && format.length) ? format : "MMM Do YYYY, h:mm:ss A";

    return moment(string).format(frm);
  });

  Ember.Handlebars.registerBoundHelper('plus', function(a, b) {
    return a + b;
  });

  Ember.Handlebars.registerBoundHelper('numberFormat', function (n, c) {
    var c = isNaN(c = Math.abs(c)) ? 0 : c,
      d =  ".",
      t =  ",",
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  });

  Ember.Handlebars.registerBoundHelper('arrayAt', function(array, index) {
    return array[index] || "";
  });

  Ember.Handlebars.registerBoundHelper('range', function(values) {
    var start = values[0];
    var count = values[1];

    var ret = [];
    for(var i = 0; i < count; i++) {
      ret.push(i+start);
    }
    return ret;
  });
}

export default {
  name: 'handlebars',
  initialize: initialize
};
