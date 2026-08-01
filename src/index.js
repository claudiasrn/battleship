import "./styles/style.css";
import {
	renderModeSelect,
	renderShipPlacement,
	renderSwitch,
	renderBattle,
} from "./DOM.js";
import { initSpriteAnimations, blinkElement } from "./animation.js";
import {
	initShipRotation,
	initShipTrayLayout,
	initShipDragging,
	randomizeShipPlacement,
	isFleetPlaced,
	placeFleetRandomly,
} from "./placement.js";
import { Gameboard } from "./Gameboard.js";

let stopCurrentAnimations = null;
let stopCurrentInteractions = null;
const playerOneBoard = new Gameboard();
const playerTwoBoard = new Gameboard();

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
	renderPlayerShipPlacement(1, "PLAYER 1", playerOneBoard, () => {
		if (gameMode === "bot") {
			placeFleetRandomly(playerTwoBoard);
			startBattle(gameMode, 1);
		} else {
			renderPlayerShipPlacement(2, "PLAYER 2", playerTwoBoard, () => {
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
		startBattle(gameMode, 1);
	});
}

function startBattle(gameMode, activePlayerNumber) {
	const ownBoard = activePlayerNumber === 1 ? playerOneBoard : playerTwoBoard;
	const enemyBoard = activePlayerNumber === 1 ? playerTwoBoard : playerOneBoard;

	const container = renderBattle(
		activePlayerNumber,
		gameMode,
		ownBoard.getShipBoard(),
		ownBoard.getAttackBoard(),
		enemyBoard.getShipBoard(),
		enemyBoard.getAttackBoard(),
	);
	mount(container);
}

startApp();
