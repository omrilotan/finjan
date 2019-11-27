import { green, red, cyan, bold, yellow } from '../colours';

/**
 * Prefix line by index
 * @param  {String} input
 * @param  {Number} index
 * @return {String}
 */
const indent = (input, index) => (index === 0 ? '\n' : '  ') + input;

export default function(errors, {verbose = false} = {}) {
	const lines = [];

	const color = errors.length ? red.bold : green;
	const message = errors.length === 1
		? `Finished with ${errors.length} error`
		: `Finished with ${errors.length} errors`
	;
	lines.push(color(message));

	if (errors.length) {
		lines.push(
			...errors.map(
				({name, stack, origin, message, fileName, lineNumber, columnNumber}) => [
					red([name, message].join(': ')),
					`${bold('in')}: ${cyan.bold(origin)}`,
					`${bold('at')}: ${yellow([fileName, lineNumber, columnNumber].join(':'))}`,
					verbose && stack,
				].filter(Boolean).map(indent).join('\n'),
			),
		);
	}

	return lines.join('\n');
}
