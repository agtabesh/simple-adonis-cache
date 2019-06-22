'use strict'

/**
 * simple-adonis-cache
 *
 * (c) Ahmad Ganjtabesh <ifireir@gmail.com>
 *
 */

const { ServiceProvider } = use('@adonisjs/fold')
const CacheManager = require('../src/CacheManager')

class CacheProvider extends ServiceProvider {
  /**
   * Registers manager under `Adonis/Src/Cache`
   * namespace
   *
   * @method _registerManager
   *
   * @return {void}
   *
   * @private
   */
  _registerManager () {
    this.app.manager('Adonis/Src/Cache', require('../src/CacheManager'))
  }

  /**
   * Registers provider under `Adonis/Src/Cache`
   * namespace.
   *
   * @method _registerProvider
   *
   * @return {void}
   *
   * @private
   */
  _registerProvider () {
    this.app.singleton('Adonis/Addons/Cache', (app) => {
      const Config = app.use('Adonis/Src/Config')
      return CacheManager.makeDriverInstance(Config.get('cache.driver'))
    })
    this.app.alias('Adonis/Addons/Cache', 'Cache')
  }

  /**
   * Register method called by ioc container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerManager()
    this._registerProvider()
  }
}

module.exports = CacheProvider
