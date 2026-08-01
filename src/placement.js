const CELL_SIZE = 50;

const SHIP_LENGTHS = {
	"saturn-v": 5,
	"falcon-heavy": 4,
	falcon9: 3,
	voyager: 3,
	sputnik: 2,
};

const FLEET_COMPOSITION = [
	{ name: "saturn-v", length: 5, count: 1 },
	{ name: "falcon-heavy", length: 4, count: 2 },
	{ name: "falcon9", length: 3, count: 2 },
	{ name: "voyager", length: 3, count: 2 },
	{ name: "sputnik", length: 2, count: 3 },
];

export function isFleetPlaced() {
	return document.querySelectorAll(".floating-ship").length === 0;
}

export function initShipTrayLayout(root) {
	const ships = root.querySelectorAll(".ships .floating-ship");
	let currentTop = 0;
	ships.forEach((ship) => {
		ship.style.top = `${currentTop}px`;
		ship.style.left = "0px";
		currentTop += 70;
	});
}

export function initShipRotation(root, gameboard) {
	const floatingShips = root.querySelectorAll(".floating-ship");
	const grid = root.querySelector(".grid");

	floatingShips.forEach((ship) => {
		ship.addEventListener("click", (event) => {
			if (ship.dataset.wasDragged === "true") {
				ship.dataset.wasDragged = "false";
				return;
			}

			const previousPlacement = shipPlacements.get(ship);
			const isHorizontal = ship.classList.contains("horizontal");

			ship.classList.toggle("horizontal", !isHorizontal);
			ship.classList.toggle("vertical", isHorizontal);
			ship.dataset.orientation = isHorizontal ? "vertical" : "horizontal";

			if (previousPlacement) {
				const rotated = rotateSnappedShip(
					ship,
					grid,
					gameboard,
					previousPlacement,
				);
				if (!rotated) {
					ship.classList.toggle("horizontal", isHorizontal);
					ship.classList.toggle("vertical", !isHorizontal);
					ship.dataset.orientation = isHorizontal ? "horizontal" : "vertical";
				}
			} else {
				recenterOnPoint(ship, event.clientX, event.clientY);
			}
		});
	});
}

export function initShipDragging(root, gameboard) {
	const floatingShips = root.querySelectorAll(".floating-ship");
	const grid = root.querySelector(".grid");
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
			detachFromGrid(activeShip);
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
			attemptSnap(ship, grid, gameboard);
			setTimeout(() => {
				ship.dataset.wasDragged = "false";
			}, 0);
		}
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

const shipPlacements = new WeakMap();

function attemptSnap(ship, grid, gameboard) {
	const shipName = ship.dataset.shipName;
	const shipLength = Number(ship.dataset.shipLength);

	const gridRect = grid.getBoundingClientRect();
	const shipRect = ship.getBoundingClientRect();

	const overlapsGrid =
		shipRect.right > gridRect.left &&
		shipRect.left < gridRect.right &&
		shipRect.bottom > gridRect.top &&
		shipRect.top < gridRect.bottom;

	const previousPlacement = shipPlacements.get(ship);
	if (previousPlacement) {
		gameboard.removeShip(previousPlacement.placedShip);
		setCellsHighlighted(
			grid,
			previousPlacement.row,
			previousPlacement.col,
			shipLength,
			previousPlacement.isHorizontal,
			false,
		);
		shipPlacements.delete(ship);
	}

	if (!overlapsGrid) {
		return;
	}

	const { originX, originY, cellWidth, cellHeight } = getGridMetrics(grid);
	const isHorizontal = ship.classList.contains("horizontal");

	const { row, col } = getSnappedCell(
		ship,
		originX,
		originY,
		cellWidth,
		cellHeight,
		isHorizontal,
		shipLength,
	);

	const coordinates = getCoveredCoordinates(row, col, shipLength, isHorizontal);
	const placedShip = gameboard.placeShip(coordinates, shipName);

	if (placedShip) {
		positionShipOnGrid(ship, grid, row, col, shipLength, isHorizontal);
		shipPlacements.set(ship, { placedShip, row, col, isHorizontal });
		return;
	}

	if (previousPlacement) {
		const restoredShip = gameboard.placeShip(
			getCoveredCoordinates(
				previousPlacement.row,
				previousPlacement.col,
				shipLength,
				previousPlacement.isHorizontal,
			),
			shipName,
		);
		positionShipOnGrid(
			ship,
			grid,
			previousPlacement.row,
			previousPlacement.col,
			shipLength,
			previousPlacement.isHorizontal,
		);
		shipPlacements.set(ship, {
			placedShip: restoredShip,
			row: previousPlacement.row,
			col: previousPlacement.col,
			isHorizontal: previousPlacement.isHorizontal,
		});
	} else {
		pushOutsideGrid(ship, gridRect);
	}
}

