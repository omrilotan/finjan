import parser from 'yargs-parser';
import chalk from 'chalk';
import errobj from 'errobj';
import errline from './lib/errline';
import get from './lib/get';
import logger from './lib/logger';
import {
	describes,
	errors,
	its,
} from './lib/things';

const [, , ...rest] = process.argv;
const { _: files, require: required } = parser(rest);

const { green, red, bold, yellow } = chalk;
const HOOKS = [
	'before',
	'beforeEach',
	'afterEach',
	'after',
];
const hooks = Object.assign(
	{},
	...HOOKS.map(
		hook => ({ [hook]: [] })
	),
);

const describe = (name, fn) => describes.push({name, fn});
const it = (name, fn) => its.push({name, fn});

Object.assign(
	global,
	{
		describe,
		it,
	},
	...HOOKS.map(
		hook => ({ [hook]: fn => hooks[hook].push(fn) })
	)
);

let current;

process.on('unhandledRejection', error => {
	errors.push(
		errobj(error, {origin: current, name: 'Un-handled Error'})
	);
});

async function run(name, fn) {
	current = name;
	try {
		await fn();
		logger.info(green(` ✔︎ ${name}`));
	} catch (error) {
		logger.info(red(` ✘ ${name}`));
		errors.push(
			errobj(error, {origin: name})
		);
	}
}

(async() => {
	try {
		required && await get(required);

		await get(files);

		while (describes.length) {
			const {name, fn} = describes.shift();
			logger.info(bold(name)) || await fn();

			while(hooks.before.length) {
				await hooks.before.shift()();
			}

			while(its.length) {
				await Promise.all(hooks.beforeEach.map(async i => await i()));

				const {name, fn} = its.shift();
				await run(name, fn);

				await Promise.all(hooks.afterEach.map(async i => await i()));
			}

			hooks.beforeEach.length = 0;
			hooks.afterEach.length = 0;

			while(hooks.after.length) {
				await hooks.after.shift()();
			}
		}

		logger.info('');
		const color = errors.length ? red : green;
		logger.info(color(`Finished with ${errors.length} errors`));

		if (errors.length) {
			logger.info(
				...errors.map(
					({name, origin, message, fileName, lineNumber, columnNumber}) => [
						red.bold(name),
						`${bold('in')}: ${red.bold(origin)}`,
						`${bold('at')}: ${yellow([fileName, lineNumber, columnNumber].join(':'))}`,
						message,
					].filter(Boolean).map(errline).join('\n')
				)
			);
		}

		process.exit(errors.length);
	} catch (error) {
		logger.info(red.bold('Error in finjan;'));
		logger.error(error);
	}
})();
