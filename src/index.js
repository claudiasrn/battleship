import "./styles/style.css";
import {
	renderModeSelect,
	renderShipPlacement,
	renderSwitch,
	renderBattle,
	renderResults,
} from "./DOM.js";
import { initSpriteAnimations, blinkElement } from "./animation.js";
import {
	initBackgroundMusic,
	initButtonClickSounds,
	initButtonHoverSounds,
	playGameStart,
	playAttackResult,
	playShipDestroyed,
	playResultMusic,
} from "./audio.js";
import {
	initShipRotation,
	initShipTrayLayout,
	initShipDragging,
	randomizeShipPlacement,
	isFleetPlaced,
	placeFleetRandomly,
} from "./placement.js";
import { Player } from "./Player.js";
import { BotAI } from "./Bot.js";

let stopCurrentAnimations = null;
let stopCurrentInteractions = null;
let playerOne = new Player("human");
let playerTwo = new Player("human");
let botAI = null;

function mount(container) {
	if (stopCurrentAnimations) {
		stopCurrentAnimations();
	}
	if (stopCurrentInteractions) {
		stopCurrentInteractions();
		stopCurrentInteractions = null;
	}
	document.body.innerHTML = "";
	document.body.appendChild(container);
	stopCurrentAnimations = initSpriteAnimations(container);
}

function startApp() {
	playerOne = new Player("human");
	playerTwo = new Player("human");

	const container = renderModeSelect();
	mount(container);

	const blinkTarget = container.querySelector(".prompt-selection-text > div");
	if (blinkTarget) {
		blinkElement(blinkTarget);
	}

	const modeButtons = container.querySelectorAll(".mode-buttons button");
	modeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			startShipPlacement(button.dataset.mode);
		});
	});
}

function startShipPlacement(gameMode) {
	if (gameMode === "bot") {
		playerTwo.type = "bot";
	}

	renderPlayerShipPlacement(1, "PLAYER 1", playerOne.gameboard, () => {
		if (gameMode === "bot") {
			placeFleetRandomly(playerTwo.gameboard);
			botAI = new BotAI();
			playGameStart();
			startBattle(gameMode, 1);
		} else {
			renderPlayerShipPlacement(2, "PLAYER 2", playerTwo.gameboard, () => {
				startSwitchScreen(gameMode);
			});
		}
	});
}

function renderPlayerShipPlacement(
	playerNumber,
	playerName,
	gameboard,
	onReady,
) {
	const container = renderShipPlacement(playerName, playerNumber);
	mount(container);
	initShipTrayLayout(container);
	initShipRotation(container, gameboard);
	initShipDragging(container, gameboard);

	const randomizeButton = container.querySelector(".randomize-fleet-button");
	const confirmButton = container.querySelector(".confirm-button");

	randomizeButton.addEventListener("click", () => {
		randomizeShipPlacement(container, gameboard);
	});

	const updateConfirmState = () => {
		confirmButton.disabled = !isFleetPlaced();
	};
	updateConfirmState();

	const observer = new MutationObserver(updateConfirmState);
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ["class"],
		subtree: true,
	});
	stopCurrentInteractions = () => observer.disconnect();

	confirmButton.addEventListener("click", () => {
		if (confirmButton.disabled) return;
		onReady();
	});
}

function startSwitchScreen(gameMode) {
	const container = renderSwitch("PLAYER 1", 1);
	mount(container);

	const confirmButton = container.querySelector("button");
	confirmButton.addEventListener("click", () => {
		playGameStart();
		startBattle(gameMode, 1);
	});
}

function startSwitchToNextTurn(gameMode, nextPlayerNumber) {
	const playerName = nextPlayerNumber === 2 ? "PLAYER 2" : "PLAYER 1";
	const container = renderSwitch(playerName, nextPlayerNumber);
	mount(container);

	const confirmButton = container.querySelector("button");
	confirmButton.addEventListener("click", () => {
		startBattle(gameMode, nextPlayerNumber);
	});
}

const ATTACK_FRAMES = {
	player1: 3,
	player2: 3,
	bot: 4,
};
const FRAME_DELAY = 300;

function getAttackerOwner(gameMode, activePlayerNumber) {
	if (gameMode === "bot" && activePlayerNumber !== 1) return "bot";
	return activePlayerNumber === 2 ? "player2" : "player1";
}

