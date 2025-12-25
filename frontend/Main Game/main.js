import { loadSettings, saveSettings } from './modules/core/state.js';
import { initElements, addMessage, displayGoalText, applySettings, loadViewImage } from './modules/core/ui.js';
import { createCommandController } from './modules/core/commands.js';
import { setupSettingsControls } from './modules/core/settings.js';
import { setMapUpdater, setPlayerInfoUpdater, setViewImageUpdater, gameState, loadTileImage } from './modules/game/gameState.js';
import { updateMapDisplay, getTile } from './modules/game/map.js';
import { updatePlayerInfo } from './modules/core/playerInfo.js';

function init() {
    const elements = initElements();
    if (!elements) return;

    let settings = loadSettings();

    const ambienceAudio = document.getElementById('ambienceAudio');
    const breathingAudio = document.getElementById('breathingAudio');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const ambienceToggle = document.getElementById('ambienceToggle');
    const resetBtn = document.getElementById('resetBtn');

    const controls = { ambienceAudio, breathingAudio, volumeSlider, volumeValue, ambienceToggle };
    applySettings(settings, controls);

    displayGoalText('Find the sun...');

    const { handleKeydown } = createCommandController(elements);
    
    elements.promptBox.addEventListener('keydown', handleKeydown);

    setupSettingsControls({
        settingsBtn,
        closeSettingsBtn,
        settingsModal,
        volumeSlider,
        ambienceToggle,
        resetBtn,
        settings,
        onSettingsChange: (nextSettings) => {
            settings = nextSettings;
            applySettings(settings, controls);
            saveSettings(settings);
        }
    });

    setMapUpdater(updateMapDisplay);
    setPlayerInfoUpdater(updatePlayerInfo);
    setViewImageUpdater(loadViewImage);
    
    setTimeout(() => {
        gameState.flags.visited_tiles = ['6,6'];
        
        const startTile = getTile(6, 6);
        if (startTile) {
            loadTileImage(startTile);
        }
        
        updateMapDisplay();
        updatePlayerInfo();
        addMessage(elements, '> SYSTEM INITIALIZING...\n\n> CONNECTION ESTABLISHED\n\nType HELP for commands.', 'system-message');
        elements.promptBox.focus();
    }, 4300);
}

document.addEventListener('DOMContentLoaded', init);
