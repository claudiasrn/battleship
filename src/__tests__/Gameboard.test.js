import { Gameboard } from "../Gameboard.js";
import { Ship } from "../Ship.js";

test("ship place occupies right coordinates", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");

	expect(gameboard.isOver()).toBe(false);

	gameboard.receiveAttack([4, 3]);
	gameboard.receiveAttack([4, 4]);
	gameboard.receiveAttack([4, 5]);

	expect(gameboard.isOver()).toBe(true);
});

test("placing an overlapping ship doesn't corrupt the first ship's cells", () => {
	const gameboard = new Gameboard();
	const coordinates1 = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const coordinates2 = [
		[4, 4],
		[4, 5],
		[4, 6],
	];

	gameboard.placeShip(coordinates1, "falcon9");
	gameboard.placeShip(coordinates2, "voyager");

	expect(gameboard.receiveAttack([4, 3])).toBe("x");
	expect(gameboard.receiveAttack([4, 4])).toBe("x");
	expect(gameboard.receiveAttack([4, 5])).toBe("x");
});

test("attacking an empty cell, will mark it as a miss", () => {
	const gameboard = new Gameboard();
	expect(gameboard.receiveAttack([4, 3])).toBe("w");
});

test("attacking a cell with a ship, will mark it as a hit", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");

	expect(gameboard.receiveAttack([4, 3])).toBe("x");
});

test("attacking a cell that has been attacked already wont work", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");
	gameboard.receiveAttack([4, 3]);
	gameboard.receiveAttack([0, 0]);

	expect(gameboard.receiveAttack([4, 3])).toBe(undefined);
	expect(gameboard.receiveAttack([0, 0])).toBe(undefined);
});

test("if no ships have been placed it isn't over or not over", () => {
	const gameboard = new Gameboard();

	expect(gameboard.isOver()).toBe(undefined);
});

test("if ships are placed and not sunk the game shouldn't be over", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");
	gameboard.receiveAttack([4, 3]);

	expect(gameboard.isOver()).toBe(false);
});

test("if ships are placed and all sunk the game should be over", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");
	gameboard.receiveAttack([4, 3]);
	gameboard.receiveAttack([4, 4]);
	gameboard.receiveAttack([4, 5]);

	expect(gameboard.isOver()).toBe(true);
});

test("if ships are placed and some sunk and others didn't the game shouldn't be over", () => {
	const gameboard = new Gameboard();
	const coordinates1 = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const coordinates2 = [
		[4, 6],
		[4, 7],
		[4, 8],
	];
	gameboard.placeShip(coordinates1, "falcon9");
	gameboard.placeShip(coordinates2, "voyager");
	gameboard.receiveAttack([4, 3]);
	gameboard.receiveAttack([4, 4]);
	gameboard.receiveAttack([4, 5]);

	expect(gameboard.isOver()).toBe(false);
});

test("a sequence of mixed hits and misses each register correctly", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");

	expect(gameboard.receiveAttack([0, 0])).toBe("w");
	expect(gameboard.receiveAttack([4, 3])).toBe("x");
	expect(gameboard.receiveAttack([1, 1])).toBe("w");
	expect(gameboard.receiveAttack([4, 4])).toBe("x");
});

test("getShipBoard exposes ship placement without being affected by attacks", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");
	gameboard.receiveAttack([4, 3]);

	const shipBoard = gameboard.getShipBoard();
	expect(shipBoard[4][3]).toBeInstanceOf(Ship);
	expect(shipBoard[4][3].name).toBe("falcon9");
});

test("getAttackBoard tracks hits and misses separately from ship placement", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	gameboard.placeShip(coordinates, "falcon9");
	gameboard.receiveAttack([4, 3]);
	gameboard.receiveAttack([0, 0]);

	const attackBoard = gameboard.getAttackBoard();
	expect(attackBoard[4][3]).toBe("x");
	expect(attackBoard[0][0]).toBe("w");
	expect(attackBoard[5][5]).toBe("o");
});

test("a hit ship's cell still holds the Ship instance, not overwritten by the attack", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
	];
	gameboard.placeShip(coordinates, "sputnik");
	gameboard.receiveAttack([4, 3]);

	const shipBoard = gameboard.getShipBoard();
	expect(shipBoard[4][3]).toBeInstanceOf(Ship);
	expect(shipBoard[4][3].isSunk()).toBe(false);

	gameboard.receiveAttack([4, 4]);
	expect(shipBoard[4][3].isSunk()).toBe(true);
});

test("placeShip returns the created Ship instance on success", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const placedShip = gameboard.placeShip(coordinates, "falcon9");

	expect(placedShip).toBeInstanceOf(Ship);
	expect(placedShip.name).toBe("falcon9");
});

test("placeShip returns false when coordinates overlap an existing ship", () => {
	const gameboard = new Gameboard();
	gameboard.placeShip(
		[
			[4, 3],
			[4, 4],
			[4, 5],
		],
		"falcon9",
	);

	const secondPlacement = gameboard.placeShip(
		[
			[4, 4],
			[4, 5],
			[4, 6],
		],
		"voyager",
	);

	expect(secondPlacement).toBe(false);
});

test("removeShip clears the ship's cells back to empty", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const placedShip = gameboard.placeShip(coordinates, "falcon9");
	gameboard.removeShip(placedShip);

	const shipBoard = gameboard.getShipBoard();
	expect(shipBoard[4][3]).toBe("o");
	expect(shipBoard[4][4]).toBe("o");
	expect(shipBoard[4][5]).toBe("o");
});

test("removeShip lets a new ship be placed on the freed cells", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const placedShip = gameboard.placeShip(coordinates, "falcon9");
	gameboard.removeShip(placedShip);

	const replacement = gameboard.placeShip(coordinates, "voyager");
	expect(replacement).not.toBe(false);
	expect(gameboard.getShipBoard()[4][3].name).toBe("voyager");
});

test("removeShip excludes the ship from isOver's sunk check", () => {
	const gameboard = new Gameboard();
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];
	const placedShip = gameboard.placeShip(coordinates, "falcon9");
	gameboard.removeShip(placedShip);

	expect(gameboard.isOver()).toBe(undefined);
});

test("removeShip doesn't affect other ships still on the board", () => {
	const gameboard = new Gameboard();
	const shipToRemove = gameboard.placeShip(
		[
			[4, 3],
			[4, 4],
			[4, 5],
		],
		"falcon9",
	);
	gameboard.placeShip(
		[
			[7, 0],
			[7, 1],
			[7, 2],
		],
		"voyager",
	);

	gameboard.removeShip(shipToRemove);

	expect(gameboard.receiveAttack([7, 0])).toBe("x");
	expect(gameboard.isOver()).toBe(false);
});
