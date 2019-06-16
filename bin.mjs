import parser from 'yargs-parser';
import chalk from 'chalk';
import errline from './lib/errline';
import get from './lib/get';
import run from './lib/run';
import logger from './lib/logger';
import {
	describes,
	errors,
	its,
} from './lib/things';
import { HOOKS } from './lib/constants';

const [, , ...rest] = process.argv;
const { _: files, require: required } = parser(rest);

const { green, red, bold, yellow } = chalk;
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
