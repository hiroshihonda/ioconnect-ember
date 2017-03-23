import Ember from 'ember';
import months from '../../utils/months';
import colors, {chartJSColorStack} from '../../utils/colors';
import config from '../../config/environment';

export default Ember.Component.extend({

  proposal: undefined,
  chartId: "barchart-all-savings",
  chartData: [],

  _computeChart: function () {
    var proposal = this.get('proposal');

    var data = {
        labels: months.shortCodes,
        datasets: []
      },
      d1, d2, d3, val;

    // usage after
    d1 = Ember.Object.createWithMixins({
      label: "Usage After Efficiency and Solar",
      data: []
    }, chartJSColorStack(colors.charts.orange));

    // solar production
    d3 = {
      label: "Solar Production",
      backgroundColor: "rgba(61,0,245,1)",
      borderColor: "rgba(61,0,245,1.25)",
      hoverBackgroundColor: "rgba(61,0,245,0.75)",
      hoverStrokeColor: "rgba(61,0,245,1)",
      data: []
    };

    // eff savings
    d2 = {
      label: "Efficiency Savings",
      backgroundColor: "rgba(46,184,0,1)",
      borderColor: "rgba(46,184,0,1.25)",
      hoverBackgroundColor: "rgba(46,184,0,0.75)",
      hoverStrokeColor: "rgba(46,184,0,1)",
      data: []
    };

    months.shortCodes.forEach(function(code) {
      val = proposal.get('monthlyUsageAfterEfficiency.' + code);
      d1.data.push(val < 0 ? 0 : val);
      d2.data.push(proposal.get('monthlyItemsKwhSavings.' + code));
      d3.data.push(proposal.get('pvwatts.monthlyEnergy.' + code));
    });

    data.datasets.push(d1);
    data.datasets.push(d2);
    data.datasets.push(d3);

    var chartId = this.get("chartId");
    var ctx = document.getElementById(chartId).getContext("2d");

    this.set('chartData', data);

    var chart = new Chart(ctx, {
      data: data,
      type: 'bar',
      options: {
        responsive: true
      }
    });


  }.observes('proposal.monthlyUsageAfterEfficiency',
    'proposal.monthlyItemsKwhSavings'
  ).
    on('didInsertElement')
});
