import "./styles/style.css";
import { renderModeSelect, renderShipPlacement } from "./DOM.js";
import { initSpriteAnimations, blinkElement } from "./animation.js";
import { initShipRotation, initShipTrayLayout } from "./placement.js";

let stopCurrentAnimations = null;

function mount(container) {
	if (stopCurrentAnimations) {
		stopCurrentAnimations();
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
	const container = renderShipPlacement("PLAYER 1", 1);
	mount(container);
	initShipTrayLayout(container);
	initShipRotation(container);
}

startApp();