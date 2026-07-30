const CELL_SIZE = 50;

const SHIP_LENGTHS = {
	"saturn-v": 5,
	"falcon-heavy": 4,
	falcon9: 3,
	voyager: 3,
	sputnik: 2,
};

export function initShipTrayLayout(root) {
	const ships = root.querySelectorAll(".ships .floating-ship");
	let currentTop = 0;
	ships.forEach((ship) => {
		ship.style.top = `${currentTop}px`;
		ship.style.left = "0px";
		currentTop += 70;
	});
}

export function initShipRotation(root) {
	const floatingShips = root.querySelectorAll(".floating-ship");

	floatingShips.forEach((ship) => {
		ship.addEventListener("click", (event) => {
			if (ship.dataset.wasDragged === "true") {
				ship.dataset.wasDragged = "false";
				return;
			}

			const isHorizontal = ship.classList.contains("horizontal");

			ship.classList.toggle("horizontal", !isHorizontal);
			ship.classList.toggle("vertical", isHorizontal);
			ship.dataset.orientation = isHorizontal ? "vertical" : "horizontal";

			recenterOnPoint(ship, event.clientX, event.clientY);
		});
	});
}

export function initShipDragging(root) {
	const floatingShips = root.querySelectorAll(".floating-ship");
	const DRAG_THRESHOLD = 2;

	let activeShip = null;
	let dragMoved = false;
	let startX = 0;
	let startY = 0;

	floatingShips.forEach((ship) => {
		ship.addEventListener("pointerdown", (event) => {
            event.preventDefault();
			activeShip = ship;
			dragMoved = false;
			startX = event.clientX;
			startY = event.clientY;
			ship.setPointerCapture(event.pointerId);
		});
	});

	document.addEventListener("pointermove", (event) => {
		if (!activeShip) return;

		if (!dragMoved) {
			const dx = event.clientX - startX;
			const dy = event.clientY - startY;
			if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

			dragMoved = true;
			activeShip.classList.add("dragging");
			activeShip.style.position = "fixed";
		}

		recenterOnPoint(activeShip, event.clientX, event.clientY);
	});

	document.addEventListener("pointerup", () => {
		if (!activeShip) return;
		const ship = activeShip;
		activeShip = null;
		ship.classList.remove("dragging");

		if (dragMoved) {
			ship.dataset.wasDragged = "true";
		}

		// next step: snap to nearest grid cell here
	});
}

function getShipDimensions(ship) {
	const shipName = ship.dataset.shipName;
	const length = SHIP_LENGTHS[shipName];

	return {
		width: length * CELL_SIZE,
		height: CELL_SIZE,
	};
}

function recenterOnPoint(ship, clientX, clientY) {
	ship.style.position = "fixed";

	const { width, height } = getShipDimensions(ship);

	ship.style.left = `${clientX - width / 2}px`;
	ship.style.top = `${clientY - height / 2}px`;
}
