export function animateSprite(
	imgElement,
	frameCount,
	frameWidth,
	frameHeight,
	frameDelay = 300,
	loop = true,
) {
	let currentFrame = 0;
	let timeoutId = null;

	function playNextFrame() {
		if (!document.body.contains(imgElement)) {
			return;
		}
		imgElement.style.objectPosition = `-${currentFrame * frameWidth}px 0`;

		if (currentFrame >= frameCount - 1 && !loop) {
			return;
		}

		currentFrame = (currentFrame + 1) % frameCount;
		timeoutId = setTimeout(playNextFrame, frameDelay);
	}

	playNextFrame();

	return function stop() {
		clearTimeout(timeoutId);
	};
}
export function initSpriteAnimations(root) {
	const stopFns = [];
	root.querySelectorAll('[data-sprite-frames]').forEach(img => {
		const shouldLoop = img.dataset.loop !== 'false';
		const stop = animateSprite(
			img,
			Number(img.dataset.spriteFrames),
			Number(img.dataset.frameWidth),
			Number(img.dataset.frameHeight),
			300,
			shouldLoop,
		);
		stopFns.push(stop);
	});
	return function stopAll() {
		stopFns.forEach(stop => stop());
	};
}

export function blinkElement(element, interval = 500) {
	let timeoutId = null;

	function toggle() {
		if (!document.body.contains(element)) {
			return;
		}
		element.style.visibility =
			element.style.visibility === "hidden" ? "visible" : "hidden";
		timeoutId = setTimeout(toggle, interval);
	}

	toggle();

	return function stop() {
		clearTimeout(timeoutId);
	};
}
