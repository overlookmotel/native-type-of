/* --------------------
 * native-type-of module
 * Tests
 * ------------------*/

'use strict';

// Modules
const typeOf = require('native-type-of');

// Init
require('./support/index.js');

// Tests

describe('tests', () => {
	it.skip('all', () => { // eslint-disable-line jest/no-disabled-tests
		expect(typeOf).not.toBeUndefined();
	});
});
