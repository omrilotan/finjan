import path from 'path';
const { join } = path;

export default files => {
	files = typeof files === 'string'
		? [files]
		: files
	;

	return Promise.all(
		files.map(
			file => import(
				join(
					process.cwd(),
					file
				)
			)
		)
	);
};
