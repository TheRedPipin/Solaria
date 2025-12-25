import { gameState } from './gameState.js';

const locationInformation = {
    0: null,
    1: {
        type: 'corridor', 
        description: `More nothing...`,
        image: {
            src: './assets/images/corridor.png',
            alt: 'Empty Corridor',
            glitch: false
        }
    },
    2: {
        type: 'start', 
        description: `Starting Cell\nA dim cell. Cold stone walls press in from all sides...`,
        image: {
            src: './assets/images/corridor.png',
            alt: 'Starting Cell',
            glitch: false
        }
    },
    3: {
        type: 'whimpering', 
        description: `Whimpering Chamber\nA narrow passage stretches before you...`,
        npc: "whimpering",
        image: () => {
            if (gameState.flags.whimpering_man_helped) {
                return { src: './assets/images/whimpering_helped.png', alt: 'Quiet Chamber', glitch: false };
            }
            return { src: './assets/images/whimpering.png', alt: 'Whimpering Chamber', glitch: true };
        }
    },
    4: {
        type: 'merchant', 
        description: `Merchant's Chamber\nA vast room. Candles flicker on a table...`,
        npc: "merchant",
        image: {
            src: './assets/images/merchant.png',
            alt: 'Merchant\'s Chamber',
            glitch: true
        }
    },
    5: {
        type: 'prisoner', 
        description: `Prison Cell\nA cramped cell. Someone sits against the far wall...`,
        npc: "prisoner",
        image: {
            src: './assets/images/prisoner.png',
            alt: 'Prison Cell',
            glitch: true
        }
    },
    6: {
        type: 'puzzle', 
        description: `Sacrificial Chamber\nA stone pedestal dominates the room...`,
        image: () => {
            if (gameState.flags.puzzle_solved) {
                return { src: './assets/images/sacrificeAfter.png', alt: 'Sacrificial Chamber', glitch: false };
            }
            return { src: './assets/images/sacrificeBefore.png', alt: 'Sacrificial Chamber', glitch: true };
        }
    },
    7: {
        type: 'circle1', 
        description: `Endless Corridor\nThe passage curves unnaturally...`,
        image: {
            src: './assets/images/corridor.png',
            alt: 'Endless Corridor',
            glitch: true
        },
        teleportTo: [0,3]
    },
    8: {
        type: 'circle2', 
        description: `Endless Corridor\nThe passage twists back on itself...`,
        image: {
            src: './assets/images/corridor.png',
            alt: 'Endless Corridor',
            glitch: true
        },
        teleportTo: [0,5]
    },
    9: {
        type: 'locked_door', 
        description: `Sealed Passage\nA heavy door blocks your path...`,
        image: {
            src: './assets/images/lockedDoor.png',
            alt: 'Sealed Door',
            glitch: true
        }
    },
    10: {
        type: 'end', 
        description: `The light burns your skin... here it is... the sun!`,
        image: {
            src: './assets/images/sun.png',
            alt: 'The Sun',
            glitch: false
        }
    }
};

export function getTileImage(x, y) {
    const tile = getTile(x, y);
    if (!tile?.image) return null;
    if (typeof tile.image === 'function') {
        return tile.image();
    }
    return tile.image;
}

const dungeonMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [1, 0, 1, 0, 9, 0, 0, 0, 0, 0],
    [8, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [7, 1, 1, 0, 1, 0, 3, 0, 1, 6],
    [1, 0, 1, 0, 1, 0, 2, 0, 9, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 5, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 10, 0, 0]
];


export function getTile(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return null;
    return locationInformation[dungeonMap[y][x]];
}

export function canMoveTo(x, y) {
    const tile = getTile(x, y);
    return tile !== null && tile !== undefined;
}

export function getNextTile(x, y, direction) {
    const dirMap = {
        north: { x: 0, y: -1 },
        south: { x: 0, y: 1 },
        east: { x: 1, y: 0 },
        west: { x: -1, y: 0 }
    };
    
    if (!dirMap[direction]) return null;
    
    const nextX = x + dirMap[direction].x;
    const nextY = y + dirMap[direction].y;
    
    if (canMoveTo(nextX, nextY)) {
        return { x: nextX, y: nextY };
    }
    return null;
}

export function generateMapDisplay(visitedTiles, playerPos) {
    const lines = [];
    const width = 21;
    
    lines.push('╔═══════════════════╗');
    lines.push('║    @!"£^!%"£"!    ║');
    lines.push('╠═══════════════════╣');
    
    if (visitedTiles.length === 0) {
        const content = '(unexplored)';
        const padding = ' '.repeat(Math.floor((width - 2 - content.length) / 2));
        lines.push('║' + padding + content + padding + ' ║');
        lines.push('╚═══════════════════╝');
        return lines.join('\n');
    }
    const visitedSet = new Set(visitedTiles);
    
    for (let y = 0; y < 10; y++) {
        const cells = [];
        for (let x = 0; x < 10; x++) {
            const coordKey = `${x},${y}`;
            const tile = getTile(x, y);
            
            if (x === playerPos.x && y === playerPos.y) {
                cells.push('@');
            } else if (visitedSet.has(coordKey)) {
                if (!tile) {
                    cells.push('?');
                } else {
                    switch (tile.type) {
                        case 'start': cells.push('S'); break;
                        case 'end': cells.push('E'); break;
                        case 'merchant': cells.push('M'); break;
                        case 'prisoner': cells.push('P'); break;
                        case 'whimpering': cells.push('W'); break;
                        case 'puzzle': cells.push('?'); break;
                        case 'locked_door': cells.push('#'); break;
                        case 'circle1':
                        case 'circle2': cells.push('O'); break;
                        case 'para': cells.push('X'); break;
                        case 'corridor': cells.push('·'); break;
                        default: cells.push('·'); break;
                    }
                }
            } else {
                cells.push(' ');
            }
        }
        const content = cells.join(' ');
        lines.push('║' + content + '║');
    }
    
    lines.push('╚═══════════════════╝');
    
    return lines.join('\n');
}


export function updateMapDisplay(visitedTiles = [], playerPos = {x: 6, y: 6}) {
    const mapContent = document.querySelector('#mapPanel .map-content');
    if (!mapContent) return;
    
    const mapText = generateMapDisplay(visitedTiles, playerPos);
    mapContent.innerHTML = `<pre class="ascii-map updating">${mapText}</pre>`;
    
    const mapElement = mapContent.querySelector('.ascii-map');
    if (mapElement) {
        setTimeout(() => mapElement.classList.remove('updating'), 400);
    }
}

export function getExits(x, y) {
    let possibleExits = [];
    for (const dir of ['north', 'south', 'east', 'west']) {
        const nextCoords = getNextTile(x, y, dir);
        if (nextCoords) {
            possibleExits.push(dir);
        }
    }
    return possibleExits;
}