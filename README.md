[![NPM version](https://img.shields.io/npm/v/native-type-of.svg)](https://www.npmjs.com/package/native-type-of)
[![Build Status](https://img.shields.io/github/actions/workflow/status/overlookmotel/native-type-of/test.yml?branch=master)](https://github.com/overlookmotel/native-type-of/actions)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/native-type-of/master.svg)](https://coveralls.io/r/overlookmotel/native-type-of)

# Accurately determine native type of values

## Installation

```sh
npm install native-type-of
```

Requires NodeJS v18 or later.

## Usage

### Standard values

```js
const typeOf = require('native-type-of');

// Primitives
typeOf('abc') === 'string';
typeOf(123) === 'number';
typeOf(true) === 'boolean';
typeOf(Symbol()) === 'symbol';
typeOf(100n) === 'bigint';
typeOf(null) === 'null';
typeOf(undefined) === 'undefined';

// Functions
typeOf(function() {}) === 'Function';
typeOf(() => {}) === 'Function';
typeOf(async function() {}) === 'Function';
typeOf(function*() {}) === 'Function';
typeOf(async function*() {}) === 'Function';

// Objects
typeOf({}) === 'Object';
class C {}
typeOf(new C()) === 'Object';

// Built-ins
typeOf([]) === 'Array';
typeOf(/^abc$/) === 'RegExp';
typeOf(new Date()) === 'Date';
typeOf(Promise.resolve()) === 'Promise';
typeOf(new Set()) === 'Set';
typeOf(new Map()) === 'Map';
typeOf(new WeakSet()) === 'WeakSet';
typeOf(new WeakMap()) === 'WeakMap';
typeOf(new WeakRef({})) === 'WeakRef';
typeOf(new FinalizationRegistry(() => {})) === 'FinalizationRegistry';
typeOf(new MessageChannel().port1) === 'MessagePort';

// Boxed primitives
typeOf(new String('')) === 'String';
typeOf(new Number(123)) === 'Number';
typeOf(new Boolean(true)) === 'Boolean';
typeOf(Object(BigInt(100)) === 'BigInt';
typeOf(Object(Symbol()) === 'Symbol';

// Errors
typeOf(new Error()) === 'Error';
typeOf(new TypeError()) === 'TypeError';
typeOf(new ReferenceError()) === 'ReferenceError';
// ...etc

// Buffers
typeOf(new ArrayBuffer(8)) === 'ArrayBuffer';
typeOf(new SharedArrayBuffer(8)) === 'SharedArrayBuffer';
typeOf(new Uint8Array([1, 2, 3])) === 'Uint8Array';
typeOf(new Int32Array([1, 2, 3])) === 'Int32Array';
// ...etc
```

### Values with altered prototype

If the prototype chain is altered, this package aims to return the *native* type of the underlying object.

This is where this package differs from others like [kind-of](https://www.npmjs.com/package/kind-of).

```js
const map = new Map();
Object.setPrototypeOf(map, Array.prototype);
typeOf(map) === 'Map';
```

It also ignores custom `[Symbol.toStringTag]` properties.

```js
const obj = { [Symbol.toStringTag]: 'Gizmo' };
typeOf(obj) === 'Object';
```

### Known issues

There are a few rare cases where native type cannot be correctly determined:

* `typeOf( Object.setPrototypeOf( Promise.resolve(), Array.prototype ) ) === 'Object'` ([issue](https://github.com/overlookmotel/native-type-of/issues/1))
* `typeOf( Object.setPrototypeOf( new Error(), Map.prototype ) ) === 'Object'` ([issue](https://github.com/overlookmotel/native-type-of/issues/2))
* `typeOf( Object.setPrototypeOf( {}, TypeError.prototype ) ) === 'TypeError'` ([issue](https://github.com/overlookmotel/native-type-of/issues/3))

These are the only known cases where the result is inaccurate.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/native-type-of/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/native-type-of/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
