import { moduleForModel, test } from 'ember-qunit';

moduleForModel('product/percent', 'Unit | Model | product/percent', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
