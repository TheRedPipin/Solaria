import { getTile, getNextTile, getExits } from './map.js';
import { gameState, hasItem, addItem, removeItem, moveToTile, triggerPlayerInfoUpdate, loadTileImage } from './gameState.js';
import { npcs } from './npcs.js';
import { loadViewImage } from '../core/ui.js';

export function parseCommand(input) {
    const cmd = input.toLowerCase().trim();
    const currentTile = getTile(gameState.x, gameState.y);
    
    if (cmd === 'help' || cmd === '?') {
        return getHelpText();
    }
    
    if (cmd.startsWith('go ') || cmd.startsWith('move ') || ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w'].includes(cmd)) {
        return handleMovement(cmd);
    }
    
    if (cmd.startsWith('look') || cmd.startsWith('examine') || cmd === 'l') {
        return handleLook(currentTile);
    }
    
    if (cmd === 'inventory' || cmd === 'i' || cmd === 'inv') {
        return showInventory();
    }
    
    if (cmd.startsWith('take ') || cmd.startsWith('get ')) {
        return handleTake(cmd, currentTile);
    }
    
    if (cmd.startsWith('use ')) {
        return handleUse(cmd, currentTile);
    }
    
    if (cmd.startsWith('say ') || cmd.startsWith('speak ')) {
        return handleSpeech(input, currentTile);
    }
    
    if (cmd.startsWith('give ')) {
        return handleGive(cmd, currentTile);
    }
    
    if (cmd.startsWith('buy ')) {
        return handleBuy(cmd, currentTile);
    }

    return "I don't understand that command. Type HELP for a list of commands.";
}

function getHelpText() {
    return `
    Available Commands:

    MOVEMENT:
    GO [direction] / [N/S/E/W] - Move in a direction
    
    INTERACTION:
    LOOK / EXAMINE - Look around
    TAKE [item] - Pick up an item
    USE [item] - Use an item
    GIVE [item] TO [person] - Give an item
    BUY [item] - Purchase from merchant
    SAY [something] - Speak to someone
    
    OTHER:
    INVENTORY / I - Check items
    HELP - Show this help text
    SWITCH BETWEEN DO AND SAY MODES USING THE TOGGLE BUTTON
  `;
}

function handleMovement(cmd) {
    let direction = cmd.replace(/^(go|move)\s+/, '');
    const dirMap = { n: 'north', s: 'south', e: 'east', w: 'west' };
    direction = dirMap[direction] || direction;
    
    const nextCoords = getNextTile(gameState.x, gameState.y, direction);
    if (!nextCoords) {
        return "You can't go that way.";
    }
    
    const nextTile = getTile(nextCoords.x, nextCoords.y);
    
    if (nextTile && nextTile.type === 'locked_door' && !hasItem('skeleton_key')) {
        loadTileImage(nextTile, true);
        return "The door is sealed. Heavy chains bind it shut. You'll need a key.";
    }
    
    if (nextTile && nextTile.type === 'locked_door' && hasItem('skeleton_key')) {
        loadTileImage(nextTile, true);
        return "You unlock the door with the skeleton key. The chains fall away with a metallic clang.";
    }
    
    if (nextTile && (nextTile.type === 'circle1' || nextTile.type === 'circle2')) {
        loadTileImage(nextTile, true);
        if (nextTile.teleportTo) {
            const [teleX, teleY] = nextTile.teleportTo;
            moveToTile(teleX, teleY);
            const teleTile = getTile(teleX, teleY);
            if (teleTile) {
                loadTileImage(teleTile, true);
            }
            return `As you step into the corridor, the world warps around you...\n\nYou find yourself in a different part of the labyrinth.`;
        }
    }
    
    if (nextTile) {
        moveToTile(nextCoords.x, nextCoords.y);
        loadTileImage(nextTile, true);
        
        const description = nextTile.description;
        const exitsText = getExitsText();
        
        return `You move ${direction}.\n\n${description}\n\n${exitsText}`;
    }
    
    return "You can't go that way.";
}

