import Ember from 'ember';

export default Ember.Component.extend({

  proposal: undefined,
  chart: undefined,

  didInsertElement: function() {
    this._computeChart();
  },

  _computeChart: function () {
    var data = {
      labels: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      datasets: []
    },
      calendar = this.get('proposal.calendar'),
      currentData = [],
      currentColor,
      currentValue;

    this.get('proposal.items')
      .filterBy('selected', true)
      .forEach(function(item) {
        currentData = [];
        currentColor = item.get('rgbColor').join(', ');
        calendar.forEach(function(month) {
          currentValue = item.get('savingsCalculation.monthlyKwhSavings.' + month);
          currentData.push(currentValue);
        });

        data.datasets.push({
          data: currentData,
          backgroundColor: "rgba(" + currentColor +", 0.5)",
          borderColor: "rgba(" + currentColor + ", 0.8)",
          hoverBackgroundColor: "rgba(" + currentColor + ", 0.75)",
          hoverBorderColor: "rgba(" + currentColor + ", 1)",
          borderWidth: 2,
          label: item.get('marketItem.product.name')
        })
    });

    var chartId = this.get("chart-id");
    var ctx = document.getElementById(chartId).getContext("2d");
    var chart = new Chart(ctx, {
      data: data,
      type: 'bar'
    });

    this.set('chart', chart);
  }
});
