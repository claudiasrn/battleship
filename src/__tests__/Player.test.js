import { Player } from "../Player.js";
import { Ship } from "../Ship.js";

test("player is created with the given type", () => {
	const player = new Player("human");
	expect(player.type).toBe("human");
});

test("player is created with their own gameboard", () => {
	const player = new Player("human");
	expect(player.gameboard).toBeDefined();
});

test("player's gameboard can have ships placed on it", () => {
	const player = new Player("human");
	const coordinates = [
		[4, 3],
		[4, 4],
		[4, 5],
	];

	expect(player.gameboard.placeShip(coordinates)).toBeInstanceOf(Ship);
});
