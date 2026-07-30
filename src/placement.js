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
			const isHorizontal = ship.classList.contains("horizontal");

			ship.classList.toggle("horizontal", !isHorizontal);
			ship.classList.toggle("vertical", isHorizontal);
			ship.dataset.orientation = isHorizontal ? "vertical" : "horizontal";

			recenterAfterRotation(ship, event.clientX, event.clientY);
		});
	});
}

function recenterAfterRotation(ship, clientX, clientY) {
	ship.style.position = "fixed";

	const shipName = ship.dataset.shipName;
	const length = SHIP_LENGTHS[shipName];
    
	const width = length * CELL_SIZE;
	const height = CELL_SIZE;

	ship.style.left = `${clientX - width / 2}px`;
	ship.style.top = `${clientY - height / 2}px`;
}
