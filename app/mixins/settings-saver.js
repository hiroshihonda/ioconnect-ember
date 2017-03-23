import Ember from 'ember';

export default Ember.Mixin.create({

  settings: Ember.Object.create(),
  saveSettingsPromise: undefined,
  settingsNames: [],

  actions: {
    saveSettings: function() {
      var prop = this.get('settingsNames'),
        setting, self = this,
        store;

      prop.forEach(function(name) {
        setting = self.settings.get(name);

        setting.save().then(function(saved) {
          if (!self.get('saveSettingsPromise')) {
            self.set('saveSettingsPromise', Ember.RSVP.resolve());
          }
          if (!setting.get('id')) {
            store.deleteRecord(setting);
            self.settings.set(name, saved);
          }
        });
      });
    }
  }

});
