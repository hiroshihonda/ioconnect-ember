import Ember from 'ember';
import CalendarMixin from '../../../mixins/calendar';
import { module, test } from 'qunit';

module('Unit | Mixin | calendar');

// Replace this with your real tests.
test('it works', function(assert) {
  var CalendarObject = Ember.Object.extend(CalendarMixin);
  var subject = CalendarObject.create();
  assert.ok(subject);
});
