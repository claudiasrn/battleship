import { BotAI } from "../Bot.js";

function fakeShip(sunk = false) {
	return { isSunk: () => sunk };
}

test("chooseAttack returns a coordinate within the 10x10 board", () => {
	const bot = new BotAI();
	const [row, col] = bot.chooseAttack();

	expect(row).toBeGreaterThanOrEqual(0);
	expect(row).toBeLessThanOrEqual(9);
	expect(col).toBeGreaterThanOrEqual(0);
	expect(col).toBeLessThanOrEqual(9);
});

test("chooseAttack never repeats a coordinate that was already registered", () => {
	const bot = new BotAI();
	const attacked = new Set();

	for (let i = 0; i < 100; i++) {
		const [row, col] = bot.chooseAttack();
		const key = `${row},${col}`;

		expect(attacked.has(key)).toBe(false);
		attacked.add(key);

		bot.registerResult([row, col], false);
	}

	expect(attacked.size).toBe(100);
});

test("a hit that doesn't sink the ship queues its orthogonal neighbors", () => {
	const bot = new BotAI();
	const ship = fakeShip(false);

	bot.registerResult([5, 5], true, ship);

	const next = bot.chooseAttack();
	const neighbors = [
		[4, 5],
		[6, 5],
		[5, 4],
		[5, 6],
	];

	expect(neighbors).toContainEqual(next);
});

test("queued neighbors are attacked before falling back to random cells", () => {
	const bot = new BotAI();
	const ship = fakeShip(false);
	bot.registerResult([5, 5], true, ship);

	const neighbors = [
		[4, 5],
		[6, 5],
		[5, 4],
		[5, 6],
	];

	const attacked = [];
	for (let i = 0; i < 4; i++) {
		const coordinate = bot.chooseAttack();
		attacked.push(coordinate);
		bot.registerResult(coordinate, false);
	}

	attacked.forEach((coordinate) => {
		expect(neighbors).toContainEqual(coordinate);
	});
});

test("out-of-bounds neighbors near an edge are never queued", () => {
	const bot = new BotAI();
	const ship = fakeShip(false);

	bot.registerResult([0, 0], true, ship);

	const seen = [];
	for (let i = 0; i < 2; i++) {
		const coordinate = bot.chooseAttack();
		seen.push(coordinate);
		bot.registerResult(coordinate, false);
	}

	seen.forEach(([row, col]) => {
		expect(row).toBeGreaterThanOrEqual(0);
		expect(col).toBeGreaterThanOrEqual(0);
	});
	expect(seen).toContainEqual([1, 0]);
	expect(seen).toContainEqual([0, 1]);
});

test("sinking a ship clears only that ship's queued neighbors, not other ships'", () => {
	const bot = new BotAI();
	const shipA = fakeShip(false);
	const shipB = fakeShip(false);

	bot.registerResult([2, 2], true, shipA);
	bot.registerResult([7, 7], true, shipB);

	shipA.isSunk = () => true;
	bot.registerResult([2, 3], true, shipA);

	const shipANeighbors = [
		[1, 2],
		[3, 2],
		[2, 1],
		[1, 3],
		[3, 3],
		[2, 4],
	];
	const shipBNeighbors = [
		[6, 7],
		[8, 7],
		[7, 6],
		[7, 8],
	];

	const seen = [];
	for (let i = 0; i < 4; i++) {
		const coordinate = bot.chooseAttack();
		seen.push(coordinate);
		bot.registerResult(coordinate, false);
	}

	seen.forEach((coordinate) => {
		expect(shipANeighbors).not.toContainEqual(coordinate);
		expect(shipBNeighbors).toContainEqual(coordinate);
	});

	shipBNeighbors.forEach((neighbor) => {
		expect(seen).toContainEqual(neighbor);
	});
});

test("a fully random game (all misses) eventually covers the whole board with no repeats", () => {
	const bot = new BotAI();
	const attacked = new Set();

	for (let i = 0; i < 100; i++) {
		const coordinate = bot.chooseAttack();
		const key = coordinate.join(",");
		expect(attacked.has(key)).toBe(false);
		attacked.add(key);
		bot.registerResult(coordinate, false);
	}

	expect(attacked.size).toBe(100);
});
