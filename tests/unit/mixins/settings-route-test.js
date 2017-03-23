import Ember from 'ember';
import SettingsRouteMixin from '../../../mixins/settings-route';
import { module, test } from 'qunit';

module('Unit | Mixin | settings route');

// Replace this with your real tests.
test('it works', function(assert) {
  var SettingsRouteObject = Ember.Object.extend(SettingsRouteMixin);
  var subject = SettingsRouteObject.create();
  assert.ok(subject);
});
