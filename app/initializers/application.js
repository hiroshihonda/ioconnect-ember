import DS from 'ember-data';
import Ember from 'ember';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');

  Chart.defaults.global['tooltips']['template'] = [
    '<% if(label){ %>',
    '<%=label %>: ',
    '<% } %>',
    '<%= value.toFixed(0) %>'
  ].join('');

  Chart.defaults.global['tooltips']['multiTemplate'] =  [
    '<%if (datasetLabel){ %>',
    '<%=datasetLabel %>: ',
    '<% } %>',
    '<%= value.toFixed(0) %>'
  ].join('');

}

export default {
  name: 'application',
  initialize: initialize
};
