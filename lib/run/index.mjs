import errobj from 'errobj';
import chalk from 'chalk';
import logger from '../logger';
import { errors } from '../things';

const { green, red } = chalk;
let current;

process.on('unhandledRejection', error => {
	errors.push(
		errobj(error, {origin: current, name: 'Un-handled Error'})
	);
});

export default async function(name, fn) {
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
