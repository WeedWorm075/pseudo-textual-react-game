// src/hooks/useCombatActions.ts

import { useCallback } from 'react';
import { 
    CharacterType, CombatType, EquipmentType, SkillType, ConsumableItem, 
    EnemyType, StoryLogEntry, GameState
} from '../types/game';

// --- HELPER : Vérifier et appliquer le gain de niveau ---
const checkLevelUp = (
    character: CharacterType, 
    currentExp: number, 
    newExp: number, 
    episode: number, 
    setStoryLog: React.Dispatch<React.SetStateAction<StoryLogEntry[]>>
): CharacterType => {
    
    const requiredExp = (character.level) * 100;
    
    if (newExp >= requiredExp) {
        const newLevel = character.level + 1;
        
        const newCharacter: CharacterType = {
            ...character,
            level: newLevel,
            exp: newExp - requiredExp, // XP restante
            maxHp: character.maxHp + 10,
            maxEnergie: character.maxEnergie + 5,
            hp: character.maxHp + 10, // Soin complet au level up
            energie: character.maxEnergie + 5,
        };

        setStoryLog(prev => [...prev, { episode: episode, text: `🎉 NIVEAU SUPÉRIEUR ! Vous atteignez le niveau ${newLevel} !` }]);
        
        return newCharacter;
    }
    
    return { ...character, exp: newExp };
};

interface CombatActionsProps {
    character: CharacterType | null;
    equipment: EquipmentType;
    combat: CombatType | null;
    inventory: ConsumableItem[];
    episode: number;
    
    // Setters
    setCharacter: React.Dispatch<React.SetStateAction<CharacterType | null>>;
    setCombat: React.Dispatch<React.SetStateAction<CombatType | null>>;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    setGold: React.Dispatch<React.SetStateAction<number>>;
    setStoryLog: React.Dispatch<React.SetStateAction<StoryLogEntry[]>>;
    setInventory: React.Dispatch<React.SetStateAction<ConsumableItem[]>>;
    setStory: React.Dispatch<React.SetStateAction<string>>;
    setChoices: React.Dispatch<React.SetStateAction<any[]>>;
    
    // Story Actions
    storyActions: { startEpisode2: () => void }; 
}

