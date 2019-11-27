import { HOOKS } from '../constants';

export default function collections() {
	const before = Object.assign(
		...[
			'describe',
			'it',
			...HOOKS,
		].map(
			fn => ({[fn]: global[fn]}),
		),
	);

	const describes = [];
	const its = [];
	const hooks = Object.assign(
		{},
		...HOOKS.map(
			hook => ({ [hook]: [] }),
		),
	);

	Object.assign(
		global,
		{
			describe: (name, fn) => describes.push({name, fn}),
			it: (name, fn) => its.push({name, fn}),
		},
		...HOOKS.map(
			hook => ({ [hook]: fn => hooks[hook].push(fn) }),
		),
	);

	return {
		before,
		describes,
		its,
		hooks,
	};
}
