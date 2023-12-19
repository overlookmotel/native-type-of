# Changelog

## 2.0.0

Breaking changes:

* Drop support for Node v12 + v14 + v16
* Drop support for Node v18.0.0

Features:

* Support `MessagePort`

Tests:

* Don't support `MessageChannel`

Dev:

* CI run tests on Node v18 + v20 + v21
* CI run lint and coverage on Node v20
* Use NPM v10 for development
* Clean up after `cover` NPM script even if fails
* Run ESLint in parallel
* Run tests on all CPU cores on CI
* Remove installing NPM from CI task [improve]
* Update dev dependencies
* Update Github Actions scripts

Docs:

* Change versioning policy
* Fix Github Actions badge [fix]
* Remove David badges from README
* Update license year

## 1.1.0

Minor:

* Drop support for Node v10

Bug fixes:

* Identify boxed Symbols

Tests:

* Tests for boxed BigInt
* Fix tests for AggregateError [fix]
* Fix test order [fix]
* Remove commented out code [nocode]

Dev:

* Use NPM v7 for development
* Use Github Actions for CI
* Update dev dependencies

Docs:

* Update README
* Add boxed BigInt example
* Remove Greenkeeper badge
* Update license year
* Remove license indentation

## 1.0.0

* Initial release
