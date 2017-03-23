import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function(){

    var chartId = this.get("chart-id");
    var ctx = document.getElementById(chartId).getContext("2d");


    var options = {
      //Boolean - Show a backdrop to the scale label
      scaleShowLabelBackdrop : true,

      //String - The colour of the label backdrop
      scaleBackdropColor : "rgba(255,255,255,0.75)",

      // Boolean - Whether the scale should begin at zero
      scaleBeginAtZero : true,

      //Number - The backdrop padding above & below the label in pixels
      scaleBackdropPaddingY : 2,

      //Number - The backdrop padding to the side of the label in pixels
      scaleBackdropPaddingX : 2,

      //Boolean - Show line for each value in the scale
      scaleShowLine : true,

      //Boolean - Stroke a line around each segment in the chart
      segmentShowStroke : true,

      //String - The colour of the stroke on each segement.
      segmentStrokeColor : "#fff",

      //Number - The width of the stroke value in pixels
      segmentStrokeWidth : 2,

      //Number - Amount of animation steps
      animationSteps : 100,

      //String - Animation easing effect.
      animationEasing : "easeOutBounce",

      //Boolean - Whether to animate the rotation of the chart
      animateRotate : true,

      //Boolean - Whether to animate scaling the chart from the centre
      animateScale : false,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    }

    var proposal = this.get('proposal');

    /*
    console.log('this is it');
    console.log(proposal);

    console.log('poolPumpSaving');
    console.log(proposal.get('poolPumpSaving'));

    console.log('aerosol');
    console.log(proposal.get('aerosolSavingTotal'));

    console.log('usageAfter');
    console.log(proposal.get('usageAfterEnergyAndSolarTotal'));
    */
    var data = [
      {
        value: proposal.get('poolPumpSaving'),
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
      },
      {
        value: proposal.get('aerosolSavingTotal'),
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
      },
      {
        value: proposal.get('usageAfterEnergyAndSolarTotal'),
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
      },
    ];


    if (this.get('on-modal') != null) {
      $(this.get('on-modal')).on('shown.bs.modal', function (event) {
        var myPieChart = new Chart(ctx).Pie(data, options);
      });

    } else {
      var myPieChart = new Chart(ctx).Pie(data, options);
    }

  }
});
