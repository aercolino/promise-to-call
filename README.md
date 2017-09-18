# Promise to Call

Replace callbacks with promises.

Targets to call can be methods of objects (useful "this") or functions (useless "this").

[!https://travis-ci.org/aercolino/promise-to-call.svg?branch=master]

[![Coverage Status](https://coveralls.io/repos/github/aercolino/promise-to-call/badge.svg?branch=master)](https://coveralls.io/github/aercolino/promise-to-call?branch=master)


## Installation

```bash
$ npm install promise-to-call
```




## Usage

```js
const promiseTo = require('promise-to-call');

promiseTo.$callMethod(someObject, 'someMethod', 2, 3)
    .then((data) => { ... })
    .catch((err) => { ... });

promiseTo.$callFunction(someFunction, 2, 3)
    .then((data) => { ... })
    .catch((err) => { ... });
```



### Example

```js
const AWS = require('aws-sdk');
const promiseTo = require('promise-to-call');

function whoAmI() {
    const stsService = new AWS.STS({ region: 'us-east-1' });
    return promiseTo.$callMethod(stsService, 'getCallerIdentity', {})
        .then((data) => {
            return data.Account;
        })
        .catch(console.error);
}

whoAmI().then(console.log); // -> 123456789012
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
