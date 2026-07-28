import hitMarkerSrc from "./assets/images/markers/hit-marker.png";
import player1IdleSrc from "./assets/images/characters/player1/IdlePlayer1.png";
import botIdleSrc from "./assets/images/characters/bot/IdleBot.png";
import player2IdleSrc from "./assets/images/characters/player2/IdlePlayer2.png";
import saturnVSrc from "./assets/images/ships/Saturn-V-moving.png";
import falconHeavySrc from "./assets/images/ships/Falcon-Heavy-moving.png";
import sputnikSrc from "./assets/images/ships/Sputnik-moving.png";
import starDotSrc from "./assets/images/decoration/star-dot.png";
import starLargeSrc from "./assets/images/decoration/star-large.png";
import starSparkleSrc from "./assets/images/decoration/star-sparkle.png";

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

	const decoration = createDecoration();

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

function createDecoration() {
	const decoration = document.createElement("div");
	decoration.classList.add("decoration");

	const ships = [
		{ src: saturnVSrc, name: "saturn-v" },
		{ src: falconHeavySrc, name: "falcon-heavy" },
		{ src: sputnikSrc, name: "sputnik" },
	];

	ships.forEach((ship) => {
		const img = document.createElement("img");
		img.src = ship.src;
		img.alt = "";
		img.classList.add("decoration-ship", `decoration-ship--${ship.name}`);
		decoration.append(img);
	});

	const stars = [
		{ src: starDotSrc, name: "dot" },
		{ src: starLargeSrc, name: "large" },
		{ src: starSparkleSrc, name: "sparkle" },
	];

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
			decoration.append(img);
		}
	});

	return decoration;
}
