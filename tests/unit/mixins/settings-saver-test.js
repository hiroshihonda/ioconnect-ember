import Ember from 'ember';
import SettingsSaverMixin from '../../../mixins/settings-saver';
import { module, test } from 'qunit';

module('Unit | Mixin | settings saver');

// Replace this with your real tests.
test('it works', function(assert) {
  var SettingsSaverObject = Ember.Object.extend(SettingsSaverMixin);
  var subject = SettingsSaverObject.create();
  assert.ok(subject);
});
