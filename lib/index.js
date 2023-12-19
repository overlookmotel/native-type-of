/* --------------------
 * native-type-of module
 * `typeOf()` function
 * ------------------*/

'use strict';

// Exports

module.exports = typeOf;

const {toStringTag} = Symbol,
	objectToString = Object.prototype.toString,
	errorToString = Error.prototype.toString,
	typedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype),
	typedArrayEntries = typedArrayPrototype.entries,
	typedArrayStringTagGetter = Object.getOwnPropertyDescriptor(typedArrayPrototype, Symbol.toStringTag)
		.get;

const detectionMethods = [
	['RegExp', 'test'],
	['Date', 'toString'],
	['Set', 'has'],
	['Map', 'has'],
	['WeakSet', 'has'],
	['WeakMap', 'has'],
	['WeakRef', 'deref'],
	['FinalizationRegistry', 'unregister', [{}]],
	['BigInt', 'toString'],
	['Promise', 'then'],
	['String', 'valueOf'],
	['Number', 'toString'],
	['Boolean', 'toString'],
	['Symbol', 'toString'],
	['DataView', 'getUint8'],
	['MessagePort', 'hasRef']
].map(
	([type, methodName, args]) => {
		const ctor = global[type];
		if (!ctor) return false;
		return {type, method: ctor.prototype[methodName], args: args || []};
	}
).filter(Boolean);

detectionMethods.push({
	type: 'ArrayBuffer',
	method: Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get,
	args: []
});
detectionMethods.push({
	type: 'SharedArrayBuffer',
	method: Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'byteLength').get,
	args: []
});

function typeOf(val) {
	// Use `typeof`
	const typeofType = typeof val;
	if (typeofType === 'function') return 'Function';
	if (typeofType !== 'object') return typeofType;

	// Identify `null`
	if (val === null) return 'null';

	// Identify Arrays
	if (Array.isArray(val)) return 'Array';

	// Try detection methods and return type for first that doesn't throw
	for (const {type, method, args} of detectionMethods) {
		if (methodDoesNotThrow(val, method, args)) return type;
	}

	// Identify TypedArrays
	if (methodDoesNotThrow(val, typedArrayEntries, [])) return typedArrayStringTagGetter.call(val);

	// Identify Errors and Arguments objects
	const errorMatch = errorToString.call(val).match(/^(.+Error)(?::|$)/);
	if (errorMatch) return errorMatch[1];

	if (hasNoToStringTagProp(val)) return objectToString.call(val).slice(8, -1);

	// Must be a plain object, null-prototype object, or user-defined class instance
	return 'Object';
}

function methodDoesNotThrow(val, method, args) {
	try {
		method.call(val, ...args);
		return true;
	} catch (err) {
		return false;
	}
}

function hasNoToStringTagProp(val) {
	let current = val;
	do {
		const descriptor = Object.getOwnPropertyDescriptor(current, toStringTag);
		if (descriptor && (typeof descriptor.value === 'string' || descriptor.get)) return false;
		current = Object.getPrototypeOf(current);
	} while (current);

	return true;
}
