import parser from 'yargs-parser';

export default function([, , ...rest]) {
	const { _: files, ...options } = parser(rest);
	const ignore = options.ignore || options.i;
	const required = options.require || options.r;
	const verbose = options.verbose || options.v;

	return {
		files,
		ignore,
		required,
		verbose,
	};
}
