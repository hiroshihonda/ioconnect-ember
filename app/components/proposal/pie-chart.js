import Ember from 'ember';
import colors, {rgba, hex} from '../../utils/colors';

export default Ember.Component.extend({

  proposal: undefined,
  chartId: undefined,
  mainLabelSize: undefined,
  percentageSize: undefined,
  canvasWidth: undefined,
  canvasHeight: undefined,
  pieCenterX: undefined,
  pieCenterY: undefined,

  chartHolder: function() {
    return "chart-" + Math.random();
  }.property('chartId'),

  _computeChart: function() {
    var canvasWidth = this.get('canvasWidth'),
      canvasHeight = this.get('canvasHeight'),
      pieCenterY = this.get('pieCenterY'),
      pieCenterX = this.get('pieCenterX'),
      mainLabelSize = this.get('mainLabelSize') || 11,
      percentageSize = this.get('percentageSize') || 11;

    var chart = {
      "header": {
        "title": {
          "fontSize": 24,
          "font": "open sans"
        },
        "subtitle": {
          "color": "#ffffff",
          "fontSize": 12,
          "font": "open sans"
        },
        "titleSubtitlePadding": 9
      },
      "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
      },
      "size": {
        "canvasHeight": canvasHeight || 300,
        "canvasWidth": canvasHeight || 300,
      },
      "data": {
        "sortOrder": "value-desc",
        "content": []
      },
      "labels": {
        "outer": {
          "format": "none",
          "pieDistance": 10,
          hideWhenLessThanPercentage: true
        },
        "inner": {
          "format": "label-percentage2",
          "hideWhenLessThanPercentage": 3
        },
        "mainLabel": {
          "fontSize": mainLabelSize,
          color: "#ffffff"
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0,
          "fontSize": percentageSize
        },
        "value": {
          "color": "#ffffff",
          "fontSize": percentageSize
        },
        "lines": {
          "enabled": true
        }
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "speed": 400,
          "size": 8
        },
        highlightSegmentOnMouseover: true,
        highlightLuminosity: -0.3
      },
      "misc": {
        "gradient": {
          "enabled": true,
          "percentage": 100
        },
        pieCenterOffset: {
          x: pieCenterX || 0,
          y: pieCenterY || -50
        }
      }
    };
    var usageAfter = this.get('proposal.annualUsageAfterEfficiency');
    var solarProduction = this.get('proposal.ac_annual');
    var pie = this.get('pie'), die = false;

    this.get('proposal.selectedItems').forEach(function (item) {
      chart.data.content.push({
        value: item.get('savingsCalculation.annualKwhSavings') || 1,
        label: item.get('marketItem.product.name'),
        color: hex(item.get('rgbColor'))
      })
    });

    chart.data.content.push({
      value: solarProduction || 1,
      label: "Solar Production",
      color: hex(colors.charts.green)
    });

    chart.data.content.push({
      "label": "Usage After Efficiency",
      "value": usageAfter || 1,
      "color": hex(colors.charts.orange)
    });

    !pie || pie.destroy();

    this.set('pie', new d3pie(this.get('chartHolder'), chart))
  }.observes(
    'proposal.annualUsageAfterEfficiency',
    'proposal.ac_annual')
  .on('didInsertElement')

});
