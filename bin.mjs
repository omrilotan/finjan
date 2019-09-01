import args from './lib/args';
import { red } from './lib/colours';
import get from './lib/get';
import foreach from './lib/foreach';
import logger from './lib/logger';
import summarise from './lib/summarise';
import register from './lib/register';
import errors from './lib/errors';

const {
	files,
	required,
	ignore,
	verbose,
} = args(process.argv);

(async() => {
	try {
		required && await import(await get(required));

		await foreach(await get(files, { ignore }), register);

		logger.info(summarise(errors, { verbose }));

		process.exit(errors.length);
	} catch (error) {
		logger.info(red.bold('Error in finjan;'));
		logger.error(error);
	}
})();
