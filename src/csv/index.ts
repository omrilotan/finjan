import { writeFile, open, access, constants } from "node:fs/promises";
import type { SpeedTestResult } from "../testSpeed";

export async function addline(
	file: string,
	line: Partial<SpeedTestResult>,
): Promise<void> {
	const titles = `time,${Object.keys(line).join(",")}\n`;
	const time = new Date()
		.toJSON()
		.replace("T", " ")
		.replace(/(\d{2}:\d{2}).*/, "$1");
	try {
		await access(file, constants.F_OK);
	} catch (error) {
		await writeFile(file, titles);
	}
	const handler = await open(file, "a");
	await handler.appendFile(
		`${time},${Object.values(line)
			.map((value) => (value ?? "-").toString().trim())
			.join(",")}\n`,
	);
	await handler.close();
}
