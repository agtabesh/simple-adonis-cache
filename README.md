# Simple Adonis Cache
[![npm (scoped)](https://img.shields.io/badge/npm-v0.4.0-blue.svg)](https://www.npmjs.com/package/simple-adonis-cache)

A simple cache mechanism for AdonisJs.

- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
    - [remember](#remember)
    - [forever](#forever)
    - [forget](#forget)
- [To Do](#to-do)
- [Release History](#release-history)
- [Contributing](#contributing)
- [License](#license)

## Installation
<a name="installation"></a>

```js
adonis install simple-adonis-cache
```

After installation, you need to register the providers inside `start/app.js` file.

```javascript
// start/app.js
const providers = [
  ...,
  'adonis-cache/providers/CacheProvider'
]
```


## Configuration
<a name="configuration"></a>

The cache configuration is located at `config/cache.js`.
```javascript
// config/cache.js
module.exports = {
  // Indicates cache must be enabled or not
  enabled: true,

  // Indicates where objects should reside on
  driver: 'memory',

  // Indicates prefix for keys
  prefix: 'cache:'
}
```

## API Reference
<a name="api-reference"></a>

Cache.<b>remember</b>(<i>key</i>, <i>expire</i>, <i>value</i>)
<a name="remember"></a>

This function store `value` in `key` for `expire` seconds and return `value`.

- `key`: must be `String` indicating the `key`
- `expire`: must be `Number` indicating expiration time
- `value`: can be anything such as `Function`, `String`, `Number`, etc.

Example code:
```javascript
const Cache = use('Cache')
const User = use('App/Models/User')
class UserController {
  async index(request, response) {
    // retrieve users from database and cache them for 60 seconds.
    const users = await Cache.rememebr('users', 60, () => {
      return User.all()
    })

    // retrieve tags and cache them for 1 hour.
    const tags = await Cache.rememebr('users', 60 * 60, () => {
      return ['goods', 'services']
    })

    // retrieve url and cache it for 1 day.
    const url = await Cache.rememebr('users', 24 * 60 * 60, () => {
      return 'http://api.example.com'
    })
  }
}
```

Cache.<b>forever</b>(<i>key</i>,  <i>value</i>)
<a name="forever"></a>

This function store `value` in `key` forever and return `value`.

- `key`: must be `String` indicating the `key`
- `value`: can be anything such as `Function`, `String`, `Number`, etc.

Example code:
```javascript
const Cache = use('Cache')
const User = use('App/Models/User')
class UserController {
  async index(request, response) {
    // retrieve users from database and cache them forever.
    const users = await Cache.forever('users', () => {
      return User.all()
    })

    // retrieve tags and cache them forever.
    const tags = await Cache.forever('users', () => {
      return ['goods', 'services']
    })

    // retrieve url and cache it forever.
    const url = await Cache.forever('users', () => {
      return 'http://api.example.com'
    })
  }
}
```

Cache.<b>forget</b>(<i>key</i>)
<a name="forget"></a>

This function remove specified `key`.

- `key`: must be `String` indicating the `key`

Example code:
```javascript
const Cache = use('Cache')
const User = use('App/Models/User')
class UserController {
  async index(request, response) {
    // forget a specific key
    await Cache.forget('users')
  }
}
```

## To Do
<a name="to-do"></a>

- [x] Add basic functionality
- [x] Add memory driver
- [x] Add redis driver
- [ ] Add a method to flush all cached values
- [ ] Add a command to flush all cached values
- [ ] Support for different environments

## Release History
<a name="release-history"></a>

- 0.1.0 - First draft.
- 0.3.0 - Initial release and basic functionality and supports for memory storage.
- 0.4.0 - Add support for Redis driver

## Contributing
<a name="contributing"></a>

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
<a name="license"></a>

[MIT](https://choosealicense.com/licenses/mit/)
