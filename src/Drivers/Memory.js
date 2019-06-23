const GE = use('@adonisjs/generic-exceptions')

/*
 * simple-adonis-cache
 *
 * (c) Ahmad Ganjtabesh <ifireir@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Memory driver to store cache values to the Memory
 *
 * @class Memory
 * @constructor
 */
 class Memory {
   /**
   * Namespaces to inject
   *
   * @attribute inject
   *
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Config']
  }

  /**
   * @method constructor
   *
   * @param {Config} Config
   */
  constructor (Config) {
    this.Config = Config.get('cache')
    this._values = new Map()
  }

  /**
   * @method remember
   *
   * @param {String} key
   * @param {Number} expire
   * @param {Mixed} value
   *
   * @return {Mixed}
   */
  async remember (key, expire, value) {
    if (!this.Config.enabled) return this._getFinalValue(value)
    if (!key) {
      throw GE
        .InvalidArgumentException
        .invoke(`${key} is not a valid key`, 500, 'E_INVALID_KEY')
    }
    if (!expire) {
      throw GE
        .InvalidArgumentException
        .invoke(`${expire} is not a valid expire`, 500, 'E_INVALID_EXPIRE')
    }
    if (!value) {
      throw GE
        .InvalidArgumentException
        .invoke(`${value} is not a valid value`, 500, 'E_INVALID_VALUE')
    }
    return this._keyExists(`${this.Config.prefix}${key}`)
      ? this._getKey(`${this.Config.prefix}${key}`)
      : this._setKey(`${this.Config.prefix}${key}`, this._getFinalValue(value), expire)
  }

  /**
   * @method forever
   *
   * @param {String} key
   * @param {Mixed} value
   *
   * @return {Mixed}
   */
  async forever (key, value) {
    if (!this.Config.enabled) return this._getFinalValue(value)
    if (!key) {
      throw GE
        .InvalidArgumentException
        .invoke(`${key} is not a valid key`, 500, 'E_INVALID_KEY')
    }
    if (!value) {
      throw GE
        .InvalidArgumentException
        .invoke(`${value} is not a valid value`, 500, 'E_INVALID_VALUE')
    }
    return this._keyExists(`${this.Config.prefix}${key}`)
      ? this._getKey(`${this.Config.prefix}${key}`)
      : this._setKey(`${this.Config.prefix}${key}`, this._getFinalValue(value))
  }

  /**
   * @method forget
   *
   * Forget a specific key
   * @param {String} key
   *
   * @return {void}
   */
  async forget (key) {
    if (!key) {
      throw GE
        .InvalidArgumentException
        .invoke(`${key} is not a valid key`, 500, 'E_INVALID_KEY')
    }
    this._deleteKey(`${this.Config.prefix}${key}`)
  }

  /**
   * Check for existence of the key
   * @method keyExists
   *
   * @param {String} key
   *
   * @return {Boolean}
   */
  _keyExists (key) {
    return this._values.has(key)
  }

  /**
   * Get value of a specific key
   * @method keyExists
   *
   * @param {String} key
   *
   * @return {Mixed}
   */
  _getKey (key) {
    return this._values.get(key)
  }

  /**
   * @method setKey
   *
   * @param {String} key
   * @param {Function} func
   * @param {Number} expire
   *
   * @return {Mixed}
   */
  _setKey (key, value, expire) {
    this._values.set(key, value)
    if (typeof expire === 'number') {
      setTimeout(() => {
        this._deleteKey(key)
      }, expire * 1000)
    }
    return value
  }

  /**
   * @method getFinalValue
   *
   * @param {Mixed} value
   *
   * @return {Mixed}
   */
  async _getFinalValue (value) {
    return typeof value === 'function'
      ? await value()
      : value
  }

  /**
   * @method deleteKey
   *
   * @param {String} key
   *
   * @return {Boolean}
   */
  _deleteKey (key) {
    return this._values.delete(key)
  }
}

module.exports = Memory
