import DS from 'ember-data';

export default DS.Model.extend({
  companyName: DS.attr(),
  email: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  phone: DS.attr(),
  address: DS.attr(),
  password: DS.attr()
});
