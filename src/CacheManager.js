'use strict'

/*
 * simple-adonis-cache
 *
 * (c) Ahmad Ganjtabesh <ifireir@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ioc } = use('@adonisjs/fold')
const GE = use('@adonisjs/generic-exceptions')
const drivers = require('./Drivers')

/**
 * The session manager class is exposed as IoC container
 * binding, which can be used to add new driver and
 * get an instance of a given driver.
 *
 * @namespace Adonis/Src/Cache
 * @manager Adonis/Src/Cache
 * @singleton
 *
 * @class CacheManager
 */
class CacheManager {
  constructor () {
    this._drivers = {}
  }

  /**
   * Method called by ioc when someone extends the session
   * provider to add their own driver
   *
   * @method extend
   *
   * @param  {String} key
   * @param  {Class} implementation
   *
   * @return {void}
   */
  extend (key, implementation) {
    this._drivers[key] = implementation
  }

  /**
   * Makes the instance of driver
   *
   * @method makeDriverInstance
   *
   * @param  {String} name
   *
   * @return {Object}
   */
  makeDriverInstance (name) {
    const driver = drivers[name] || this._drivers[name]
    if (!driver) {
      console.log(drivers)
      throw GE
        .InvalidArgumentException
        .invoke(`${name} is not a valid cache provider`, 500, 'E_INVALID_CACHE_DRIVER')
    }
    return ioc.make(driver)
  }
}

module.exports = new CacheManager()
