const Env = use('Env')
const Redis = use('Redis')
const Logger = use('Logger')

/**
 * simple-adonis-cache
 *
 * (c) Ahmad Ganjtabesh <ifireir@gmail.com>
 *
 */

 class Cache {
  constructor (Config) {
    this.config = Config.get('cache')
  }
 }

/**
 * check whether cache is enabled ot not
 */
const isCacheEnabled = () => Env.get('CACHE_QUERIES') === 'true'

/**
 * Check for existence of the key
 * @param {String} key
 */
const isKeyExists = key => Redis.exists(key)

/**
 * Get value of the key
 * @param {String} key
 */
const getKey = async key => JSON.parse(await Redis.get(key))

/**
 *
 * @param {String} key
 * @param {Function} func
 * @param {Number} expire
 */
const setKey = async (key, value, expire) => {
  const finalValue = typeof value === 'function' ? await value() : value
  const stringified = JSON.stringify(finalValue)
  if (typeof expire === 'undefined') {
    Redis.set(key, stringified)
  } else {
    Redis.setex(key, expire, stringified)
  }
  return finalValue
}

/**
 *
 * @param {String} key
 */
const delKey = async key => Redis.del(key)

/**
 *
 * @param {String} key
 * @param {Number} expire
 * @param {Any} value
 */
const remember = async (key, expire, value) => {
  if (!await isCacheEnabled()) return value()
  if (!key || !expire || !value) return false
  try {
    if (await isKeyExists(key)) return getKey(key)
    return setKey(key, value, expire)
  } catch (e) {
    Logger.warning('Redis server is down')
    return value()
  }
}

/**
 *
 * @param {String} key
 * @param {Any} value
 */
const forever = async (key, value) => {
  if (!await isCacheEnabled()) return value()
  if (!key || !value) return false
  try {
    if (await isKeyExists(key)) return getKey(key)
    return setKey(key, value)
  } catch (e) {
    Logger.warning('Redis server is down')
    return value()
  }
}

/**
 * Forget a specific key
 * @param {String} key
 */
const forget = async key => {
  if (!key) return true
  try {
    return delKey(key)
  } catch (e) {
    Logger.warning('Redis server is down')
    return false
  }
}

module.exports = { remember, forever, forget }
