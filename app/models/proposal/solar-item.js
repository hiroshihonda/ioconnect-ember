import DS from 'ember-data';
import Item from './item'

export default Item.extend({
  parentProposal: DS.belongsTo('proposal', {
    inverse: 'solarItem',
    async: true
  })
});