export const useCombatActions = ({ 
    character, equipment, combat, inventory, episode, storyActions, 
    setCharacter, setCombat, setGameState, setGold, setStoryLog, setInventory,
    setStory, setChoices
}: CombatActionsProps) => {

    // Déclarez endCombat pour être réutilisée par enemyTurn
    const endCombat = useCallback((victory: boolean, finalLog: string[]) => { 
        if (!combat || !character) return;

        if (victory) {
            const expGain = 20;
            const goldGain = Math.floor(Math.random() * 20) + 10;
            const newExp = character.exp + expGain;
            
            // 1. Vérifier le Level Up
            const newCharacter = checkLevelUp(character, character.exp, newExp, episode, setStoryLog);
            setCharacter(newCharacter);
            
            // 2. Gain d'Or et Log
            setGold(prev => prev + goldGain);
            
            const victoryStory = `Victoire ! Vous avez vaincu ${combat.enemy.name}. Vous gagnez ${expGain} XP et ${goldGain} Or. Votre corps et votre esprit sont revigorés après cette épreuve.`;
            setStoryLog(prev => [...prev, { episode: episode, text: `Combat terminé. Gain: ${expGain} XP, ${goldGain} Or.` }]);

            // 3. Logique de Progression Clé
            if (episode === 1) {
                storyActions.startEpisode2();
            } else {
                setStory(victoryStory);
                setChoices([
                    { id: 99, text: 'Continuer l\'exploration', condition: null, result: 'continue_exploration' },
                ]);
                setGameState('playing');
                setCombat(null);
            }
        } else {
            setGameState('gameOver');
            setCombat(null);
        }
    }, [combat, character, episode, setCharacter, setGold, setStoryLog, setStory, setChoices, setGameState, setCombat, storyActions]);

    const enemyTurn = useCallback((currentEnemyHp: number, currentLog: string[]) => { 
        if (!combat || !character) return;
        const damage = combat.enemy.damage || 8;
        const armor = equipment.armor ? equipment.armor.defense : 0;
        const finalDamage = Math.max(1, damage - armor);
        
        const newHp = character.hp - finalDamage;
        const newLog = [...currentLog, `${combat.enemy.name} attaque pour ${finalDamage} dégâts`];

        setCharacter(prev => prev ? ({ ...prev, hp: newHp }) : null);

        if (newHp <= 0) {
            endCombat(false, newLog);
        } else {
            setCombat(prev => prev ? ({
                ...prev,
                enemy: { ...prev.enemy, hp: currentEnemyHp },
                log: newLog,
                playerTurn: true
            }) : null);
        }
    }, [combat, character, equipment.armor, setCharacter, setCombat, endCombat]);

    const startCombat = useCallback((enemy: EnemyType) => { 
        setCombat({
            enemy: enemy,
            playerTurn: true,
            log: ['Le combat commence !'],
            playerEffects: [],
            enemyEffects: []
        });
        setGameState('combat');
    }, [setCombat, setGameState]);

    const attack = useCallback(() => {
        if (!combat || !character || !combat.playerTurn) return;
        
        const weapon = equipment.weapon;
        let damage = weapon ? weapon.damage : 5;
        damage += Math.floor(character.force / 2);
        
        // Critique logic...
        const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
        const newEnemyHp = combat.enemy.hp - finalDamage;
        const isCrit = Math.random() * 100 < character.chance * 2;
        const newLog = [...combat.log, `Vous attaquez pour ${finalDamage} dégâts${isCrit ? ' (CRITIQUE !)' : ''}`];

        if (newEnemyHp <= 0) {
            endCombat(true, newLog);
        } else {
            setCombat(prev => prev ? ({
                ...prev,
                enemy: { ...prev.enemy, hp: newEnemyHp },
                log: newLog,
                playerTurn: false
            }) : null);
            setTimeout(() => enemyTurn(newEnemyHp, newLog), 1000);
        }
    }, [combat, character, equipment.weapon, endCombat, enemyTurn, setCombat]);

    const handleSkill = useCallback((skill: SkillType) => { 
        if (!combat || !character || !combat.playerTurn) return;
        
        if (character.energie < skill.cost) {
            alert('Pas assez d\'énergie !');
            return;
        }

        const damage = skill.damage + Math.floor(character.force / 2);
        const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
        const newEnemyHp = combat.enemy.hp - finalDamage;
        const newLog = [...combat.log, `${skill.name} ! ${finalDamage} dégâts`];

        setCharacter(prev => prev ? ({ ...prev, energie: prev.energie - skill.cost }) : null);

        if (newEnemyHp <= 0) {
            endCombat(true, newLog);
        } else {
            setCombat(prev => prev ? ({
                ...prev,
                enemy: { ...prev.enemy, hp: newEnemyHp },
                log: newLog,
                playerTurn: false
            }) : null);
            setTimeout(() => enemyTurn(newEnemyHp, newLog), 1000);
        }
    }, [combat, character, endCombat, enemyTurn, setCharacter, setCombat]);

    const handleConsumable = useCallback((item: ConsumableItem) => { 
        if (!combat || !character || !combat.playerTurn) return;

        let newLog = [...combat.log];
        let newChar = { ...character };

        if (item.effect === 'heal') {
            newChar.hp = Math.min(newChar.hp + item.value, newChar.maxHp);
            newLog.push(`Vous utilisez ${item.name} et récupérez ${item.value} HP`);
        }

        setCharacter(newChar);
        setInventory(prev => prev.filter(i => i.id !== item.id));
        setCombat(prev => prev ? ({ ...prev, log: newLog, playerTurn: false }) : null);
        
        setTimeout(() => enemyTurn(combat.enemy.hp, newLog), 1000);
    }, [combat, character, enemyTurn, setCharacter, setInventory, setCombat]);

    const handleDefend = useCallback((type: 'parry' | 'evade') => { 
        if (!combat || !character || !combat.playerTurn) return;

        const newLog = [...combat.log];
        let success = false;

        if (type === 'parry') {
            const parryChance = character.force * 3 + character.agilite * 2;
            success = Math.random() * 100 < parryChance;
        } else if (type === 'evade') {
            const evadeChance = character.agilite * 3 + character.chance * 2;
            success = Math.random() * 100 < evadeChance;
        }

        if (success) {
            newLog.push(`${type === 'parry' ? 'Parade' : 'Esquive'} réussie !`);
        } else {
            newLog.push(`${type === 'parry' ? 'Parade' : 'Esquive'} ratée !`);
        }
        
        setCombat(prev => prev ? ({ ...prev, log: newLog, playerTurn: false }) : null);
        setTimeout(() => enemyTurn(combat.enemy.hp, newLog), 1000);
        
    }, [combat, character, enemyTurn, setCombat]);

    return {
        startCombat,
        attack,
        handleSkill,
        handleConsumable,
        handleDefend,
    };
};