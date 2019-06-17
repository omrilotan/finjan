import parser from 'yargs-parser';

export default function(argv) {
	const [, , ...rest] = argv;
	const { _: files, ...options } = parser(rest);

	const required = options.require || options.r;
	const verbose = options.verbose || options.v;

	return {
		files,
		required,
		verbose,
	};
}
