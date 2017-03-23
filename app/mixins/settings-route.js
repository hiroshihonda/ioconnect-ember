import Ember from 'ember';

export default Ember.Mixin.create({

  settingsNames: [],
  setOptions: {},

  model: function () {
    var store = this.store;

    return Ember.RSVP.hash({
      settings: store.findAll('setting'),
      setOptions: store.findAll('setoption')
    })
  },

  setupController: function (controller, model) {
    if (model.settings) {
      this._setupControllerSettings(controller, model.settings);
    }

    if (model.setOptions) {
      this._setupControllerSetOptions(controller, model.setOptions);
    }
  },

  /**
   * Inject setoptions into controller
   *
   * @param controller
   * @param model
   * @private
   */
  _setupControllerSetOptions: function (controller, model) {
    var setOptions = this.get('setOptions'),
      setOptionsObject = Ember.Object.create();

    if (!controller.get('setOptions')) {
      controller.set('setOptions', setOptionsObject);
    }

    for (var key in setOptions) {
      var opt = model.findBy('name', setOptions[key]);

      if (!opt) {
        opt = this.store.createRecord('setoption', {
          name: setOptions[key]
        });

        opt.get('items').addObject(this.store.createRecord('setoption-item'));
      }

      controller.set('setOptions.' + key, opt)
    }
  },

  /**
   * Inject the settings into the controller
   *
   * @param controller
   * @param model
   * @private
   */
  _setupControllerSettings: function (controller, model) {
    var settingsNames = this.get('settingsNames'),
      settings = Ember.Object.create(),
      store = this.store;

    if (!controller.get('settingsNames') || !controller.get('settingsNames').length) {

      controller.set('settingsNames', settingsNames);

      settingsNames.forEach(function (name) {
        settings.set(name, undefined);
      });

      controller.set('settings', settings);
    }

    settingsNames.forEach(function (name) {
      controller.set('settings.' + name, model.findBy('name', name) || store.createRecord('setting', {
          name: name
        }));
    });

    this.onSettingsApplied.call(this, controller, model);
  },

  onSettingsApplied: function () {
  }
});
