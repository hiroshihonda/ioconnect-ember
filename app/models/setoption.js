import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  items: DS.hasMany('setoption-item')
});
