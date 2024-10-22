import { isDeepStrictEqual as compareObjects } from "node:util";
import puppeteer from "puppeteer";

// Delay function
const delay = (milliseconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

// Type definition for speed test results
export type SpeedTestResult = {
	downloadSpeed: number;
	downloadUnit: string;
	downloadValue: number;
	uploadSpeed: number;
	uploadUnit: string;
	uploadValue: number;
	latency: number;
	buffer: number;
	location: string;
	ip: string;
	completed: boolean;
};

// Generator function to track speed test progress
async function* speedTracker(
	browserPage: puppeteer.Page,
): AsyncGenerator<SpeedTestResult, void, undefined> {
	let lastReportedResult: SpeedTestResult | undefined;

	while (true) {
		const currentResult: SpeedTestResult = await browserPage.evaluate(
			(): SpeedTestResult => {
				const querySelector = document.querySelector.bind(document);

				return {
					downloadSpeed: Number(querySelector("#speed-value")?.textContent),
					downloadUnit: querySelector("#speed-units")?.textContent?.trim()!,
					downloadValue: Number(
						querySelector("#down-mb-value")?.textContent?.trim(),
					),
					uploadSpeed: Number(querySelector("#upload-value")?.textContent),
					uploadUnit: querySelector("#upload-units")?.textContent?.trim()!,
					uploadValue: Number(
						querySelector("#up-mb-value")?.textContent?.trim(),
					),
					latency: Number(querySelector("#latency-value")?.textContent?.trim()),
					buffer: Number(querySelector("#buffer-value")?.textContent?.trim()),
					location: querySelector("#user-location")
						?.textContent?.trim()!
						.replace(/,/, ""),
					ip: querySelector("#user-ip")?.textContent?.trim(),

					completed: Boolean(
						querySelector("#speed-value.succeeded") &&
							querySelector("#upload-value.succeeded"),
					),
				};
			},
		);

		if (
			currentResult.downloadSpeed > 0 &&
			!compareObjects(currentResult, lastReportedResult)
		) {
			yield currentResult;
		}

		if (currentResult.completed) {
			return;
		}

		lastReportedResult = currentResult;

		await delay(100);
	}
}

// Main function to manage the speed test process
export async function* api(): AsyncGenerator<SpeedTestResult, void, undefined> {
	const browserInstance = await puppeteer.launch({ args: ["--no-sandbox"] });
	const browserTab = await browserInstance.newPage();
	await browserTab.goto("https://fast.com");

	try {
		for await (const testResult of speedTracker(browserTab)) {
			yield testResult;
		}
	} finally {
		await browserInstance.close();
	}
}
