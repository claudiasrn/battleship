import { Ship } from '../Ship.js';

test('ship is not sunk when created', () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test('ship is not sunk after fewer hits than its length', () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

test('ship is sunk after hits equal to its length', () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});