import { Ship } from "./Ship.js";

export class Gameboard {
	#shipBoard = createEmptyBoard();
	#attackBoard = createEmptyBoard();
	#ships = [];

	getShipBoard() {
		return this.#shipBoard;
	}

	getAttackBoard() {
		return this.#attackBoard;
	}

	placeShip(coordinates, name) {
		const ship = new Ship(coordinates.length, name, coordinates);

		for (let coordinate of coordinates) {
			if (this.#shipBoard[coordinate[0]][coordinate[1]] instanceof Ship) {
				return false;
			}
		}

		for (let coordinate of coordinates) {
			this.#shipBoard[coordinate[0]][coordinate[1]] = ship;
		}

		this.#ships.push(ship);
		return ship;
	}

	receiveAttack(coordinate) {
		const [row, col] = coordinate;

		if (this.#attackBoard[row][col] !== "o") {
			return undefined;
		}

		const shipCell = this.#shipBoard[row][col];

		if (shipCell === "o") {
			this.#attackBoard[row][col] = "w";
			return "w";
		} else {
			shipCell.hit();
			this.#attackBoard[row][col] = "x";
			return "x";
		}
	}

	isOver() {
		if (this.#ships.length === 0) return undefined;
		return this.#ships.every((ship) => ship.isSunk());
	}

	removeShip(ship) {
		for (let coordinate of ship.coordinates) {
			if (this.#shipBoard[coordinate[0]][coordinate[1]] === ship) {
				this.#shipBoard[coordinate[0]][coordinate[1]] = "o";
			}
		}
		this.#ships = this.#ships.filter((s) => s !== ship);
	}
}

function createEmptyBoard() {
	return Array.from({ length: 10 }, () => Array(10).fill("o"));
}