function getTurnTransitionDelay(gameMode, activePlayerNumber) {
	const owner = getAttackerOwner(gameMode, activePlayerNumber);
	return ATTACK_FRAMES[owner] * FRAME_DELAY + 200;
}

function getAttackCharacterStates(gameMode, activePlayerNumber, hit) {
	const attackerIsBot = gameMode === "bot" && activePlayerNumber === 2;

	if (attackerIsBot) {
		return { yours: hit ? "hurt" : "idle", enemy: "attack" };
	}
	return { yours: "attack", enemy: hit ? "hurt" : "idle" };
}

const BOT_THINK_DELAY = 800;

function startBattle(
	gameMode,
	activePlayerNumber,
	characterStates = { yours: "idle", enemy: "idle" },
	locked = false,
) {
	const ownBoard =
		gameMode === "bot"
			? playerOne.gameboard
			: activePlayerNumber === 1
				? playerOne.gameboard
				: playerTwo.gameboard;
	const enemyBoard =
		gameMode === "bot"
			? playerTwo.gameboard
			: activePlayerNumber === 1
				? playerTwo.gameboard
				: playerOne.gameboard;

	const container = renderBattle(
		activePlayerNumber,
		gameMode,
		ownBoard.getShipBoard(),
		ownBoard.getAttackBoard(),
		enemyBoard.getShipBoard(),
		enemyBoard.getAttackBoard(),
		characterStates,
	);
	mount(container);

	if (locked) return;

	const isBotTurn = gameMode === "bot" && activePlayerNumber === 2;
	if (isBotTurn) {
		setTimeout(() => performBotTurn(gameMode), BOT_THINK_DELAY);
		return;
	}

	const enemyGrid = container.querySelector(".grid--enemy");
	enemyGrid.querySelectorAll(".grid-element").forEach((cell) => {
		if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
			return;
		}

		cell.addEventListener("click", () => {
			const row = Number(cell.dataset.row);
			const col = Number(cell.dataset.col);
			resolveAttack(gameMode, activePlayerNumber, [row, col]);
		});
	});
}

function performBotTurn(gameMode) {
	const coordinate = botAI.chooseAttack();
	resolveAttack(gameMode, 2, coordinate, true);
}

function resolveAttack(
	gameMode,
	activePlayerNumber,
	coordinate,
	isBotAttack = false,
) {
	const enemyBoard =
		activePlayerNumber === 1 ? playerTwo.gameboard : playerOne.gameboard;
	const result = enemyBoard.receiveAttack(coordinate);
	if (result === undefined) return;

	const hit = result === "x";
	playAttackResult(hit);

	const [row, col] = coordinate;
	const shipCell = hit ? enemyBoard.getShipBoard()[row][col] : null;

	if (shipCell && shipCell.isSunk()) {
		playShipDestroyed();
	}

	if (isBotAttack) {
		botAI.registerResult(coordinate, hit, shipCell);
	}

	startBattle(
		gameMode,
		activePlayerNumber,
		getAttackCharacterStates(gameMode, activePlayerNumber, hit),
		true,
	);

	setTimeout(
		() => {
			if (enemyBoard.isOver()) {
				finishBattle(gameMode, activePlayerNumber);
				return;
			}

			if (hit) {
				startBattle(gameMode, activePlayerNumber);
				return;
			}

			const nextPlayerNumber = activePlayerNumber === 1 ? 2 : 1;

			if (gameMode === "bot") {
				startBattle(gameMode, nextPlayerNumber);
			} else {
				startSwitchToNextTurn(gameMode, nextPlayerNumber);
			}
		},
		getTurnTransitionDelay(gameMode, activePlayerNumber),
	);
}

function finishBattle(gameMode, winnerNumber) {
	const winnerName = winnerNumber === 2 ? "PLAYER 2" : "PLAYER 1";
	const didPlayerWin = winnerNumber === 1;

	playResultMusic(gameMode, didPlayerWin);

	const container = renderResults(
		gameMode,
		didPlayerWin,
		winnerName,
		winnerNumber,
	);
	mount(container);

	const playAgainButton = container.querySelector("button");
	playAgainButton.addEventListener("click", () => {
		startApp();
	});
}

initBackgroundMusic();
initButtonClickSounds();
initButtonHoverSounds();
startApp();
