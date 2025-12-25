export const gameState = {
    x: 6,
    y: 6,
    inventory: [],
    bodyParts: {
        hands: 2,
        feet: 2
    },
    flags: {
        whimpering_man_helped: false,
        merchant_met: false,
        prisoner_helped: false,
        puzzle_solved: false,
        visited_tiles: []
    }
};

export function addItem(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        updatePlayerInfo();
    }
}

let updatePlayerInfo = () => {};

export function removeItem(item) {
    const index = gameState.inventory.indexOf(item);
    if (index > -1) {
        gameState.inventory.splice(index, 1);
        updatePlayerInfo();
        return true;
    }
    return false;
}

export function hasItem(item) {
    return gameState.inventory.includes(item);
}

export function triggerPlayerInfoUpdate() {
    updatePlayerInfo();
}

export function moveToTile(x, y) {
    gameState.x = x;
    gameState.y = y;
    
    const key = `${x},${y}`;
    if (!gameState.flags.visited_tiles.includes(key)) {
        gameState.flags.visited_tiles.push(key);
    }
    
    updateMapDisplay(gameState.flags.visited_tiles, getCurrentPosition());
}

let updateMapDisplay = () => {};

export function setMapUpdater(fn) {
    updateMapDisplay = fn;
}

export function setPlayerInfoUpdater(fn) {
    updatePlayerInfo = fn;
}

export function getCurrentPosition() {
    return { x: gameState.x, y: gameState.y };
}

export function resetGameState() {
    gameState.x = 6;
    gameState.y = 6;
    gameState.inventory = [];
    gameState.bodyParts = { hands: 2, feet: 2 };
    gameState.flags = {
        whimpering_man_helped: false,
        merchant_met: false,
        prisoner_helped: false,
        puzzle_solved: false,
        visited_tiles: ['6,6']
    };
}

let updateViewImage = () => {};

export function setViewImageUpdater(fn) {
    updateViewImage = fn;
}

// ...existing code...

export function loadTileImage(tile, forceTransition = false) {
    if (!tile || !tile.image) {
        console.warn('No image data for tile:', tile);
        return;
    }
    
    let imageConfig;
    if (typeof tile.image === 'function') {
        imageConfig = tile.image();
    } else {
        imageConfig = tile.image;
    }
    
    const { src, alt, glitch } = imageConfig;
    updateViewImage(src, alt, glitch, forceTransition);
}
