import { Ship } from "./Ship.js";
import hitMarkerSrc from "./assets/images/markers/hit-marker.png";
import missMarkerSrc from "./assets/images/markers/miss-marker.png";
import player1IdleSrc from "./assets/images/characters/player1/IdlePlayer1.png";
import botIdleSrc from "./assets/images/characters/bot/IdleBot.png";
import player2IdleSrc from "./assets/images/characters/player2/IdlePlayer2.png";
import saturnVMovingSrc from "./assets/images/ships/Saturn-V-moving.png";
import falconHeavyMovingSrc from "./assets/images/ships/Falcon-Heavy-moving.png";
import sputnikMovingSrc from "./assets/images/ships/Sputnik-moving.png";
import saturnVSrc from "./assets/images/ships/Saturn-V.png";
import falconHeavySrc from "./assets/images/ships/Falcon-Heavy.png";
import falcon9Src from "./assets/images/ships/Falcon9.png";
import voyagerSrc from "./assets/images/ships/Voyager.png";
import sputnikSrc from "./assets/images/ships/Sputnik.png";
import starDotSrc from "./assets/images/decoration/star-dot.png";
import starLargeSrc from "./assets/images/decoration/star-large.png";
import starSparkleSrc from "./assets/images/decoration/star-sparkle.png";

const shipSprites = {
	"saturn-v": saturnVSrc,
	"falcon-heavy": falconHeavySrc,
	falcon9: falcon9Src,
	voyager: voyagerSrc,
	sputnik: sputnikSrc,
};

export function renderModeSelect() {
	const container = document.createElement("div");
	container.classList.add("mode-select");

	const wordmark = document.createElement("div");
	wordmark.classList.add("wordmark");

	const hitMarkerImg = document.createElement("img");
	hitMarkerImg.src = hitMarkerSrc;
	hitMarkerImg.alt = "";

	const heading = document.createElement("h1");
	heading.textContent = "STARFALL";

	const player1Img = document.createElement("img");
	player1Img.src = player1IdleSrc;
	player1Img.alt = "";
	player1Img.dataset.spriteFrames = 4;
	player1Img.dataset.frameWidth = 48;
	player1Img.dataset.frameHeight = 48;

	wordmark.append(hitMarkerImg, heading, player1Img);

	const tagline = document.createElement("p");
	tagline.textContent = "FLEET TRACKING & INTERCEPTION";

	const promptSelectionText = document.createElement("div");
	promptSelectionText.classList.add("prompt-selection-text");

	const selectPrompt = document.createElement("p");
	selectPrompt.textContent = "SELECT OPPONENT";

	const blinkingElement = document.createElement("div");

	promptSelectionText.append(selectPrompt, blinkingElement);

	const buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("mode-buttons");

	const botButton = createModeButton(
		"VS BOT",
		"Play against an automated opponent. Fast games, no waiting",
		botIdleSrc,
	);

	const humanButton = createModeButton(
		"VS HUMAN",
		"Play locally against another person, taking turns on this device",
		player2IdleSrc,
	);

	buttonsContainer.append(botButton, humanButton);

	const decoration = createModeSelectDecoration();

	container.append(
		wordmark,
		tagline,
		promptSelectionText,
		buttonsContainer,
		decoration,
	);

	return container;
}

function createModeButton(title, description, imgSrc) {
	const button = document.createElement("button");

	const heading = document.createElement("h2");
	heading.textContent = title;

	const descriptionDiv = document.createElement("div");
	descriptionDiv.classList.add("description");

	const descriptionText = document.createElement("p");
	descriptionText.textContent = description;

	const img = document.createElement("img");
	img.src = imgSrc;
	img.alt = "";
	img.dataset.spriteFrames = 4;
	img.dataset.frameWidth = 48;
	img.dataset.frameHeight = 48;

	descriptionDiv.append(descriptionText, img);
	button.append(heading, descriptionDiv);

	return button;
}

function createModeSelectDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	const ships = [
		{ src: saturnVMovingSrc, name: "saturn-v" },
		{ src: falconHeavyMovingSrc, name: "falcon-heavy" },
		{ src: sputnikMovingSrc, name: "sputnik" },
	];

	ships.forEach((ship) => {
		const img = document.createElement("img");
		img.src = ship.src;
		img.alt = "";
		img.classList.add("decoration-ship", `decoration-ship--${ship.name}`);
		decoration.append(img);
	});

	decoration.append(...createStarField());

	return decoration;
}

export function renderShipPlacement(playerName, playerNumber) {
	const container = document.createElement("div");
	container.classList.add("ship-placement-mode");

	const header = document.createElement("div");

	const heading = document.createElement("h2");
	heading.textContent = `PLACE YOUR FLEET: ${playerName}`;

	const playerImg = document.createElement("img");
	playerImg.src = playerNumber === 2 ? player2IdleSrc : player1IdleSrc;
	playerImg.alt = "";
	playerImg.dataset.spriteFrames = 4;
	playerImg.dataset.frameWidth = 48;
	playerImg.dataset.frameHeight = 48;

	header.append(heading, playerImg);

	const board = document.createElement("div");
	board.classList.add("board");

	const grid = document.createElement("div");
	grid.classList.add("grid");

	for (let i = 0; i < 100; i++) {
		const gridElement = document.createElement("div");
		gridElement.classList.add("grid-element");
		gridElement.dataset.index = i;
		grid.append(gridElement);
	}

	const ships = createPlacementShips();

	board.append(grid, ships);

	const confirmButton = document.createElement("button");
	confirmButton.textContent = "READY FOR GALACTIC BATTLE";

	const decoration = createShipPlacementDecoration();

	container.append(header, board, confirmButton, decoration);

	return container;
}

function createPlacementShips() {
	const shipsContainer = document.createElement("div");
	shipsContainer.classList.add("ships");

	const shipData = [
		{ src: saturnVSrc, name: "saturn-v", length: 5, count: 1 },
		{ src: falconHeavySrc, name: "falcon-heavy", length: 4, count: 2 },
		{ src: falcon9Src, name: "falcon9", length: 3, count: 2 },
		{ src: voyagerSrc, name: "voyager", length: 3, count: 2 },
		{ src: sputnikSrc, name: "sputnik", length: 2, count: 3 },
	];

	shipData.forEach((ship) => {
		for (let i = 0; i < ship.count; i++) {
			const img = document.createElement("img");
			img.src = ship.src;
			img.alt = ship.name;
			img.classList.add("floating-ship", `floating-ship--${ship.name}`);
			img.dataset.shipName = ship.name;
			img.dataset.shipLength = ship.length;
			img.dataset.shipIndex = i;
			shipsContainer.append(img);
		}
	});

	return shipsContainer;
}

function createShipPlacementDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	decoration.append(...createStarField());

	return decoration;
}

export function renderBattle(
	activePlayerNumber,
	gameMode,
	ownShipBoard,
	ownAttackBoard,
	enemyShipBoard,
	enemyAttackBoard,
) {
	const container = document.createElement("div");
	container.classList.add("battle-mode");

	const yourSrc = activePlayerNumber === 2 ? player2IdleSrc : player1IdleSrc;
	const enemySrc =
		gameMode === "bot"
			? botIdleSrc
			: activePlayerNumber === 2
				? player1IdleSrc
				: player2IdleSrc;

	const yourSide = createBoardSide(
		"YOUR FLEET",
		true,
		ownShipBoard,
		ownAttackBoard,
	);

	const characters = createCharacters(yourSrc, enemySrc);

	const enemySide = createBoardSide(
		"ENEMY FLEET",
		false,
		enemyShipBoard,
		enemyAttackBoard,
	);

	const decoration = createBattleDecoration();

	container.append(yourSide, characters, enemySide, decoration);

	return container;
}

