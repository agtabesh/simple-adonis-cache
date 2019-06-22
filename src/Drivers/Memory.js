const GE = use('@adonisjs/generic-exceptions')

/*
 * simple-adonis-cache
 *
 * (c) Ahmad Ganjtabesh <ifireir@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const values = new Map()

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
    this.config = Config.get('cache')
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
    if (!this.config.enabled) return getFinalValue(value)
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
    return keyExists(`${this.config.prefix}${key}`)
      ? getKey(`${this.config.prefix}${key}`)
      : setKey(`${this.config.prefix}${key}`, getFinalValue(value), expire)
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
    if (!this.config.enabled) return getFinalValue(value)
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
    return keyExists(`${this.config.prefix}${key}`)
      ? getKey(`${this.config.prefix}${key}`)
      : setKey(`${this.config.prefix}${key}`, getFinalValue(value))
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
    deleteKey(`${this.config.prefix}${key}`)
  }
}

/**
 * Check for existence of the key
 * @param {String} key
 */
const keyExists = key => values.has(key)

/**
 * Get value of a specific key
 * @param {String} key
 */
const getKey = key => values.get(key)

/**
 * @method setKey
 *
 * @param {String} key
 * @param {Function} func
 * @param {Number} expire
 *
 * @return {Mixed}
 */
const setKey = async (key, value, expire) => {
  values.set(key, value)
  if (typeof expire === 'number') {
    setTimeout(() => {
      deleteKey(key)
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
const getFinalValue = async value => {
  return typeof value === 'function'
    ? await value()
    : value
}

/**
 *
 * @param {String} key
 */
const deleteKey = key => values.delete(key)

module.exports = Memory
