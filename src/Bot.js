export class BotAI {
	#triedCells = new Set();
	#targetStack = [];

	chooseAttack() {
		while (this.#targetStack.length > 0) {
			const { coordinate } = this.#targetStack[this.#targetStack.length - 1];
			if (!this.#triedCells.has(this.#key(coordinate))) {
				return coordinate;
			}
			this.#targetStack.pop();
		}
		return this.#randomUntriedCoordinate();
	}

	registerResult(coordinate, hit, ship = null) {
		this.#triedCells.add(this.#key(coordinate));

		if (hit && ship) {
			if (ship.isSunk()) {
				this.#targetStack = this.#targetStack.filter(
					(entry) => entry.ship !== ship,
				);
			} else {
				this.#queueAdjacentCells(coordinate, ship);
			}
		}
	}

	#randomUntriedCoordinate() {
		const untried = [];
		for (let row = 0; row < 10; row++) {
			for (let col = 0; col < 10; col++) {
				if (!this.#triedCells.has(this.#key([row, col]))) {
					untried.push([row, col]);
				}
			}
		}
		const index = Math.floor(Math.random() * untried.length);
		return untried[index];
	}

	#queueAdjacentCells([row, col], ship) {
		const candidates = [
			[row - 1, col],
			[row + 1, col],
			[row, col - 1],
			[row, col + 1],
		];

		candidates.forEach((candidate) => {
			const [r, c] = candidate;
			const inBounds = r >= 0 && r < 10 && c >= 0 && c < 10;
			if (inBounds && !this.#triedCells.has(this.#key(candidate))) {
				this.#targetStack.push({ coordinate: candidate, ship });
			}
		});
	}

	#key([row, col]) {
		return `${row},${col}`;
	}
}
