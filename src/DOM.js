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
import attackPlayer1Src from "./assets/images/characters/player1/AttackPlayer1.png";
import attackPlayer2Src from "./assets/images/characters/player2/AttackPlayer2.png";
import deathPlayer1Src from "./assets/images/characters/player1/DeathPlayer1.png";
import hurtPlayer1Src from "./assets/images/characters/player1/HurtPlayer1.png";
import hurtPlayer2Src from "./assets/images/characters/player2/HurtPlayer2.png";
import attackBotSrc from "./assets/images/characters/bot/AttackBot.png";
import hurtBotSrc from "./assets/images/characters/bot/HurtBot.png";

const shipSprites = {
	"saturn-v": saturnVSrc,
	"falcon-heavy": falconHeavySrc,
	falcon9: falcon9Src,
	voyager: voyagerSrc,
	sputnik: sputnikSrc,
};

// Sprite data per character "owner" and behavioral state. `hurt` currently
// falls back to idle since no dedicated hurt sprite exists yet — swap in
// real Hurt*.png imports here once available (same shape as attack/idle).
const CHARACTER_SPRITES = {
	player1: {
		idle: { src: player1IdleSrc, frameCount: 4, loop: true },
		attack: { src: attackPlayer1Src, frameCount: 9, loop: false },
		hurt: { src: hurtPlayer1Src, frameCount: 2, loop: true },
	},
	player2: {
		idle: { src: player2IdleSrc, frameCount: 4, loop: true },
		attack: { src: attackPlayer2Src, frameCount: 6, loop: false },
		hurt: { src: hurtPlayer2Src, frameCount: 2, loop: true },
	},
	bot: {
		idle: { src: botIdleSrc, frameCount: 4, loop: true },
		attack: { src: attackBotSrc, frameCount: 4, loop: false },
		hurt: { src: hurtBotSrc, frameCount: 2, loop: true },
	},
};

