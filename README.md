[![NPM version](https://img.shields.io/npm/v/native-type-of.svg)](https://www.npmjs.com/package/native-type-of)
[![Build Status](https://img.shields.io/github/workflow/status/overlookmotel/native-type-of/Test.svg)](https://github.com/overlookmotel/native-type-of/actions)
[![Dependency Status](https://img.shields.io/david/overlookmotel/native-type-of.svg)](https://david-dm.org/overlookmotel/native-type-of)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/native-type-of.svg)](https://david-dm.org/overlookmotel/native-type-of)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/native-type-of/master.svg)](https://coveralls.io/r/overlookmotel/native-type-of)

# Accurately determine native type of values

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

// Boxed primitives
typeOf(new String('')) === 'String';
typeOf(new Number(123)) === 'Number';
typeOf(new Boolean(true)) === 'Boolean';

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

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v12+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

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
