import { Ship } from "../Ship.js";

test("ship is not sunk when created", () => {
	const ship = new Ship(3, "falcon9", [
		[4, 3],
		[4, 4],
		[4, 5],
	]);
	expect(ship.isSunk()).toBe(false);
});

test("ship is not sunk after fewer hits than its length", () => {
	const ship = new Ship(3, "falcon9", [
		[4, 3],
		[4, 4],
		[4, 5],
	]);
	ship.hit();
	expect(ship.isSunk()).toBe(false);
});

test("ship is sunk after hits equal to its length", () => {
	const ship = new Ship(2, "sputnik", [
		[4, 3],
		[4, 4],
	]);
	ship.hit();
	ship.hit();
	expect(ship.isSunk()).toBe(true);
});

test("ship exposes the name it was given", () => {
	const ship = new Ship(2, "sputnik", [
		[4, 3],
		[4, 4],
	]);
	expect(ship.name).toBe("sputnik");
});

test("ship exposes the coordinates it was given", () => {
	const coordinates = [
		[4, 3],
		[4, 4],
	];
	const ship = new Ship(2, "sputnik", coordinates);
	expect(ship.coordinates).toBe(coordinates);
});
