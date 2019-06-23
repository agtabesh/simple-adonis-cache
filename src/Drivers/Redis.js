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
 * Redis driver to store cache values to the Redis
 *
 * @class Redis
 * @constructor
 */
 class Redis {
   /**
   * Namespaces to inject
   *
   * @attribute inject
   *
   * @return {Array}
   */
  static get inject () {
    return [
      'Adonis/Src/Config',
      'Redis'
    ]
  }

  /**
   * @method constructor
   *
   * @param {Config} Config
   * @param {Redis} Redis
   */
  constructor (Config, Redis) {
    this.Config = Config.get('cache')
    this.Redis = Redis
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
    return await this._keyExists(`${this.Config.prefix}${key}`)
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
    return await this._keyExists(`${this.Config.prefix}${key}`)
      ? this._getKey(`${this.Config.prefix}${key}`)
      : this._setKey(`${this.Config.prefix}${key}`, await this._getFinalValue(value))
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
  async _keyExists (key) {
    return this.Redis.exists(key)
  }

  /**
   * Get value of a specific key
   * @method keyExists
   *
   * @param {String} key
   *
   * @return {Mixed}
   */
  async _getKey (key) {
    return JSON.parse(await this.Redis.get(key))
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
  async _setKey (key, value, expire) {
    const stringified = JSON.stringify(value)
    if (typeof expire === 'undefined') {
      this.Redis.set(key, stringified)
    } else {
      this.Redis.setex(key, expire, stringified)
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
  async _deleteKey (key) {
    return this.Redis.del(key)
  }
}

module.exports = Redis
