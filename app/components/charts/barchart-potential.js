import Ember from 'ember';

export default Ember.Component.extend({

  chartId: "barchart-potential" + Math.random(),
  style: undefined,
  width: 800,
  height: 400,
  usageCalendar: Ember.Object.create(),
  billCalendar: Ember.Object.create(),

  getCalendarData: function (calendar) {
    var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      data = [];

    months.forEach(function (month) {
      data.push(parseFloat(calendar.get(month)) || 0);
    });

    return data;
  },

  didInsertElement: function () {
    this.computeChart();
  },

  onMonthChanged: function () {
    this.computeChart();
  }.observes('usageCalendar.changedMonths', 'billCalendar.changedMonths'),

  computeChart: function () {
    var usageCalendar = this.get('usageCalendar');
    var billCalendar = this.get('billCalendar');

    if (!usageCalendar || !billCalendar) {
      return;
    }

    var usageCalendarData = this.getCalendarData(usageCalendar);
    var billCalendarData = this.getCalendarData(billCalendar);

    var chartId = this.get("chartId");
    var ctx = document.getElementById(chartId).getContext("2d");

    console.log('data', usageCalendarData);

    var data = {
      labels: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      datasets: [
        //{
        //  label: "My First dataset",
        //  fillColor: "rgba(220,220,220,0.5)",
        //  strokeColor: "rgba(220,220,220,0.8)",
        //  highlightFill: "rgba(220,220,220,0.75)",
        //  highlightStroke: "rgba(220,220,220,1)",
        //  data: usageCalendarData,
        //
        //}
        {
          label: "Potential Usage",
          backgroundColor: "rgba(151,187,205,0.5)",
          borderColor: "rgba(151,187,205,0.8)",
          hoverBackgroundColor: "rgba(151,187,205,0.75)",
          hoverBorderColor: "rgba(151,187,205,1)",
          borderWidth: 2,
          data: usageCalendarData
        }
      ]
    };

    var myBarChart = new Chart(ctx, {
      data: data,
      type: 'bar'
    });
  }

});
