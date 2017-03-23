import Ember from 'ember';
import colors, {rgba, chartJSColorStack} from '../../utils/colors';

export default Ember.Component.extend({

  proposal: undefined,
  chartId: "barchart-savings",
  chartData: [],

  _computeChart: function () {
    var proposal = this.get('proposal'),
      data = {
        labels: [
          "Current Bill",
          "After project"
        ],
        datasets: [{
          // Current bill
          backgroundColor: "rgba(109,169,224,1)",
          borderColor: "rgba(109,169,224,1.25)",
          hoverBackgroundColor: "rgba(109,169,224,0.75)",
          hoverBorderColor: "rgba(109,169,224,1)",
          data: [
            Math.ceil(proposal.get('potential.utilityUsage.avgElectricityBill')), 0
          ],
          label: "Current Bill"
        },

          //Savings
          Ember.Object.createWithMixins(
            chartJSColorStack(colors.charts.green),
            {
              data: [
                0, Math.ceil(proposal.get('monthlySavings'))
              ],
              label: "Savings"
            }
          ),

          // Finance payment
          Ember.Object.createWithMixins(
            chartJSColorStack(colors.charts.blue),
            {
              data: [
                0, Math.ceil(proposal.get('netMonthlyRate'))
              ],
              label: "Finance payment"
            }
          ),

          // New electric bill
          Ember.Object.createWithMixins(
            chartJSColorStack(colors.charts.orange),
            {
              data: [
                0, Math.ceil(proposal.get('monthlyBillAfterEfficiency'))
              ],
              label: "New electric bill"
            }
          )
        ]
      };

    var chartId = this.get("chartId");
    var ctx = document.getElementById(chartId).getContext("2d");

    this.set('chartData', data);

    var chart = new Chart(ctx, {
      data: data,
      type: 'bar',
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]

        }
      }
    });
  }.on('didInsertElement')

});
