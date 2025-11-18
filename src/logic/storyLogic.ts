// src/logic/storyLogic.ts

import React from 'react';
import { 
    CharacterType, EnemyType, ChoiceType, StoryLogEntry, GameState, 
    ClueType, StatKey
} from '../types/game';

// ----------------------------------------------------------------------
// 1. DÉFINITION DES SETTERS (MIS À JOUR)
// ----------------------------------------------------------------------

export type StateSetters = {
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    setStory: React.Dispatch<React.SetStateAction<string>>;
    setChoices: React.Dispatch<React.SetStateAction<ChoiceType[]>>;
    setStoryLog: React.Dispatch<React.SetStateAction<StoryLogEntry[]>>;
    setMetNPCs: React.Dispatch<React.SetStateAction<string[]>>;
    setGold: React.Dispatch<React.SetStateAction<number>>;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterType | null>>;
    setEpisode: React.Dispatch<React.SetStateAction<number>>; // NOUVEAU
    setDiscoveredClues: React.Dispatch<React.SetStateAction<ClueType[]>>; // NOUVEAU
    
    // Actions et données du hook (lu/utilisé)
    startCombat: (enemy: EnemyType) => void;
    handleToggleMerchant: () => void; // NOUVEAU
    character: CharacterType | null; 
    gold: number; 
};

