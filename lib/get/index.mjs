import path from 'path';
import glob from 'glob';

const { join } = path;

const find = patterns => new Promise((resolve, reject) => {
	const results = [];
	let pending = patterns.length;
	patterns.forEach(pattern => glob(pattern, (error, files) => {
		if (error) {
			reject(error);
			return;
		}

		results.push(...files);

		if (--pending === 0) {
			resolve(results);
		}
	}));

});

export default async files => {
	files = typeof files === 'string'
		? [files]
		: files
	;

	return Promise.all(
		(await find(files)).map(
			file => import(
				join(
					process.cwd(),
					file
				)
			)
		)
	);
};