function rotateSnappedShip(ship, grid, gameboard, previousPlacement) {
	const shipName = ship.dataset.shipName;
	const shipLength = Number(ship.dataset.shipLength);
	const isHorizontal = ship.classList.contains("horizontal");

	gameboard.removeShip(previousPlacement.placedShip);
	setCellsHighlighted(
		grid,
		previousPlacement.row,
		previousPlacement.col,
		shipLength,
		previousPlacement.isHorizontal,
		false,
	);
	shipPlacements.delete(ship);

	let { row, col } = getPivotedStart(
		previousPlacement.row,
		previousPlacement.col,
		shipLength,
		previousPlacement.isHorizontal,
		isHorizontal,
	);

	if (isHorizontal) {
		col = clamp(col, 0, 10 - shipLength);
		row = clamp(row, 0, 9);
	} else {
		row = clamp(row, 0, 10 - shipLength);
		col = clamp(col, 0, 9);
	}

	const coordinates = getCoveredCoordinates(row, col, shipLength, isHorizontal);
	const placedShip = gameboard.placeShip(coordinates, shipName);

	if (placedShip) {
		positionShipOnGrid(ship, grid, row, col, shipLength, isHorizontal);
		shipPlacements.set(ship, { placedShip, row, col, isHorizontal });
		return true;
	}

	const restoredShip = gameboard.placeShip(
		getCoveredCoordinates(
			previousPlacement.row,
			previousPlacement.col,
			shipLength,
			previousPlacement.isHorizontal,
		),
		shipName,
	);
	positionShipOnGrid(
		ship,
		grid,
		previousPlacement.row,
		previousPlacement.col,
		shipLength,
		previousPlacement.isHorizontal,
	);
	shipPlacements.set(ship, {
		placedShip: restoredShip,
		row: previousPlacement.row,
		col: previousPlacement.col,
		isHorizontal: previousPlacement.isHorizontal,
	});
	return false;
}

function getSnappedCell(
	ship,
	originX,
	originY,
	cellWidth,
	cellHeight,
	isHorizontal,
	shipLength,
) {
	const left = parseFloat(ship.style.left) || 0;
	const top = parseFloat(ship.style.top) || 0;
	const width = ship.offsetWidth;
	const height = ship.offsetHeight;

	const centerX = left + width / 2;
	const centerY = top + height / 2;

	const startX = isHorizontal ? left : centerX;
	const startY = isHorizontal ? centerY : centerY - width / 2;

	let col = Math.round((startX - originX) / cellWidth - 0.5);
	let row = Math.round((startY - originY) / cellHeight - 0.5);

	if (isHorizontal) {
		col = clamp(col, 0, 10 - shipLength);
		row = clamp(row, 0, 9);
	} else {
		row = clamp(row, 0, 10 - shipLength);
		col = clamp(col, 0, 9);
	}

	return { row, col };
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max));
}

