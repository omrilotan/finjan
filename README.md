# finjan [![](https://img.shields.io/npm/v/finjan.svg)](https://www.npmjs.com/package/finjan) [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/mono/tree/master/packages/finjan)

## ☕️ Just test harmony modules

> Work in progress

![](assets/finjan.svg)

```
finjan file.mjs another-file.mjs --require finjan.mjs
```

Pass in filenames to import as tests.

### Options

| name | Value
| - | -
| require | one or more files to import before the tests

### Structure of spec/tests file

```js
describe('my suit', function() {
	it('Should pass', function() {
		assert(!!1, true);
	});
	it('Should pass', async function() {
		assert.equal(await square(2), 4);
	});
});

```

Create a scope with `describe` and register tests with `it`

Additional methods:

| Method | Meaning
| - | -
| `before` | Runs before all `it`s in a `describe`
| `beforeEach` | Runs before each `it` in a `describe`
| `afterEach` | Runs after each `it` in a `describe`
| `after` | Runs after all `it`s in a `describe`
