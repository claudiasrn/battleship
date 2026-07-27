import { Ship } from "./Ship.js";

export class Gameboard {
	#board = [
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
		["o", "o", "o", "o", "o", "o", "o", "o", "o", "o"],
	];

	#ships = [];

	placeShip(coordinates) {
		const ship = new Ship(coordinates.length);

		for (let coordinate of coordinates) {
			const state = this.#board[coordinate[0]][coordinate[1]];
			if (state instanceof Ship) return false;
		}

		for (let coordinate of coordinates) {
			this.#board[coordinate[0]][coordinate[1]] = ship;
		}

		this.#ships.push(ship);
		return true;
	}

	receiveAttack(coordinate) {
		if (
			this.#board[coordinate[0]][coordinate[1]] === "x" ||
			this.#board[coordinate[0]][coordinate[1]] === "w"
		) {
			return undefined;
		}

		if (this.#board[coordinate[0]][coordinate[1]] === "o") {
			this.#board[coordinate[0]][coordinate[1]] = "w";
			return "w";
		} else {
			this.#board[coordinate[0]][coordinate[1]].hit();
			this.#board[coordinate[0]][coordinate[1]] = "x";
			return "x";
		}
	}

	isOver() {
		if (this.#ships.length === 0) return undefined;

		return this.#ships.every((ship) => ship.isSunk());
	}
}