function pushOutsideGrid(ship, gridRect) {
	const margin = 12;
	const shipRect = ship.getBoundingClientRect();

	const shipCenterX = shipRect.left + shipRect.width / 2;
	const gridCenterX = gridRect.left + gridRect.width / 2;

	const currentLeft = parseFloat(ship.style.left) || 0;

	const dx =
		shipCenterX < gridCenterX
			? gridRect.left - margin - shipRect.right
			: gridRect.right + margin - shipRect.left;

	ship.style.left = `${currentLeft + dx}px`;
}

function getGridMetrics(grid) {
	const firstCell = grid.querySelector(
		'.grid-element[data-row="0"][data-col="0"]',
	);
	const cellRect = firstCell.getBoundingClientRect();

	return {
		originX: cellRect.left,
		originY: cellRect.top,
		cellWidth: cellRect.width,
		cellHeight: cellRect.height,
	};
}

function getRotationPivotIndex(shipLength) {
	if (shipLength === 5) return 2;
	if (shipLength === 4) return 1;
	if (shipLength === 3) return 1;
	return 0;
}

function getPivotedStart(row, col, shipLength, wasHorizontal, isHorizontal) {
	const pivotOffset = getRotationPivotIndex(shipLength);

	const pivotRow = wasHorizontal ? row : row + pivotOffset;
	const pivotCol = wasHorizontal ? col + pivotOffset : col;

	if (isHorizontal) {
		return { row: pivotRow, col: pivotCol - pivotOffset };
	}

	return { row: pivotRow - pivotOffset, col: pivotCol };
}

function getCoveredCoordinates(row, col, shipLength, isHorizontal) {
	const coordinates = [];
	for (let i = 0; i < shipLength; i++) {
		coordinates.push(isHorizontal ? [row, col + i] : [row + i, col]);
	}
	return coordinates;
}

function setCellsHighlighted(
	grid,
	row,
	col,
	shipLength,
	isHorizontal,
	highlighted,
) {
	getCoveredCoordinates(row, col, shipLength, isHorizontal).forEach(
		([r, c]) => {
			const cell = grid.querySelector(
				`.grid-element[data-row="${r}"][data-col="${c}"]`,
			);
			if (cell) cell.classList.toggle("has-ship", highlighted);
		},
	);
}

function positionShipOnGrid(ship, grid, row, col, shipLength, isHorizontal) {
	const shipName = ship.dataset.shipName;
	const targetCell = grid.querySelector(
		`.grid-element[data-row="${row}"][data-col="${col}"]`,
	);
	targetCell.appendChild(ship);

	ship.classList.remove("floating-ship", `floating-ship--${shipName}`);
	ship.classList.add("cell-ship-sprite", `cell-ship-sprite--${shipName}`);

	ship.style.position = "";
	ship.style.left = "";
	ship.style.top = "";

	setCellsHighlighted(grid, row, col, shipLength, isHorizontal, true);
}

