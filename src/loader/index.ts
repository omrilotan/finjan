import { clear, update } from "stdline";

const states = ["◉○○○", "◉○○○", "○◉○○", "○○◉○", "○○○◉", "○○○◉", "○○◉○", "○◉○○"];
const timestamp = () => new Date().toTimeString().slice(0, 8);
let timer;

export class Loader {
	#message: string;
	#graphics = "";
	constructor(message: string) {
		this.#message = message;
	}
	start(index = 0): Loader {
		clearTimeout(timer);
		this.#graphics = states[index];
		const next = index === states.length - 1 ? 0 : index + 1;
		this.message(this.#message);
		timer = setTimeout(() => this.start(next), 50);
		return this;
	}
	message(message?: string): Loader {
		if (typeof message === "string") {
			this.#message = message;
		}
		update(
			[timestamp(), this.#graphics, this.#message].filter(Boolean).join(" "),
		);
		return this;
	}
	pause(): Loader {
		this.#graphics = "××××";
		this.message();
		clearTimeout(timer);
		return this;
	}
	update(): Loader {
		return this.message();
	}
	end(): Loader {
		this.#graphics = "◉◉◉◉";
		clearTimeout(timer);
		clear();
		return this;
	}
}
