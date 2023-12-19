/* --------------------
 * native-type-of module
 * Tests
 * ------------------*/

'use strict';

// Modules
const typeOf = require('native-type-of');

// Tests

const hasOwnProp = Object.prototype.hasOwnProperty,
	functionToString = Function.prototype.toString;

const globals = [];
for (const name of Object.getOwnPropertyNames(global)) {
	if (!/^[A-Z]/.test(name)) continue;
	const ctor = global[name];
	if (typeof ctor !== 'function') continue;
	if (!hasOwnProp.call(ctor, 'prototype')) continue;
	if (!functionToString.call(ctor).includes('[native code]')) continue;
	globals.push([name, ctor]);
}

globals.sort(([name1], [name2]) => (name1 > name2 ? 1 : -1));

// Detecting `MessageChannel`s is not supported
// https://github.com/overlookmotel/native-type-of/issues/59
const testGlobals = globals.filter(([name]) => name !== 'MessageChannel');

const initArgs = {
	Promise: [() => {}],
	DataView: [new ArrayBuffer(8)],
	FinalizationRegistry: [() => {}],
	WeakRef: [{}],
	AggregateError: [[]]
};

function createInstance(type) {
	if (type === 'Function') return function() {};
	if (type === 'BigInt') return Object(BigInt(100));
	if (type === 'Symbol') return Object(Symbol('x'));
	if (type === 'MessagePort') return new MessageChannel().port1;
	const ctor = global[type];
	return new ctor(...(initArgs[type] || [])); // eslint-disable-line new-cap
}

describe('Primitives', () => {
	it.each([
		['null', null],
		['undefined', undefined],
		['string', 'abc'],
		['boolean', true],
		['number', 123],
		['symbol', Symbol('abc')],
		['bigint', BigInt(100)]
	])('%s', (type, val) => {
		expect(typeOf(val)).toBe(type);
	});
});

describe('Objects', () => {
	describe.each(testGlobals)('%s', (type) => {
		it('correctly identified', () => {
			const instance = createInstance(type);
			expect(typeOf(instance)).toBe(type);
		});

		// Impossible to detect Error subclasses where prototype has been altered
		// https://github.com/overlookmotel/native-type-of/issues/2
		if (!type.endsWith('Error')) {
			describe('correctly identified when prototype set to', () => {
				it('null', () => {
					const instance = createInstance(type);
					Object.setPrototypeOf(instance, null);
					expect(typeOf(instance)).toBe(type);
				});

				// Impossible to detect Promises where prototype has been altered
				// https://github.com/overlookmotel/native-type-of/issues/1
				if (type !== 'Promise') {
					describe('prototype of', () => {
						it.each(
							globals.filter(([protoType]) => (
								protoType !== type
								// Objects with prototype `TypeError.prototype` are identified as 'TypeError'
								// (same applies for other Array subclass prototypes)
								// https://github.com/overlookmotel/native-type-of/issues/3
								&& (type !== 'Object' || !isErrorSubclass(protoType))
							))
						)('%s', (_, {prototype}) => {
							const instance = createInstance(type);
							Object.setPrototypeOf(instance, prototype);
							expect(typeOf(instance)).toBe(type);
						});
					});

					describe('instance of', () => {
						it.each(
							globals.filter(([protoType]) => (
								// Objects with prototype `new TypeError()` are identified as 'TypeError'
								// (same applies for other Array subclass prototypes)
								// https://github.com/overlookmotel/native-type-of/issues/3
								type !== 'Object' || !isErrorSubclass(protoType)
							))
						)('%s', (instanceType) => {
							const instance = createInstance(type);
							Object.setPrototypeOf(instance, createInstance(instanceType));
							expect(typeOf(instance)).toBe(type);
						});
					});
				}
			});
		}
	});

	describe('Arguments', () => { // eslint-disable-line jest/prefer-lowercase-title
		it('correctly identified', () => {
			const instance = (function() { return arguments; }()); // eslint-disable-line prefer-rest-params
			expect(typeOf(instance)).toBe('Arguments');
		});
	});
});

function isErrorSubclass(type) {
	return /.Error$/.test(type);
}
