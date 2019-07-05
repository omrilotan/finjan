import chalk from 'chalk';
import wait from '@lets/wait';

const { cyan } = chalk;

const print = (...args) => console.log(cyan(args.join(' '))); // eslint-disable-line no-console
const counts = {
	beforeEach: 0,
	afterEach: 0,
};

describe('finjan test run', () => {
	before(() => print('I happen before all its'));
	beforeEach(() => print(++counts.beforeEach, 'I happen before each it'));
	afterEach(() => print(++counts.afterEach, 'I happen after each it'));
	afterEach(() => process.stdout.write('\n'));
	after(() => print('I happen after all its'));

	it('Should fail in this test', () => {
		throw new Error('Something must have gone terribly wrong');
	});
	it('Should succeed in this test', () => {
		'Do nothing';
	});
	it('Should not fail with async error', () => {
		asyncError();
	});
	it('Should fail with async error', async() => {
		await asyncError();
	});
});

describe('another finjan test run', () => {
	it('Should fail in this test, too', () => {
		throw new Error('Something must have gone terribly, horribly wrong');
	});
});

async function asyncError() {
	await wait(40);
	throw new Error('Something must have gone terribly wrong');
}
