/**
 * A simple cron job that runs a callback every <gap> milliseconds
 */
export class Cron {
	#interval: number;
	#gap: number;
	#nextRun = 0;
	#callback: () => Promise<void>;
	#step: () => Promise<void>;
	#timer: NodeJS.Timeout | null = null;
	#iteration = 0;
	/**
	 * @param gap - The time in milliseconds between each run
	 * @param interval - Minimum mistakable time in milliseconds
	 */
	constructor(gap: number, interval = 5000): void {
		if (gap < 60000) {
			throw new Error("Gap must be greater than one minute");
		}
		this.#gap = gap;
		this.#interval = interval;
	}

	/**
	 * Register the callback to be called every <gap> milliseconds
	 */
	task(callback: () => unknown): Cron {
		this.#callback = callback;
		return this;
	}

	/**
	 * Start the cron job
	 */
	start(): Cron {
		if (typeof this.#callback !== "function") {
			throw new Error(
				"No task has been registered. Use .task(callback) to register a task",
			);
		}
		this.#step?.();
		const now = Date.now();
		if (now > this.#nextRun) {
			this.#nextRun = now + this.#gap;
			this.#iteration++;
			this.#callback();
		}
		this.#timer = setTimeout(() => this.start(this.#callback), this.#interval);
		return this;
	}

	/**
	 * Call this method every check to update the loader
	 */
	step(callback: () => unknown): Cron {
		this.#step = callback;
		return this;
	}
	stop(): Cron {
		clearTimeout(this.#timer);
		return this;
	}

	get iteration(): number {
		return "#" + this.#iteration.toLocaleString("en-GB");
	}
}