function handleLook(currentTile) {
    const description = currentTile.description;
    const exitsText = getExitsText();
    
    return `${description}\n\n${exitsText}`;
}

function getExitsText() {
    const directionExits = getExits(gameState.x, gameState.y);
    if (!directionExits) return "You can go: nowhere";
    
    const arrows = {
        north: '↑',
        south: '↓',
        east: '→',
        west: '←'
    };

    for (let i = 0; i < directionExits.length; i++) {
        directionExits[i] = `${directionExits[i].charAt(0).toUpperCase() + directionExits[i].slice(1)} ${arrows[directionExits[i]]}\n`;
    }
    
    return `You can go: \n${directionExits.join('')}`;
}

function showInventory() {
    if (gameState.inventory.length === 0) {
        return `You carry nothing but dread.\n\nBody Parts: ${gameState.bodyParts.hands} hands, ${gameState.bodyParts.feet} feet`;
    }
    return `Inventory: ${gameState.inventory.join(', ')}\n\nBody Parts: ${gameState.bodyParts.hands} hands, ${gameState.bodyParts.feet} feet`;
}

function handleTake(cmd, currentTile) {
    if (currentTile && currentTile.type === 'puzzle') {
        const item = cmd.replace(/^(take|get)\s+/, '');
        if (item.includes('bone') || item.includes('saw')) {
            if (hasItem('bone_saw')) {
                return "You already have that.";
            }
            addItem('bone_saw');
            return "You take the bone saw. It's heavier than it looks.";
        }
    }
    return "There's nothing to take here.";
}

function handleSpeech(input, currentTile) {
    let speech = input;
    speech = input.replace(/^(talk|speak)\s+(to\s+)?/i, '');
    if (!currentTile || !currentTile.npc) {
        return `Your words echo unanswered.`;
    }
    const npc = npcs[currentTile.npc];
    if (npc.handleSpeech) {
        return npc.handleSpeech(speech);
    }
    return npc.dialogue.default;
}

function handleGive(cmd, currentTile) {
    if (!currentTile || !currentTile.npc) {
        return "There's no one here.";
    }
    return "They don't want that.";
}

function handleBuy(cmd, currentTile) {
    if (!currentTile || currentTile.type !== 'merchant') {
        return "There's nothing to buy here.";
    }
    
    const npc = npcs[currentTile.npc];
    if (!npc) return "The merchant stares at you expectantly.";
    
    const item = cmd.replace(/^buy\s+/, '').toLowerCase();
    
    if (item.includes('glow') && item.includes('bug')) {
        return npc.buyGlowBug();
    }
    if (item.includes('skeleton') && item.includes('key')) {
        return npc.buySkeletonKey();
    }
    
    return npc.getGreeting();
}

function handleUse(cmd, currentTile) {
    const item = cmd.replace(/^use\s+/, '');
    
    if (currentTile && currentTile.type === 'puzzle') {
        const lowerInput = cmd.toLowerCase();
        if (lowerInput.includes('pedestal') || lowerInput.includes('blade') || lowerInput.includes('touch') || lowerInput.includes('press')) {
            if (!gameState.flags.puzzle_solved) {
                gameState.flags.puzzle_solved = true;
                loadViewImage('./assets/images/sacrificeAfter.png', 'Sacrificial Chamber', true, true);
            }
            return "Your hand touches the weathered blade atop the pedestal.\n\nThe moment your skin makes contact, the blade shifts, stabbing into you. Blood wells from your fingers.\n\nYour blood drips onto the stone. A low grinding sound echoes through the chamber as a hidden drawer slides open from the pedestal's base, revealing a bone saw within.";
        }
    }
    
    if (!hasItem(item)) {
        return "You don't have that.";
    }
    return "You're not sure how to use that here.";
}
