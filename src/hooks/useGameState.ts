// src/hooks/useGameState.ts (Refactorisé)

import { useState, useMemo, useCallback } from 'react';
import { races } from '../data/races'; 
import { classes } from '../data/classes'; 
import { startingItems } from '../data/items';
import { baseSkills } from '../data/skills';
import { merchantItems } from '../data/merchant';
import { 
    CharacterType, CombatType, EquipmentType, SkillType, ConsumableItem, 
    AllocatedStats, ChoiceType, StoryLogEntry, GameState, 
    StatKey, WeaponItem, ArmorItem,
    ClueType, ShapeshifterForm, ShopItem
} from '../types/game';
import { createStoryActions } from '../logic/storyLogic';

// Import des hooks factorisés
import { useCombatActions } from './useCombatActions';
import { useCharacterCreationActions } from './useCharacterCreationActions'; 

// Le hook retourne les actions et l'état
const useGameState = () => {
    // --- État Global ---
    const [gameState, setGameState] = useState<GameState>('menu'); 
    const [character, setCharacter] = useState<CharacterType | null>(null);
    const [episode, setEpisode] = useState(1);
    const [story, setStory] = useState('');
    const [choices, setChoices] = useState<ChoiceType[]>([]);
    const [combat, setCombat] = useState<CombatType | null>(null);
    const [inventory, setInventory] = useState<ConsumableItem[]>([]);
    const [equipment, setEquipment] = useState<EquipmentType>({ weapon: null, armor: null });
    const [skills, setSkills] = useState<SkillType[]>([]);
    const [gold, setGold] = useState(50);
    const [storyLog, setStoryLog] = useState<StoryLogEntry[]>([]);
    const [metNPCs, setMetNPCs] = useState<string[]>([]);

    const [discoveredClues, setDiscoveredClues] = useState<ClueType[]>([]);
    const [shapeshifterForm, setShapeshifterForm] = useState<ShapeshifterForm>('human');
    const [merchantOpen, setMerchantOpen] = useState(false);

    // --- Fonctions du Marchand (Gardées ici pour l'instant) ---
    // Ces fonctions sont isolées mais dépendent directement de l'état principal
    const handleToggleMerchant = useCallback(() => {
        setMerchantOpen(prev => {
            const newState = !prev;
            // On s'assure que si on ouvre le marchand, l'état du jeu est 'playing'
            if (newState) {
                setGameState('playing'); 
            }
            return newState;
        });
    }, [setGameState]);
    
    const handleBuyItem = useCallback((item: ShopItem) => {
        if (gold < item.cost) {
            alert("Pas assez d'or pour acheter cet objet.");
            return false;
        }

        setGold(prev => prev - item.cost);
        
        // On suppose que tous les objets achetés vont dans l'inventaire pour l'instant
        setInventory(prev => [...prev, item as ConsumableItem]); 

        setStoryLog(prev => [...prev, { episode: episode, text: `Achat de ${item.name} pour ${item.cost} Or.` }]);
        return true;
    }, [gold, episode, setGold, setInventory, setStoryLog]);
    
    const handleSellItem = useCallback((item: ConsumableItem) => {
        // Logique de vente copiée de l'original
        const sellValue = Math.floor(25 * (item.value / 20)); 
        
        const itemIndex = inventory.findIndex(i => i.id === item.id);
        if (itemIndex === -1) return;

        const newInventory = [...inventory];
        newInventory.splice(itemIndex, 1);
        setInventory(newInventory);
        
        setGold(prev => prev + sellValue);
        setStoryLog(prev => [...prev, { episode: episode, text: `Vente de ${item.name} pour ${sellValue} Or.` }]);
    }, [inventory, episode, setGold, setInventory, setStoryLog]);


    // --- Déclaration initiale des storyActions (pour éviter les dépendances circulaires) ---
    // Nous utiliserons useMemo et une injection tardive pour la fonction startCombat
    // car elle est définie dans useCombatActions.
    const storyActions = useMemo(() => createStoryActions({
        setGameState, setStory, setChoices, setStoryLog, setMetNPCs, setGold, setCharacter, 
        setEpisode, 
        setDiscoveredClues, 
        handleToggleMerchant, 
        startCombat: (...args: any[]) => console.warn("startCombat not yet initialized"), // Placeholder
        character, gold
    }), [setGameState, setStory, setChoices, setStoryLog, setMetNPCs, setGold, setCharacter, setEpisode, setDiscoveredClues, handleToggleMerchant, character, gold]);


    // --- Combat Actions Factorisées ---
    const combatActions = useCombatActions({
        character, equipment, combat, inventory, episode, 
        storyActions: { startEpisode2: storyActions.startEpisode2 }, 
        setCharacter, setCombat, setGameState, setGold, setStoryLog, setInventory,
        setStory, setChoices
    });

    // --- Création Personnage Factorisée ---
    const creationActions = useCharacterCreationActions({
        races, classes, startingItems, baseSkills,
        setGameState, setCharacter, setInventory, setEquipment, 
        setSkills, setEpisode,
        storyActions: { startEpisode1: storyActions.startEpisode1 }
    });
    
    // --- Fonction de Choix (Utilise les actions déléguées) ---
    const makeChoice = useCallback((choiceId: number) => { 
        const choice = choices.find(c => c.id === choiceId);
        if (!choice || !character) return;

        // Note: La logique de makeChoice utilise finalStoryActions qui inclut startCombat.
        // Puisque finalStoryActions est une dépendance stable du hook de combat, et est
        // mis à jour via useMemo, makeChoice doit utiliser une version à jour de
        // storyActions.
        
        // C'est ici que l'injection finale de startCombat doit se produire.
        // Pour être sûr, nous recréons l'objet d'actions d'histoire avec la bonne
        // fonction de combat pour makeChoice, en utilisant useMemo et combatActions.startCombat
        
        const finalStoryActionsForChoices = createStoryActions({
            setGameState, setStory, setChoices, setStoryLog, setMetNPCs, setGold, setCharacter, 
            setEpisode, 
            setDiscoveredClues, 
            handleToggleMerchant, 
            startCombat: combatActions.startCombat, // Injecte la VRAIE fonction
            character, gold
        });


        // Condition check
        if (choice.condition && character[choice.condition.stat as StatKey] < choice.condition.min) {
            setStoryLog(prev => [...prev, { episode: episode, text: `Échec du test de ${choice.condition!.stat} requis (${choice.condition!.min}).` }]);
            return;
        }
        
        setChoices([]); 

        switch(choice.result) {
            case 'npc_kaelen':
                finalStoryActionsForChoices.handleKaelenMeeting(); 
                break;
            case 'mercenaries':
                finalStoryActionsForChoices.handleMercenaries();
                break;
            case 'shadow_observe':
                finalStoryActionsForChoices.handleShadowObserve();
                break;
            case 'rest':
                finalStoryActionsForChoices.handleRest();
                break;
            case 'main_road_start':
            case 'continue_exploration':
                finalStoryActionsForChoices.handleMainRoad();
                break;
            case 'forest_path':
                finalStoryActionsForChoices.handleForestPath();
                break;
            case 'hunt_rest':
                finalStoryActionsForChoices.handleHuntRest();
                break;
            case 'open_merchant':
                finalStoryActionsForChoices.handleMerchantVisit();
                break;
            case 'rumors_auberge':
                finalStoryActionsForChoices.handleRumorsAuberge();
                break;
            case 'exit_auberge_continue':
                finalStoryActionsForChoices.handleExitAubergeContinue();
                break;
            default:
                setStory(`Choix non implémenté : ${choice.result}. L'histoire s'arrête ici pour l'instant.`);
                setGameState('playing');
                break;
        }
    }, [choices, character, episode, setStoryLog, setChoices, setStory, setGameState, combatActions.startCombat, setMetNPCs, setGold, setCharacter, setEpisode, setDiscoveredClues, handleToggleMerchant]);


    // --- Fonction de Réinitialisation ---
    const resetGame = useCallback(() => {
        setGameState('menu');
        setCharacter(null);
        setEpisode(1);
        setInventory([]);
        setEquipment({ weapon: null, armor: null });
        setSkills([]);
        setGold(50);
        setStoryLog([]);
        setMetNPCs([]);
    }, []);


    return {
        // State
        gameState, character, episode, story, choices, combat, inventory, 
        equipment, skills, gold, storyLog, metNPCs, races, classes, 
        discoveredClues, shapeshifterForm, merchantOpen, 
        merchantItems, 
        
        // Actions 
        startGame: creationActions.startGame,
        createCharacter: creationActions.createCharacter,
        makeChoice,
        resetGame,

        // Combat Actions
        attack: combatActions.attack,
        handleSkill: combatActions.handleSkill,
        handleConsumable: combatActions.handleConsumable,
        handleDefend: combatActions.handleDefend,
        
        // Merchant Actions
        handleToggleMerchant, 
        handleBuyItem, 
        handleSellItem, 
    };
};

export default useGameState;