function createBoardSide(label, isOwnBoard, shipBoardData, attackBoardData) {
	const side = document.createElement("div");
	side.classList.add("board-side");
	if (isOwnBoard) side.classList.add("board-side--own");

	const heading = document.createElement("h2");
	heading.textContent = label;

	const grid = document.createElement("div");
	grid.classList.add("grid");
	if (!isOwnBoard) grid.classList.add("grid--enemy");

	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 10; col++) {
			const cell = document.createElement("div");
			cell.classList.add("grid-element");
			cell.dataset.row = row;
			cell.dataset.col = col;

			const shipCell = shipBoardData[row][col];
			const attackCell = attackBoardData[row][col];

			if (attackCell === "w") {
				cell.classList.add("miss");
				cell.append(createMarkerImg(missMarkerSrc, "miss"));
			} else if (attackCell === "x") {
				cell.classList.add("hit");
				if (shipCell instanceof Ship && (isOwnBoard || shipCell.isSunk())) {
					if (shipCell.isSunk()) cell.classList.add("sunk");
					const [startRow, startCol] = shipCell.coordinates[0];
					if (row === startRow && col === startCol) {
						cell.append(createShipSprite(shipCell));
					}
				}
				cell.append(createMarkerImg(hitMarkerSrc, "hit"));
			} else if (isOwnBoard && shipCell instanceof Ship) {
				cell.classList.add("has-ship");
				const [startRow, startCol] = shipCell.coordinates[0];
				if (row === startRow && col === startCol) {
					cell.append(createShipSprite(shipCell));
				}
			}

			grid.append(cell);
		}
	}

	side.append(heading, grid);

	return side;
}

function createMarkerImg(src, type) {
	const marker = document.createElement("div");
	marker.classList.add("cell-marker", type);
	marker.style.maskImage = `url(${src})`;
	marker.style.webkitMaskImage = `url(${src})`;
	return marker;
}

function createShipSprite(ship) {
	const coordinates = ship.coordinates;
	const isHorizontal =
		coordinates.length === 1 || coordinates[0][0] === coordinates[1][0];

	const img = document.createElement("img");
	img.src = shipSprites[ship.name];
	img.alt = "";
	img.classList.add(
		"cell-ship-sprite",
		`cell-ship-sprite--${ship.name}`,
		isHorizontal ? "horizontal" : "vertical",
	);
	if (ship.isSunk()) img.classList.add("sunk");

	return img;
}

function createCharacters(yourSrc, enemySrc) {
	const characters = document.createElement("div");
	characters.classList.add("characters");

	const you = createCharacterSlot("YOU", yourSrc);
	const enemy = createCharacterSlot("ENEMY", enemySrc);

	characters.append(you, enemy);

	return characters;
}

function createCharacterSlot(label, src) {
	const slot = document.createElement("div");
	slot.classList.add("character-slot");

	const img = document.createElement("img");
	img.src = src;
	img.alt = "";
	img.classList.add("battle-character");
	img.dataset.spriteFrames = 4;
	img.dataset.frameWidth = 48;
	img.dataset.frameHeight = 48;
	img.dataset.state = "idle";

	slot.append(img);

	return slot;
}

function createBattleDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	decoration.append(...createStarField());

	return decoration;
}

function createStarField() {
	const stars = [
		{ src: starDotSrc, name: "dot" },
		{ src: starLargeSrc, name: "large" },
		{ src: starSparkleSrc, name: "sparkle" },
	];

	const starElements = [];

	stars.forEach((star) => {
		for (let i = 0; i < 11; i++) {
			const img = document.createElement("img");
			img.src = star.src;
			img.alt = "";
			img.classList.add(
				"decoration-star",
				`decoration-star--${star.name}`,
				`decoration-star--${star.name}-${i}`,
			);
			starElements.push(img);
		}
	});

	return starElements;
}
