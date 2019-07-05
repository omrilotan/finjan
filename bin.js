#!/usr/bin/env node

const { join } = require('path');
const execute = require('async-execute');
const { name, version } = require('./package.json');

const [, , ...rest] = process.argv;

console.log(`${name}, ${version}`);

execute([
	'node',
	'--experimental-modules',
	'--es-module-specifier-resolution=node',
	join(__dirname, 'bin.mjs'),
	...rest,
	'--color',
].join(' '), {
	pipe: true,
	exit: true,
});
