import DS from 'ember-data';
import Item from '../market-profile/item';

export default Item.extend({
  product: DS.belongsTo('proposal/product'),

  federal: DS.belongsTo('proposal/incentive'),
  state: DS.belongsTo('proposal/incentive'),
  utility: DS.belongsTo('proposal/incentive'),
  tax: DS.belongsTo('proposal/incentive'),
  rebates: DS.belongsTo('proposal/incentive')
});
