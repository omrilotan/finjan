#!/usr/bin/env -S NODE_NO_WARNINGS=1 node

import { parseArgs } from "node:util";
import { readFile } from "node:fs/promises";
import { finjan } from "./dist/index.js";

const [, , ...args] = process.argv;

const {
	values: { minutes, file, silent, help, version },
} = parseArgs({
	args,
	options: {
		minutes: {
			type: "string",
			short: "m",
		},
		file: {
			type: "string",
			short: "f",
			default: "results.csv",
		},
		silent: {
			type: "boolean",
			short: "s",
		},
		help: {
			type: "boolean",
			short: "h",
		},
		version: {
			type: "boolean",
			short: "v",
		},
	},
	allowPositionals: true,
});

if (help) {
	console.info(`
npx finjan [-m <minutes:60>] [-f <file:results.csv>] [-s] [-h]

Options:
	-m, --minutes <minutes:60>  Number of minutes to log
	-f, --file <file:results.csv>  File to log to
	-s, --silent  Do not output to console
	-h, --help  Show this help message
`);
	process.exit(0);
}

if (version) {
	const { name, version } = JSON.parse(
		await readFile(`${import.meta.dirname}/package.json`, "utf8"),
	);
	console.info([name, version].join("@"));
	process.exit(0);
}

finjan({ minutes, file, silent });
