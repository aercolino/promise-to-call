# Promise to Call

Replace callbacks with promises.

Targets to call can be methods of objects (useful "this") or functions (useless "this").




## Installation

```bash
$ npm install promise-to-call
```




## Usage

```js
var promiseTo = require('promise-to-call');

promiseTo.$callMethod(someObject, 'someMethod', 2, 3)
    .then((data) => { ... })
    .catch((err) => { ... });

promiseTo.$callFunction(someFunction, 2, 3)
    .then((data) => { ... })
    .catch((err) => { ... });
```




## Options

This module uses `Promise` by default. If you want to use some other class, do this: 

```js
promiseTo.usePromiseClass(SomePromiseClass);

promiseTo.usePromiseClass(); // back to using Promise
```




## Tests

```bash
$ npm test
```
