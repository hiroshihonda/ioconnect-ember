import DS from 'ember-data';
import config from '../config/environment'

export default DS.RESTAdapter.extend({
  namespace: 'api/1.0',
  host: config.apiHost

  /*serializer: DS.RESTSerializer.extend({
    primaryKey: function(type) {
      return 'id';
    }
  })
  */
});
