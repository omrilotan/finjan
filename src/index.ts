import { api } from "./testSpeed";
import type { SpeedTestResult } from "./testSpeed";
import { addline } from "./csv";
import { Loader } from "./loader";
import { Cron } from "./cron";

async function run({
	loader,
	file,
	silent,
	cron,
}: {
	loader: Loader;
	file: string;
	silent: boolean;
	cron: Cron;
}): Promise<void> {
	let final: SpeedTestResult;
	loader?.message(["Pending…", "|", cron.iteration].join(" ")).start();
	for await (const result of api()) {
		loader?.message(
			[
				result.downloadSpeed
					? ["⬇", result.downloadSpeed, result.downloadUnit].join(" ")
					: null,
				result.uploadSpeed
					? ["⬆", result.uploadSpeed, result.uploadUnit].join(" ")
					: null,
				cron.iteration,
			]
				.filter(Boolean)
				.join(" | "),
		);
		final = result;
	}

	const { completed, ...rest } = final;

	await addline(file, rest);
	loader?.message(["Sleep…", "|", cron.iteration].join(" ")).pause();
}

export function finjan({
	minutes = 60,
	file = "results.csv",
	silent = false,
}: {
	minutes: number;
	file: string;
	silent: boolean;
}) {
	const loader = silent ? null : new Loader("Pending…");
	const cron = new Cron(1000 * 60 * minutes, 1000 * 60);
	cron
		.task(() => run({ file, silent, loader, cron }))
		.start()
		.step(() => loader?.update());
	process.on("SIGINT", cron.stop.bind(cron));
}
