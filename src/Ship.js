export class Ship {
	#length;
	#timesHit;
	#sunk;
	#name;
	#coordinates;

	constructor(length, name, coordinates) {
		this.#length = length;
		this.#timesHit = 0;
		this.#sunk = false;
		this.#name = name;
		this.#coordinates = coordinates;
	}

	get name() {
		return this.#name;
	}

	get coordinates() {
		return this.#coordinates;
	}

	hit() {
		this.#timesHit++;
	}

	isSunk() {
		if (this.#length <= this.#timesHit) {
			this.#sunk = true;
			return this.#sunk;
		}

		return this.#sunk;
	}
}
