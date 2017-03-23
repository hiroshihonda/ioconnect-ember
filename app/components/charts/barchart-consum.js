import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function () {

    var chartId = this.get("chart-id");
    var ctx = document.getElementById(chartId).getContext("2d");

    var data = {
      labels: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [35, 99, 10, 31, 96, 35, 90, 52, 34, 23, 53, 18]
        },
        {
          label: "My Second dataset",
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,0.8)",
          highlightFill: "rgba(151,187,205,0.75)",
          highlightStroke: "rgba(151,187,205,1)",
          data: [58, 18, 34, 19, 36, 27, 50, 95, 9, 14, 22, 10]
        }
      ]
    };


    if (this.get('on-modal') != null) {
      $(this.get('on-modal')).on('shown.bs.modal', function (event) {
        var myBarChart = new Chart(ctx).Bar(data);
      });

    } else {
      var myBarChart = new Chart(ctx).Bar(data);
    }


  }


});
