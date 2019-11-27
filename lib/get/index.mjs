import path from 'path';
import glob from 'glob';

const { join } = path;

const find = (
	patterns,
	{ ignore } = {},
) => new Promise(
	(resolve, reject) => {
		const results = [];
		let pending = patterns.length;

		patterns.forEach(
			pattern => glob(
				pattern,
				{ ignore },
				(error, files) => {
					if (error) {
						reject(error);
						return;
					}

					results.push(...files);

					if (--pending === 0) {
						resolve(results);
					}
				},
			),
		);
	},
);

export default async (files, { ignore } = {}) => {
	files = typeof files === 'string'
		? [files]
		: files
	;

	return Promise.all(
		(
			await find(
				files,
				{ ignore },
			)
		).map(
			file => join(
				process.cwd(),
				file,
			),
		),
	);
};
