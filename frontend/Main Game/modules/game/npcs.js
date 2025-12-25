export const npcs = {
    "whimpering": {
        name: "Whimpering Man",
        description: "A hunched figure rocks back and forth, sobbing quietly. He won't look at you.",
        dialogue: {
            default: "...*sob*... *sob*...",
            give_jar: "The man snatches the jar from your hands. Tears stream down his face, filling it slowly. He hand's it back."
        },
        handleSpeech(speech) {
            return this.dialogue.default;
        }
    },
    
    "merchant": {
        name: "The Merchant",
        description: "The merchant's smile never reaches his eyes. 'Everything has a price,' he whispers.",
        dialogue: {
            greeting: "Welcome, welcome! I have such wonders to sell.",
            no_saw: "Ah, but you'll need a bone saw first. For the cutting, you understand.",
            menu: "I offer:\n- GLOW BUG (costs: 1 hand)\n- SKELETON KEY (costs: 1 foot)\n\nWhat would you like? (Try: BUY GLOW BUG or BUY SKELETON KEY)",
            buy_glowbug_success: "The merchant produces a pale insect pulsing with sickly light. He holds out his hand expectantly.\n\nYou hear sawing. You try not to scream. When you can see again, the glow bug is yours.\n\n[You lost 1 hand]",
            buy_key_success: "A rusted skeleton key appears on the table. The merchant gestures to your feet.\n\nThe saw bites. You fall. When the pain fades, you clutch the key in bloody fingers.\n\n[You lost 1 foot]",
            no_hands: "You don't have enough hands for that.",
            no_feet: "You don't have enough feet for that.",
            already_own: "You already have that.",
            default: "*The man hums as he saws away at something*"
        }
    },
    
    "prisoner": {
        name: "The Prisoner",
        description: "A broken figure sits motionless. Their eyes are hollow, but they still breathe.",
        dialogue: {
            default: "I've been here so long... I don't remember the sun. Do you? Do you remember warmth?",
            with_glowbug: "Is that... light? Real light? Please. Please, I'll give you anything. Here, take this. I've kept it safe, but I don't need it anymore.\n\n[The prisoner gives you a jar]",
            after_trade: "Thank you. Thank you. At least now I can see the walls that cage me.",
            no_glowbug: "The prisoner stares through you. They have nothing left to give."
        }
    }
};
