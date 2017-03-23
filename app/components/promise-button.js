import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'button',
  classNames: ['btn'],
  classNameBindings: ['buttonTypeClass', 'customClass'],

  promise: undefined,
  buttonType: "success",
  customClass: undefined,
  success: false,
  error: false,

  buttonTypeClass: function() {
    return 'btn-' + this.get('buttonType');
  }.property('buttonType'),

  /**
   * Regiters callback for the promise
   *
   * @returns false
   */
  onPromiseChange: function () {
    var promise = this.get('promise'),
      that = this;

    if (!promise) {
      return false;
    }

    promise.then(function (data) {
      that._handleSuccess(data);
    }, function (xhr) {
      that._handleError(xhr);
    });

  }.observes('promise').on('init'),

  /**
   * Handle promise success
   *
   * @param data
   * @private
   */
  _handleSuccess: function (data) {
    this._toggleState(true);
    this._toDefaultState(5000);
  },

  /**
   * Handle promise error
   *
   * @param xhr
   * @private
   */
  _handleError: function (xhr) {
    this._toggleState(false);
  },

  /**
   * Set the appropriate error and success states
   *
   * @param state
   * @private
   */
  _toggleState: function (state) {
    if (state) {
      this.set('error', false);
      this.set('success', true);
    } else {
      this.set('error', true);
      this.set('success', false);
    }
  },

  /**
   * Restores default error / success state
   *
   * @private
   */
  _toDefaultState: function (timeout) {
    timeout = timeout || 0;

    if (timeout > 0) {
      setTimeout(function () {
        this.set('error', false);
        this.set('success', false);
      }.bind(this), timeout);
    } else {
      this.set('error', false);
      this.set('success', false);
    }
  },

  _handleClick: function () {
    this._toDefaultState();
  },

  click: function () {
    var actionParam = this.get('actionParam') || null;
    this._handleClick();
    this.sendAction('action', actionParam);
  }
});
