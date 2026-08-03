# Starfall

A browser-based Battleship game with drag-and-drop fleet deployment, an adaptive AI opponent, and a full sci-fi audio/visual layer — built as part of [The Odin Project](https://www.theodinproject.com/) curriculum, following a test-driven development approach.

## Features

**Core gameplay**
- Classic Battleship rules: place your fleet, take turns attacking, sink the enemy fleet to win
- Two game modes: **vs Bot** (single player against an AI) and **vs Human** (local pass-and-play)
- A "pass the device" screen between turns in 2-player mode so opponents don't see each other's boards

**Fleet deployment**
- Drag-and-drop ship placement with snap-to-grid
- Click a ship to rotate it, including ships already placed on the grid
- One-click fleet randomization
- Placement instructions panel walking through how to deploy

**AI opponent**
- Random search until a hit lands, then hunts the surrounding cells until the ship is sunk
- Never repeats an already-attacked coordinate

**Audio**
- Looping background music, started on first interaction to respect browser autoplay policies
- Sound effects for button/ship clicks and hovers, ship snap/rejected placement, game start, hits, misses, ship sinking, and victory/defeat

**Polish**
- Animated pixel-art sprites for characters and ships
- Themed UI across every screen (mode select, placement, battle, turn switch, results)

## Tech stack

- Vanilla JavaScript (ES modules), no framework
- Webpack for bundling and dev server
- Jest + Babel for unit testing

## Project structure

```
src/
├── index.js         # App orchestrator: screen transitions, turn state, game flow
├── DOM.js            # Pure rendering — builds each screen's DOM tree
├── placement.js       # Ship placement interactions: drag, snap, rotate, randomize
├── animation.js       # Sprite frame animation and blink effects
├── audio.js           # Background music and sound effect playback
├── Gameboard.js        # Board state: ship placement, attacks, win detection
├── Ship.js             # Ship state: hit tracking, sunk detection
├── Player.js           # Wraps a player's type and Gameboard
├── Bot.js              # AI opponent targeting logic
├── template.html        # HTML template
├── styles/style.css      # All styling
└── assets/            # Images, sprites, fonts, audio
```

## Testing

Ship, Gameboard, Player, and Bot are covered by unit tests, following the assignment's TDD approach. DOM manipulation and interaction logic (placement.js, DOM.js) are intentionally left untested per the assignment scope, since UI testing tools are outside this unit's curriculum.

## Acknowledgments

Built as a project for [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.