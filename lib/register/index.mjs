import collections from '../collections';
import logger from '../logger';
import run from '../run';
import { yellow, bold } from '../colours';

export default async function register(file) {
	logger.debug(yellow.bold(`➤ Running ${file}`));

	const {
		before,
		describes,
		its,
		hooks,
	} = collections();

	await import(file);

	while (describes.length) {
		logger.info({ describes });
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

		logger.debug('');
	}

	Object.assign(
		global,
		before,
	);
}
