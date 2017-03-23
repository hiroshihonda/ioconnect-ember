import Ember from 'ember';
import WizardComponentMixin from '../../../mixins/wizard-component';
import { module, test } from 'qunit';

module('Unit | Mixin | wizard component');

// Replace this with your real tests.
test('it works', function(assert) {
  var WizardComponentObject = Ember.Object.extend(WizardComponentMixin);
  var subject = WizardComponentObject.create();
  assert.ok(subject);
});
