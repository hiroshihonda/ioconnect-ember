import Ember from 'ember';

export default Ember.Component.extend({

  proposal: undefined,
  chartId: 'barchart-cumulative-savings',

  _computeChart: function() {
    var proposal = this.get('proposal'),
      savings = proposal.get('cumulativeSavings25Years'),
      data = {
        labels: [],
        datasets: [{
          backgroundColor: "rgba(109,169,224,1)",
          borderColor: "rgba(109,169,224,1.25)",
          hoverBackgroundColor: "rgba(109,169,224,0.75)",
          hoverBorderColor: "rgba(109,169,224,1)",
          borderWidth: 2,
          data: savings
        }]
      };

    savings.forEach(function(x, i) {
      data.labels.push(i);
    });

    var chartId = this.get("chartId");
    var ctx = document.getElementById(chartId).getContext("2d");
    var chart = new Chart(ctx, {
      data: data,
      type: 'bar',
      options: {
        scaleBeginAtZero: false
      }
    });

  }.on('didInsertElement')
});