export const createStoryActions = (setters: StateSetters) => {
    const { 
        setGameState, setStory, setChoices, setStoryLog, setMetNPCs, setGold, 
        setCharacter, startCombat, character, gold, 
        setEpisode, setDiscoveredClues, handleToggleMerchant 
    } = setters;

    // Cette fonction est nécessaire pour accéder aux statistiques du personnage en dehors du hook.
    // Elle renvoie 'character' de la closure.
    const getCharacter = () => character; 

    // ----------------------------------------------------------------------
    // 2. LOGIQUE D'ÉPISODE 1 (GARDÉE INTACTE)
    // ----------------------------------------------------------------------

    const handleKaelenMeeting = () => { /* ... (Logique existante) ... */ 
        setMetNPCs(prev => [...prev, 'Kaelen']);
        const newStory = `Vous vous approchez du vieillard... Avant que vous puissiez poser plus de questions, un cri retentit à l'extérieur. Des bandits attaquent la taverne !`;
        setStory(newStory);
        setStoryLog(prev => [...prev, { episode: 1, choice: 'Rencontre avec Kaelen le Vagabond' }]);
        setTimeout(() => { startCombat({ name: 'Bandit Ivre', hp: 40, maxHp: 40, damage: 8, defense: 2, image: '🗡️', }); }, 2000);
    };

    const handleMercenaries = () => { /* ... (Logique existante) ... */
        const newStory = `Vous vous joignez aux mercenaires... Soudain, la porte de la taverne explose ! Des bandits font irruption !`;
        setStory(newStory);
        setStoryLog(prev => [...prev, { episode: 1, choice: 'Discussion avec les mercenaires' }]);
        setTimeout(() => { startCombat({ name: 'Bandit Armé', hp: 45, maxHp: 45, damage: 10, defense: 3, image: '⚔️', }); }, 2000);
    };

    const handleShadowObserve = () => { /* ... (Logique existante) ... */
        const newStory = `Vous faites semblant de boire... Vous avez le temps de voir son visage un instant : des yeux rouges comme le sang. Un instant plus tard, des cris éclatent. Des bandits attaquent !`;
        setStory(newStory);
        // AJOUT : Ajout d'un indice
        setDiscoveredClues(prev => [...prev, 'Yeux Rouges']); 
        setStoryLog(prev => [...prev, { episode: 1, choice: 'Observation de l\'Ombre Silencieuse', clue: true }]);
        setTimeout(() => { startCombat({ name: 'Bandit Rusé', hp: 35, maxHp: 35, damage: 7, defense: 2, agility: 5, image: '🏹', }); }, 2000);
    };

    const handleRest = () => { /* ... (Logique existante) ... */
        if (gold < 5) { alert('Pas assez d\'or !'); return; }
        setGold(prev => prev - 5);
        setCharacter(prev => prev ? ({ ...prev, fatigue: Math.max(0, prev.fatigue - 10) }) : null);
        const newStory = `Vous commandez une chope d'hydromel... Votre repos est interrompu par des cris à l'extérieur. Des bandits !`;
        setStory(newStory);
        setStoryLog(prev => [...prev, { episode: 1, choice: 'Repos à la taverne' }]);
        setTimeout(() => { startCombat({ name: 'Bandit Commun', hp: 38, maxHp: 38, damage: 8, defense: 2, image: '🪓', }); }, 2000);
    };


    const startEpisode1 = () => { /* ... (Logique existante) ... */
        setGameState('playing');
        setStory(`La Taverne du Crépuscule baigne dans une lumière dorée tamisée. L'odeur du pain frais et de l'hydromel flotte dans l'air. Vous venez d'arriver dans cette bourgade frontière entre l'Ouest chevaleresque et l'Est mystique.

Au comptoir, un vieillard aux yeux perçants vous observe. "Encore un voyageur sur la Voie Écarlate..." murmure-t-il avant de détourner le regard. Ces mots résonnent étrangement en vous.

Dans un coin sombre, une silhouette encapuchonnée semble vous surveiller. À une table bruyante, des mercenaires discutent d'une ruine récemment découverte. Le tavernier nettoie des chopes en sifflotant.

Votre aventure commence ici, étranger.`);
        setChoices([
            { id: 1, text: 'Approcher le vieillard et lui demander ce qu\'il sait sur la "Voie Écarlate"', condition: null, result: 'npc_kaelen' },
            { id: 2, text: 'Rejoindre les mercenaires et écouter leurs histoires de ruines', condition: null, result: 'mercenaries' },
            { id: 3, text: 'Observer discrètement la silhouette encapuchonnée', condition: { stat: 'agilite', min: 7 }, result: 'shadow_observe' },
            { id: 4, text: 'Commander à boire et vous reposer (-10 Fatigue, -5 Or)', condition: null, result: 'rest' }
        ]);
        setStoryLog(prev => [...prev, { episode: 1, text: 'Arrivée à la Taverne du Crépuscule' }]);
    };

    // ----------------------------------------------------------------------
    // 3. LOGIQUE D'ÉPISODE 2 (NOUVELLE)
    // ----------------------------------------------------------------------

    const startEpisode2 = () => {
        setGameState('playing');
        setEpisode(2); 
        
        const storyText = `Les décombres de la Taverne du Crépuscule fument derrière vous. Votre première épreuve sur la Voie Écarlate est terminée. Vous décidez de marcher vers la ville fortifiée d'Aethelgard, la capitale régionale.

La route est longue et bordée d'épaisses forêts. Après quelques heures de marche, vous arrivez à une bifurcation.`;
        
        setStory(storyText);
        setChoices([
            { 
                id: 201, 
                text: 'Prendre le sentier de la Forêt Noire (plus rapide, plus dangereux)',
                condition: null,
                result: 'forest_path'
            },
            { 
                id: 202, 
                text: 'Suivre la route principale (plus longue, plus sûre)',
                condition: null,
                result: 'main_road_start'
            },
            { 
                id: 203, 
                text: 'Vous arrêter pour chasser et récupérer de l\'énergie',
                condition: { stat: 'agilite', min: 7 },
                result: 'hunt_rest'
            }
        ]);
        setStoryLog(prev => [...prev, { episode: 2, text: 'Départ de la taverne. Début de l\'Épisode 2.' }]);
    };


    const handleForestPath = () => {
        setStory(`Le sentier de la Forêt Noire est sombre et étroit. La tension est palpable. Soudain, un bruit de froissement de feuilles... Une créature vous attaque !`);
        setStoryLog(prev => [...prev, { episode: 2, choice: 'Prise du Sentier de la Forêt Noire' }]);
        
        setTimeout(() => {
            startCombat({
                name: 'Goule de l\'Ombre', hp: 60, maxHp: 60, damage: 15, defense: 5, image: '🦇', agility: 10,
            });
        }, 1500);
    };

    const handleMainRoad = () => {
        setStory(`La route principale est dégagée et relativement sûre. Après une heure de marche paisible, vous arrivez à une auberge en bord de route. C'est l'occasion de vous ravitailler ou de vous informer.`);
        setStoryLog(prev => [...prev, { episode: 2, choice: 'Suivi de la Route Principale' }]);
        setChoices([
            { id: 204, text: 'Visiter la boutique du marchand itinérant', condition: null, result: 'open_merchant' },
            { id: 205, text: 'Sonder l\'auberge pour des rumeurs', condition: null, result: 'rumors_auberge' }
        ]);
    };
    
    const handleHuntRest = () => {
        if (!character) return;
        const successChance = character.agilite * 5; 

        if (Math.random() * 100 < successChance) {
            setStory(`Votre chasse est fructueuse. Vous trouvez une petite bête et la cuisinez. Vous récupérez une grande partie de votre énergie.`);
            setCharacter(prev => prev ? ({ 
                ...prev, 
                energie: prev.maxEnergie, 
                hp: Math.min(prev.hp + 10, prev.maxHp) 
            }) : null);
            setStoryLog(prev => [...prev, { episode: 2, text: 'Chasse réussie: Énergie restaurée.' }]);
        } else {
            setStory(`Malgré vos efforts, vous ne trouvez rien. La fatigue s'installe. Vous devez continuer votre chemin.`);
            setCharacter(prev => prev ? ({ ...prev, fatigue: prev.fatigue + 5 }) : null);
            setStoryLog(prev => [...prev, { episode: 2, text: 'Chasse échouée: Fatigue accrue.' }]);
        }
        
        // Retour aux choix de la bifurcation
        setChoices([
            { id: 201, text: 'Reprendre le sentier de la Forêt Noire', condition: null, result: 'forest_path' },
            { id: 202, text: 'Reprendre la route principale', condition: null, result: 'main_road_start' }
        ]);
    };
    
    const handleMerchantVisit = () => {
        // Ouvre l'interface du marchand (MerchantUI)
        handleToggleMerchant(); 
        setStory(`Vous entrez dans la boutique du marchand itinérant. Que désirez-vous acheter ou vendre ?`);
        setStoryLog(prev => [...prev, { episode: 2, text: 'Ouverture du Marchand.' }]);
        // Laisse le choix de quitter la boutique via le bouton dans MerchantUI, qui rappellera handleToggleMerchant.
        setChoices([]);
    };
    
    const handleRumorsAuberge = () => {
        if (!character) return;
        setStory(`Vous vous asseyez dans l'auberge. Un barde joue une mélodie triste. Vous écoutez les conversations...`);

        const rumorChance = character.intelligence * 4 + character.chance * 2;
        if (Math.random() * 100 < rumorChance) {
            setStory(prev => prev + `\n\nVous entendez un murmure sur le Vieil Arbre Sanglant, où l'on dit qu'une personne disparue aurait laissé un artefact.`);
            setDiscoveredClues(prev => [...prev, 'Vieil Arbre Sanglant']);
            setStoryLog(prev => [...prev, { episode: 2, text: 'Rumeur découverte : Vieil Arbre Sanglant.', clue: true }]);
        } else {
            setStory(prev => prev + `\n\nLes rumeurs sont vagues et sans intérêt. Vous perdez votre temps.`);
            setStoryLog(prev => [...prev, { episode: 2, text: 'Rumeur sans intérêt.' }]);
        }
        
        // Options après avoir écouté les rumeurs
        setChoices([
            { id: 204, text: 'Visiter la boutique', condition: null, result: 'open_merchant' },
            { id: 206, text: 'Quitter l\'auberge et continuer la route', condition: null, result: 'exit_auberge_continue' }
        ]);
    };
    
    const handleExitAubergeContinue = () => {
        setStory(`Vous quittez l'auberge et reprenez la route principale vers Aethelgard. La journée est bien entamée. (Vous atteignez la capitale à l'épisode 3)`);
        setStoryLog(prev => [...prev, { episode: 2, text: 'L\'auberge est derrière vous.' }]);
        setChoices([]); // Fin de l'épisode 2 pour l'instant
    };

    // ----------------------------------------------------------------------
    // 4. FONCTION DE RETOUR
    // ----------------------------------------------------------------------

    return {
        startEpisode1,
        startEpisode2, 
        
        // Épisode 1 handlers
        handleKaelenMeeting,
        handleMercenaries,
        handleShadowObserve,
        handleRest,
        
        // Épisode 2 handlers
        handleForestPath,
        handleMainRoad,
        handleHuntRest,
        handleMerchantVisit,
        handleRumorsAuberge,
        handleExitAubergeContinue,
    };
};