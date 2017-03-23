import DS from 'ember-data';
import config from '../../config/environment';
import Ember from 'ember';
import months from '../../utils/months';
import CalendarMixin from '../../mixins/calendar';

export var values = {
  module_type: Ember.A([
    {value: 0, name: "Standard"},
    {value: 1, name: "Premium"},
    {value: 2, name: "Thin film"}
  ]),
  array_type: Ember.A([
    {value: 0, name: "Fixed - Open Rack"},
    {value: 1, name: "Fixed - Roof Mounted"},
    {value: 2, name: "1-Axis"},
    {value: 3, name: "1-Axis Backtracking"},
    {value: 4, name: "2-Axis"}
  ])
};

/**
 * Call nrel pvwatts api v5
 *
 * @param data
 * @returns {*}
 */
export var callPVWatts = function (data) {
  var requiredFields = ['system_capacity', 'module_type', 'losses', 'array_type', 'tilt', 'azimuth', 'address'];
  var requestData = {};
  var dataOk = true;
  data['format'] = 'json';
  data['api_key'] = config.PVWatts.apiKey;

  requiredFields.forEach(function (field) {
    if (Ember.isEmpty(data[field])) {
      dataOk = false;
    } else {
      requestData[field] = data[field];
    }
  });

  if (!dataOk) {
    return null;
  }

  for (var key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      requestData[key] = data[key];
    }
  }
  
  data['rand'] = new Date().getTime();

  return Ember.$.getJSON(config.PVWatts.host, data);
};


export default DS.Model.extend({

  init: function() {
    this._super();
    this.set('monthlyEnergy', Ember.Object.createWithMixins(CalendarMixin, {
      jan: null,
      feb: null,
      mar: null,
      apr: null,
      may: null,
      jun: null,
      jul: null,
      aug: null,
      sep: null,
      oct: null,
      nov: null,
      dec: null
    }));
  },

  system_capacity: DS.attr(),
  module_type: DS.attr(),
  array_type: DS.attr(),
  losses: DS.attr(),
  tilt: DS.attr(),
  azimuth: DS.attr(),
  dc_ac_ratio: DS.attr(),
  inv_eff: DS.attr(),
  gcr: DS.attr(),

  ac_monthly: DS.attr(),
  poa_monthly: DS.attr(),
  solrad_monthly: DS.attr(),
  dc_monthly: DS.attr(),
  ac_annual: DS.attr(),
  solrad_annual: DS.attr(),

  monthlyEnergy: undefined,

  _onAcMonthlyChange: function () {
    var monthly = this.get('monthlyEnergy'),
      key, ac_monthly = this.get('ac_monthly'),
      prop = {}, change = false;

    !ac_monthly.forEach || ac_monthly.forEach(function (month, index) {
      key = months.shortCodes[index];
      prop[key] = month;
      if (monthly.get(key) != month) {
        change = true;
      }
    });

    if (change) {
      monthly.setProperties(prop);
    }

  }.observes('ac_monthly').on('ready'),

  _onMonthlyEnergyChange: function () {
    var ac = [],
      monthly = this.get('monthlyEnergy'),
      sum = 0, shouldChange = false,
      currentAc = this.get('ac_monthly');

    months.shortCodes.forEach(function (month, i) {
      ac[i] = parseFloat(monthly.get(month)) || 0;
      sum += ac[i];
      if (!currentAc || currentAc[i] != monthly.get(month)) {
        shouldChange = true;
      }
    });

    if (shouldChange) {
      this.set('ac_annual', sum);
      this.set('ac_monthly', ac);
    }
  }.observes('monthlyEnergy.changedMonths').on('ready'),

  moduleTypeName: function () {
    var moduleType = parseInt(this.get('module_type'));
    var type = values.module_type.findBy('value', moduleType);

    return type ? type.name : null;
  }.property('module_type'),

  arrayTypeName: function () {
    var arrayType = parseInt(this.get('array_type'));
    var type = values.array_type.findBy('value', arrayType);

    return type ? type.name : null;
  }.property('array_type'),

  systemCapacityKw: function () {
    var w = this.get('system_capacity');

    return w * 1000;
  }.property('system_capacity')
});
