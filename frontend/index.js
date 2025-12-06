// Loading animation configuration
const CONFIG = {
    TOTAL_BLOCKS: 20,
    FILL_DELAY: 80,
    COLLAPSE_DELAY: 50,
    PAUSE_BEFORE_COLLAPSE: 400,
    PAUSE_BEFORE_CONTINUE: 350,
    FADE_DURATION: 600,
    TRANSITION_DELAY: 500
};

// DOM elements
const loadingBar = document.getElementById('loading-bar');
const continueMsg = document.getElementById('continue-msg');

// State management
let progress = 0;
let loading = true;
let collapsing = false;
let collapsed = false;

/**
 * Renders the loading bar with the current progress
 * @param {number} progress - Current progress (0 to TOTAL_BLOCKS)
 * @param {boolean} collapse - Whether to collapse inward from both sides
 */
function renderBar(progress, collapse = false) {
    if (!loadingBar) return;
    
    if (collapse) {
        const left = Math.floor((CONFIG.TOTAL_BLOCKS - progress) / 2);
        const right = CONFIG.TOTAL_BLOCKS - progress - left;
        const filled = '/'.repeat(progress);
        const emptyLeft = ' '.repeat(left);
        const emptyRight = ' '.repeat(right);
        loadingBar.textContent = `[${emptyLeft}${filled}${emptyRight}]`;
    } else {
        const filled = '/'.repeat(progress);
        const empty = ' '.repeat(CONFIG.TOTAL_BLOCKS - progress);
        loadingBar.textContent = `[${filled}${empty}]`;
    }
}

/**
 * Animates the loading bar through fill and collapse phases
 */
function animateBar() {
    if (!loading) return;
    
    if (!collapsing) {
        // Fill phase: progress from left to right
        if (progress < CONFIG.TOTAL_BLOCKS) {
            progress++;
            renderBar(progress);
            setTimeout(animateBar, CONFIG.FILL_DELAY);
        } else {
            // Start collapse phase after pause
            collapsing = true;
            progress = CONFIG.TOTAL_BLOCKS;
            setTimeout(animateBar, CONFIG.PAUSE_BEFORE_COLLAPSE);
        }
    } else if (!collapsed) {
        // Collapse phase: collapse inward from both sides
        if (progress > 0) {
            progress--;
            renderBar(progress, true);
            setTimeout(animateBar, CONFIG.COLLAPSE_DELAY);
        } else {
            // Animation complete
            collapsed = true;
            setTimeout(showContinue, CONFIG.PAUSE_BEFORE_CONTINUE);
        }
    }
}

/**
 * Transitions from loading bar to continue message
 */
function showContinue() {
    if (!loadingBar || !continueMsg) return;
    
    // Fade out loading bar
    loadingBar.style.opacity = '0';
    
    setTimeout(() => {
        loadingBar.hidden = true;
        continueMsg.hidden = false;
        
        // Trigger reflow for transition
        void continueMsg.offsetWidth;
        continueMsg.style.opacity = '1';
        
        // Enable keyboard interaction
        document.addEventListener('keydown', handleAnyKey, { once: true });
    }, CONFIG.FADE_DURATION);
}

/**
 * Handles key press to navigate to main game
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleAnyKey(event) {
    if (!continueMsg) return;
    
    // Ignore modifier-only keys
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
    
    continueMsg.textContent = 'Loading...';
    continueMsg.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = 'Main Game/main.html';
    }, CONFIG.TRANSITION_DELAY);
}

/**
 * Initialize the loading animation when DOM is ready
 */
function init() {
    if (!loadingBar || !continueMsg) {
        console.error('Required DOM elements not found');
        return;
    }
    
    renderBar(progress);
    animateBar();
}

// Start when DOM is ready
window.addEventListener('DOMContentLoaded', init);
