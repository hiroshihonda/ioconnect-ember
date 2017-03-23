import Ember from 'ember';
import months from '../../utils/months';

export default Ember.Component.extend({

  pvwatts: undefined,
  "chart-id": "barchart-pvwatts-monthly",

  didInsertElement: function() {
    this._setupChart();
  },

  _setupChart: function () {
    var monthlyData = this.get('pvwatts.ac_monthly') || [],
      data = {
        labels: months.names,
        datasets: [{
          backgroundColor: "rgba(109,169,224,1)",
          borderColor: "rgba(109,169,224,1.25)",
          hoverBackgroundColor: "rgba(109,169,224,0.75)",
          hoverBorderColor: "rgba(109,169,224,1)",
          borderWidth: 2,
          data: monthlyData
        }]
      };

    var chartId = this.get("chart-id");
    var ctx = document.getElementById(chartId).getContext("2d");

    var chart = new Chart(ctx, {
      data: data,
      type: 'bar'
    });
  }


});