function detachFromGrid(ship) {
	const parentCell = ship.parentElement;
	if (!parentCell || !parentCell.classList.contains("grid-element")) return;

	const shipName = ship.dataset.shipName;
	const shipLength = Number(ship.dataset.shipLength);
	const cellRect = parentCell.getBoundingClientRect();
	const isHorizontal = ship.classList.contains("horizontal");

	const grid = parentCell.closest(".grid");
	const previousPlacement = shipPlacements.get(ship);
	if (grid && previousPlacement) {
		setCellsHighlighted(
			grid,
			previousPlacement.row,
			previousPlacement.col,
			shipLength,
			previousPlacement.isHorizontal,
			false,
		);
	}

	ship.classList.remove("cell-ship-sprite", `cell-ship-sprite--${shipName}`);
	ship.classList.add("floating-ship", `floating-ship--${shipName}`);

	const width = ship.offsetWidth;
	const height = ship.offsetHeight;

	document.body.appendChild(ship);
	ship.style.position = "fixed";
	if (isHorizontal) {
		ship.style.left = `${cellRect.left}px`;
		ship.style.top = `${cellRect.top + cellRect.height / 2 - height / 2}px`;
	} else {
		ship.style.left = `${cellRect.left + cellRect.width / 2 - width / 2}px`;
		ship.style.top = `${cellRect.top + cellRect.height / 2 - width / 2}px`;
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function placeShipRandomly(ship, grid, gameboard) {
	const shipName = ship.dataset.shipName;
	const shipLength = Number(ship.dataset.shipLength);
	const MAX_ATTEMPTS = 100;

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const isHorizontal = Math.random() < 0.5;
		const maxRow = isHorizontal ? 9 : 10 - shipLength;
		const maxCol = isHorizontal ? 10 - shipLength : 9;

		const row = Math.floor(Math.random() * (maxRow + 1));
		const col = Math.floor(Math.random() * (maxCol + 1));

		const coordinates = getCoveredCoordinates(row, col, shipLength, isHorizontal);
		const placedShip = gameboard.placeShip(coordinates, shipName);

		if (placedShip) {
			ship.classList.toggle("horizontal", isHorizontal);
			ship.classList.toggle("vertical", !isHorizontal);
			ship.dataset.orientation = isHorizontal ? "horizontal" : "vertical";

			positionShipOnGrid(ship, grid, row, col, shipLength, isHorizontal);
			shipPlacements.set(ship, { placedShip, row, col, isHorizontal });
			return true;
		}
	}

	return false;
}

function tryRandomizeAll(ships, grid, gameboard) {
	ships.forEach((ship) => {
		const placement = shipPlacements.get(ship);
		if (placement) {
			gameboard.removeShip(placement.placedShip);
			setCellsHighlighted(
				grid,
				placement.row,
				placement.col,
				Number(ship.dataset.shipLength),
				placement.isHorizontal,
				false,
			);
			shipPlacements.delete(ship);
		}
	});

	const shuffledShips = shuffle(ships.slice());
	for (const ship of shuffledShips) {
		if (!placeShipRandomly(ship, grid, gameboard)) {
			return false;
		}
	}
	return true;
}

export function randomizeShipPlacement(root, gameboard) {
	const grid = root.querySelector(".grid");
	const ships = Array.from(
		document.querySelectorAll(".floating-ship, .cell-ship-sprite"),
	);

	const OUTER_ATTEMPTS = 50;
	for (let attempt = 0; attempt < OUTER_ATTEMPTS; attempt++) {
		if (tryRandomizeAll(ships, grid, gameboard)) return;
	}
}

function buildFleetList() {
	const fleet = [];
	FLEET_COMPOSITION.forEach(({ name, length, count }) => {
		for (let i = 0; i < count; i++) fleet.push({ name, length });
	});
	return fleet;
}

function placeOneShipRandomly(gameboard, name, length) {
	const MAX_ATTEMPTS = 100;

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const isHorizontal = Math.random() < 0.5;
		const maxRow = isHorizontal ? 9 : 10 - length;
		const maxCol = isHorizontal ? 10 - length : 9;

		const row = Math.floor(Math.random() * (maxRow + 1));
		const col = Math.floor(Math.random() * (maxCol + 1));

		const coordinates = getCoveredCoordinates(row, col, length, isHorizontal);
		const placedShip = gameboard.placeShip(coordinates, name);
		if (placedShip) return placedShip;
	}

	return null;
}

export function placeFleetRandomly(gameboard) {
	const OUTER_ATTEMPTS = 50;
	const fleet = buildFleetList();

	for (let attempt = 0; attempt < OUTER_ATTEMPTS; attempt++) {
		const placedShips = [];
		let success = true;

		for (const { name, length } of shuffle(fleet.slice())) {
			const placedShip = placeOneShipRandomly(gameboard, name, length);
			if (!placedShip) {
				success = false;
				break;
			}
			placedShips.push(placedShip);
		}

		if (success) return true;

		placedShips.forEach((ship) => gameboard.removeShip(ship));
	}

	return false;
}