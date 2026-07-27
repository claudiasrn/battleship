export class Ship {
    #length;
    #timesHit;
    #sunk;

    constructor(length) {
        this.#length = length;
        this.#timesHit = 0;
        this.#sunk = false;
    }

    hit() {
        this.#timesHit++;
    }

    isSunk() {
        if (this.#length <= this.#timesHit) {
            this.#sunk = true;
            return this.#sunk;
        }

        return this.#sunk;
    }
}