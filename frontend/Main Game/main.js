/**
 * SOLARIAS - Main Game Logic
 * Terminal-style dungeon exploration interface
 */

// Command types
const CommandType = {
    DO: 'Do',
    SAY: 'Say'
};

// DOM elements
let elements = {};

// Command history
let commandHistory = [];
let historyIndex = -1;
const MAX_HISTORY = 50;

/**
 * Initialize DOM element references
 */
function initElements() {
    elements = {
        typeBtn: document.getElementById('typeSelect'),
        promptBox: document.getElementById('promptBox'),
        descPanel: document.querySelector('#descriptionPanel .panel-content'),
        viewPanel: document.querySelector('#viewPanel .view-content'),
        playerName: document.getElementById('playerName')
    };
    
    // Validate all required elements exist
    const missing = Object.entries(elements)
        .filter(([_, el]) => !el)
        .map(([name]) => name);
    
    if (missing.length > 0) {
        console.error('Missing required elements:', missing);
        return false;
    }
    
    return true;
}

/**
 * Toggle between Do and Say command types
 */
function toggleCommandType() {
    const currentType = elements.typeBtn.textContent;
    elements.typeBtn.textContent = 
        currentType === CommandType.DO ? CommandType.SAY : CommandType.DO;
    elements.promptBox.focus();
}

/**
 * Add a message to the description panel
 * @param {string} message - The message to display
 * @param {string} className - Optional CSS class for styling
 */
function addMessage(message, className = '') {
    const line = document.createElement('div');
    line.textContent = message;
    if (className) line.className = className;
    
    elements.descPanel.appendChild(line);
    
    // Auto-scroll to bottom
    elements.descPanel.parentElement.scrollTop = 
        elements.descPanel.parentElement.scrollHeight;
}

/**
 * Process user command
 * @param {string} command - The command text
 * @param {string} type - The command type (Do/Say)
 */
function processCommand(command, type) {
    if (!command.trim()) return;
    
    // Add to history
    commandHistory.unshift(command);
    if (commandHistory.length > MAX_HISTORY) {
        commandHistory.pop();
    }
    historyIndex = -1;
    
    // Display the command
    addMessage(`> ${type}: ${command}`, 'command-echo');
    
    // TODO: Process command and generate response
    // For now, just echo back
    setTimeout(() => {
        addMessage(`[Processing: ${type.toLowerCase()} "${command}"]`, 'system-message');
    }, 100);
}

/**
 * Handle command input submission
 */
function handleSubmit() {
    const command = elements.promptBox.value.trim();
    const type = elements.typeBtn.textContent;
    
    if (command) {
        processCommand(command, type);
        elements.promptBox.value = '';
    }
    
    elements.promptBox.focus();
}

/**
 * Navigate command history
 * @param {number} direction - 1 for older, -1 for newer
 */
function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    historyIndex += direction;
    historyIndex = Math.max(-1, Math.min(historyIndex, commandHistory.length - 1));
    
    if (historyIndex === -1) {
        elements.promptBox.value = '';
    } else {
        elements.promptBox.value = commandHistory[historyIndex];
    }
}

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeydown(event) {
    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            handleSubmit();
            break;
        case 'ArrowUp':
            event.preventDefault();
            navigateHistory(1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            navigateHistory(-1);
            break;
    }
}

/**
 * Load a new image into the view panel with animation
 * @param {string} src - Image source path
 * @param {string} alt - Alt text for the image
 */
function loadViewImage(src, alt = 'Game view') {
    const viewContent = document.querySelector('#viewPanel .view-content');
    const existingImg = viewContent.querySelector('img');
    
    // Remove existing image if present
    if (existingImg) {
        existingImg.remove();
    }
    
    // Create new image element
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'view-image';
    
    // Add to view panel
    viewContent.appendChild(img);
}

/**
 * Display goal text with typewriter animation that auto-disappears
 * @param {string} text - The goal text to display
 */
function displayGoalText(text = 'Find the sun...') {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-text';
    goalDiv.textContent = text;
    document.body.appendChild(goalDiv);
    
    // Show initial image after animation completes with a delay
    setTimeout(() => {
        goalDiv.remove();
        setTimeout(() => {
            const initialImg = document.querySelector('#viewPanel .view-image');
            if (initialImg) {
                initialImg.classList.add('show');
            }
        }, 500); // 500ms delay between disappear and appear
    }, 3800);
}

/**
 * Open settings modal
 */
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.hidden = false;
}

/**
 * Close settings modal
 */
function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.hidden = true;
}

/**
 * Initialize the game interface
 */
function init() {
    if (!initElements()) return;
    
    // Start background ambience
    const ambienceAudio = document.getElementById('ambienceAudio');
    if (ambienceAudio) {
        ambienceAudio.volume = 0.5;
        ambienceAudio.play().catch(err => {
            console.log('Audio playback failed:', err);
        });
    }
    
    // Display goal text on startup
    displayGoalText('Find the sun...');
    
    // Set initial command type
    elements.typeBtn.textContent = CommandType.DO;
    
    // Add event listeners
    elements.typeBtn.addEventListener('click', toggleCommandType);
    elements.promptBox.addEventListener('keydown', handleKeydown);
    
    // Settings modal listeners
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const ambienceToggle = document.getElementById('ambienceToggle');
    const resetBtn = document.getElementById('resetBtn');
    
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }
    
    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            if (ambienceAudio) ambienceAudio.volume = volume / 100;
            if (volumeValue) volumeValue.textContent = volume + '%';
        });
    }
    
    // Ambience toggle
    if (ambienceToggle) {
        ambienceToggle.addEventListener('change', (e) => {
            if (ambienceAudio) {
                if (e.target.checked) {
                    ambienceAudio.play().catch(err => console.log('Audio play failed:', err));
                } else {
                    ambienceAudio.pause();
                }
            }
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game?')) {
                location.reload();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !settingsModal.hidden) {
            closeSettings();
        }
    });
    
    // Welcome message
    addMessage('Welcome to SOLARIAS', 'system-message');
    addMessage('Type your commands below...', 'system-message');
    
    // Focus input
    elements.promptBox.focus();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
