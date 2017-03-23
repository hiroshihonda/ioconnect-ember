import DS from 'ember-data';

export var types = {
  PERCENT: "PERCENT",
  AMOUNT: "AMOUNT",
  PPW: "PPW"
};

export var typeValues = [
  {name: types.PERCENT, value: '%'},
  {name: types.AMOUNT, value: '$'},
  {name: types.PPW, value: '$ / W'}
];

export default DS.Model.extend({
  type: DS.attr(),
  value: DS.attr(),
  cap: DS.attr(),

  typeValue: function() {
    var type = this.get('type'),
      val = typeValues.findBy('name', type);

    return val ? val['value'] : '';

  }.property('type')
});
