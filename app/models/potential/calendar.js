import Ember from 'ember';
import DS from 'ember-data';
import CalendarMixin from '../../mixins/calendar';

export default DS.Model.extend(Ember.Evented, CalendarMixin, {
  jan: DS.attr(),
  feb: DS.attr(),
  mar: DS.attr(),
  apr: DS.attr(),
  may: DS.attr(),
  jun: DS.attr(),
  jul: DS.attr(),
  aug: DS.attr(),
  sep: DS.attr(),
  oct: DS.attr(),
  nov: DS.attr(),
  dec: DS.attr()
});
