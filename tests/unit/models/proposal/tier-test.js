import { moduleForModel, test } from 'ember-qunit';

moduleForModel('proposal/tier', 'Unit | Model | proposal/tier', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});