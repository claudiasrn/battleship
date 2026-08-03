import backgroundMusicSrc from "./assets/audio/background.wav";
import clickSrc from "./assets/audio/click.wav";
import hoverSrc from "./assets/audio/hover.wav";
import gameStartSrc from "./assets/audio/game-start.wav";
import hitSrc from "./assets/audio/hit-sound.wav";
import missSrc from "./assets/audio/miss-sound.mp3";
import shipDestroyedSrc from "./assets/audio/ship-destroyed.flac";
import victorySrc from "./assets/audio/victory.mp3";
import defeatSrc from "./assets/audio/defeat.mp3";
import shipSnapSrc from "./assets/audio/ship-snap.mp3";
import shipRejectedSrc from "./assets/audio/ship-rejected.mp3";

const backgroundMusic = new Audio(backgroundMusicSrc);
backgroundMusic.loop = true;

let hasStarted = false;

export function initBackgroundMusic() {
	if (hasStarted) return;
	hasStarted = true;

	const startOnFirstClick = () => {
		backgroundMusic.play();
		document.removeEventListener("click", startOnFirstClick);
	};

	document.addEventListener("click", startOnFirstClick);
}

export function initButtonClickSounds() {
	document.addEventListener("pointerdown", (event) => {
		if (event.target.closest("button, .floating-ship, .ship-placement-mode .cell-ship-sprite")) {
			new Audio(clickSrc).play().catch(() => {});
		}
	});
}

export function initButtonHoverSounds() {
	document.addEventListener("mouseover", (event) => {
		const target = event.target.closest("button");
		if (!target || target.disabled) return;
		if (target.contains(event.relatedTarget)) return;

		new Audio(hoverSrc).play().catch(() => {});
	});
}

export function playGameStart() {
	new Audio(gameStartSrc).play().catch(() => {});
}

export function playAttackResult(hit) {
	const src = hit ? hitSrc : missSrc;
	new Audio(src).play().catch(() => {});
}

export function playShipDestroyed() {
	new Audio(shipDestroyedSrc).play().catch(() => {});
}

export function playResultMusic(gameMode, didPlayerWin) {
	const isDefeat = gameMode === "bot" && !didPlayerWin;
	const src = isDefeat ? defeatSrc : victorySrc;
	new Audio(src).play().catch(() => {});
}

export function playShipSnap() {
	const audio = new Audio(shipSnapSrc);
	audio.playbackRate = 2;
	audio.play().catch(() => {});
}

export function playShipRejected() {
	new Audio(shipRejectedSrc).play().catch(() => {});
}