function getCharacterOwner(activePlayerNumber, gameMode, isEnemySlot) {
	if (gameMode === "bot") {
		return isEnemySlot ? "bot" : "player1";
	}
	if (!isEnemySlot) {
		return activePlayerNumber === 2 ? "player2" : "player1";
	}
	return activePlayerNumber === 2 ? "player1" : "player2";
}

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
		"bot",
	);

	const humanButton = createModeButton(
		"VS HUMAN",
		"Play locally against another person, taking turns on this device",
		player2IdleSrc,
		"human",
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

function createModeButton(title, description, imgSrc, mode) {
	const button = document.createElement("button");
	button.dataset.mode = mode;

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

	const boardSpacer = document.createElement("div");
	boardSpacer.classList.add("board-spacer");

	const grid = document.createElement("div");
	grid.classList.add("grid");

	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 10; col++) {
			const gridElement = document.createElement("div");
			gridElement.classList.add("grid-element");
			gridElement.dataset.row = row;
			gridElement.dataset.col = col;
			grid.append(gridElement);
		}
	}

	const ships = createPlacementShips();

	board.append(boardSpacer, grid, ships);

	const confirmButton = document.createElement("button");
	confirmButton.textContent = "READY FOR GALACTIC BATTLE";
	confirmButton.classList.add("confirm-button");

	const randomizeButton = document.createElement("button");
	randomizeButton.textContent = "RANDOMIZE FLEET";
	randomizeButton.classList.add("randomize-fleet-button");

	const buttonGroup = document.createElement("div");
	buttonGroup.classList.add("button-group");
	buttonGroup.append(confirmButton, randomizeButton);

	const decoration = createShipPlacementDecoration();

	container.append(header, board, buttonGroup, decoration);

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
			img.draggable = false;
			img.src = ship.src;
			img.alt = ship.name;
			img.classList.add(
				"floating-ship",
				`floating-ship--${ship.name}`,
				"horizontal",
			);
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
	characterStates = { yours: "idle", enemy: "idle" },
) {
	const container = document.createElement("div");
	container.classList.add("battle-mode");

	const yourSide = createBoardSide(
		"YOUR FLEET",
		true,
		ownShipBoard,
		ownAttackBoard,
	);

	const characters = createCharacters(
		activePlayerNumber,
		gameMode,
		characterStates,
	);

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

function createCharacters(activePlayerNumber, gameMode, characterStates) {
	const characters = document.createElement("div");
	characters.classList.add("characters");

	const yourOwner = getCharacterOwner(activePlayerNumber, gameMode, false);
	const enemyOwner = getCharacterOwner(activePlayerNumber, gameMode, true);

	const you = createCharacterSlot("YOU", yourOwner, characterStates.yours);
	const enemy = createCharacterSlot("ENEMY", enemyOwner, characterStates.enemy);

	characters.append(you, enemy);

	return characters;
}

function createCharacterSlot(label, owner, state) {
	const slot = document.createElement("div");
	slot.classList.add("character-slot");

	const { src, frameCount, loop } = CHARACTER_SPRITES[owner][state];

	const img = document.createElement("img");
	img.src = src;
	img.alt = "";
	img.classList.add("battle-character");
	img.dataset.spriteFrames = frameCount;
	img.dataset.frameWidth = 48;
	img.dataset.frameHeight = 48;
	img.dataset.state = state;
	img.dataset.loop = loop ? "true" : "false";

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

export function renderSwitch(playerName, playerNumber) {
	const container = document.createElement("div");
	container.classList.add("switch-mode");

	const subtitle = document.createElement("p");
	subtitle.textContent = "PASS THE DEVICE";

	const heading = document.createElement("h2");
	heading.textContent = `${playerName}'S TURN`;

	const characterImg = document.createElement("img");
	characterImg.src = playerNumber === 2 ? player2IdleSrc : player1IdleSrc;
	characterImg.alt = "";
	characterImg.dataset.spriteFrames = 4;
	characterImg.dataset.frameWidth = 48;
	characterImg.dataset.frameHeight = 48;

	const confirmButton = document.createElement("button");
	confirmButton.textContent = "I'M READY";

	const decoration = createSwitchDecoration();

	container.append(subtitle, heading, characterImg, confirmButton, decoration);

	return container;
}

function createSwitchDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	decoration.append(...createStarField());

	return decoration;
}

export function renderResults(
	gameMode,
	didPlayerWin,
	winnerName,
	winnerNumber,
) {
	const container = document.createElement("div");
	container.classList.add("results-mode");

	const subtitle = document.createElement("p");
	subtitle.textContent = "GALACTIC BATTLE COMPLETE";

	const heading = document.createElement("h2");
	heading.textContent =
		gameMode === "bot"
			? didPlayerWin
				? "YOU WIN"
				: "YOU LOSE"
			: `${winnerName} WINS`;

	const { src, frameCount } = getResultCharacter(
		gameMode,
		didPlayerWin,
		winnerNumber,
	);

	const characterImg = document.createElement("img");
	characterImg.src = src;
	characterImg.alt = "";
	characterImg.classList.add("results-character");
	characterImg.dataset.spriteFrames = frameCount;
	characterImg.dataset.frameWidth = 48;
	characterImg.dataset.frameHeight = 48;
	if (gameMode === "bot" && !didPlayerWin) {
		characterImg.dataset.loop = "false";
	}

	const playAgainButton = document.createElement("button");
	playAgainButton.textContent = "PLAY AGAIN";

	const decoration = createResultsDecoration();

	container.append(
		subtitle,
		heading,
		characterImg,
		playAgainButton,
		decoration,
	);

	return container;
}

function getResultCharacter(gameMode, didPlayerWin, winnerNumber) {
	if (gameMode === "bot") {
		if (didPlayerWin) {
			return winnerNumber === 2
				? { src: attackPlayer2Src, frameCount: 6 }
				: { src: attackPlayer1Src, frameCount: 9 };
		}
		return winnerNumber === 2
			? { src: deathPlayer2Src, frameCount: 6 }
			: { src: deathPlayer1Src, frameCount: 6 };
	}

	return winnerNumber === 2
		? { src: attackPlayer2Src, frameCount: 6 }
		: { src: attackPlayer1Src, frameCount: 9 };
}

function createResultsDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	decoration.append(...createStarField());

	return decoration;
}
