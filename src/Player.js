import { Gameboard } from "./Gameboard.js";

export class Player {
	constructor(type) {
		this.type = type;
		this.gameboard = new Gameboard();
	}
}
