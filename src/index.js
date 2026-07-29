import "./styles/style.css";
import { renderModeSelect } from "./DOM.js";
import { initSpriteAnimations, blinkElement } from "./animation.js";

function startApp() {
	document.body.innerHTML = "";

	const container = renderModeSelect();
	document.body.appendChild(container);
	initSpriteAnimations(container);

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
	console.log("starting ship placement, mode:", gameMode);
}

startApp();