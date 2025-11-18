// src/components/crimson-path-rpg-part1.tsx

import React from 'react';
import useGameState from '../hooks/useGameState'; 
import CharacterCreation from './CharacterCreation';
import GameUI from './GameUI';
import CombatUI from './CombatUI';
import MerchantUI from './MerchantUI';
import StatBar from './StatBar';
import { X } from 'lucide-react';

// ----------------------------------------------------------------------
// REMINDER: All state and logic (races, classes, attack, etc.) must now 
// reside in your hook: 'src/hooks/useGameState.ts'.
// ----------------------------------------------------------------------


const CrimsonPathRPG = () => {
    // Use the custom hook to get all state and logic
    const { 
        gameState, character, episode, story, choices, combat, inventory, 
        equipment, skills, gold, races, classes, // State & Data
        discoveredClues, shapeshifterForm, merchantOpen, merchantItems,
        startGame, createCharacter, makeChoice, resetGame, // Main actions
        attack, handleSkill, handleConsumable, handleDefend, // Combat actions
        handleToggleMerchant, handleBuyItem, handleSellItem // Merchant actions
    } = useGameState();


    // --- Final Render Logic ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4 relative">
            
            {/* -------------------- GAME STATE: MENU -------------------- */}
            {gameState === 'menu' && (
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-5xl font-bold mb-4 text-red-400">Chronicles of the Crimson Path</h1>
                    <p className="text-xl mb-8 text-gray-300">Un RPG narratif où chaque choix compte</p>
                    <div className="mb-8">
                        <img 
                            src="https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=800" 
                            alt="Fantasy landscape" 
                            className="rounded-lg shadow-2xl mx-auto" 
                        />
                    </div>
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg text-xl font-bold transition"
                    >
                        Nouvelle Aventure
                    </button>
                </div>
            )}

            {/* -------------------- GAME STATE: CREATION -------------------- */}
            {gameState === 'creation' && (
                <CharacterCreation 
                    createCharacter={createCharacter} 
                    races={races} 
                    classes={classes} 
                />
            )}

            {/* -------------------- GAME STATE: PLAYING (Masqué si marchand ouvert) -------------------- */}
            {gameState === 'playing' && character && !merchantOpen && (
                <GameUI 
                    character={character} 
                    episode={episode} 
                    story={story} 
                    choices={choices} 
                    gold={gold} 
                    inventory={inventory} 
                    equipment={equipment} 
                    makeChoice={makeChoice}
                />
            )}

            {/* -------------------- GAME STATE: COMBAT (Masqué si marchand ouvert, bien que cela ne devrait pas arriver) -------------------- */}
            {gameState === 'combat' && combat && character && !merchantOpen && (
                <CombatUI 
                    combat={combat} 
                    character={character} 
                    skills={skills} 
                    inventory={inventory} 
                    equipment={equipment} 
                    attack={attack} 
                    handleSkill={handleSkill} 
                    handleConsumable={handleConsumable} 
                    handleDefend={handleDefend} 
                />
            )}
            
            {/* -------------------- Rendu du Marchand (MODAL) -------------------- */}
            {merchantOpen && character && (
                <MerchantUI 
                    character={character} 
                    gold={gold} 
                    inventory={inventory} 
                    merchantItems={merchantItems}
                    handleToggleMerchant={handleToggleMerchant}
                    handleBuyItem={handleBuyItem}
                    handleSellItem={handleSellItem}
                />
            )}

            {/* -------------------- GAME STATE: GAME OVER -------------------- */}
            {gameState === 'gameOver' && (
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-5xl font-bold mb-4 text-red-600">Vous êtes tombé...</h1>
                    <p className="text-xl mb-8 text-gray-300">
                        Votre aventure se termine ici, mais la Voie Écarlate vous attend toujours.
                    </p>
                    <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg text-xl font-bold transition"
                    >
                        Recommencer
                    </button>
                </div>
            )}
        </div>
    );
};

export default CrimsonPathRPG;