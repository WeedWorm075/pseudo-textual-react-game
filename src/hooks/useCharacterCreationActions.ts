// src/hooks/useCharacterCreationActions.ts

import { useCallback } from 'react';
import { 
    CharacterType, AllocatedStats, ConsumableItem, WeaponItem, 
    ArmorItem, SkillType, GameState 
} from '../types/game';

interface CharacterCreationActionsProps {
    races: any; 
    classes: any;
    startingItems: any; 
    baseSkills: any;
    
    // Setters
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterType | null>>;
    setInventory: React.Dispatch<React.SetStateAction<ConsumableItem[]>>;
    setEquipment: React.Dispatch<React.SetStateAction<{ weapon: WeaponItem | null, armor: ArmorItem | null }>>;
    setSkills: React.Dispatch<React.SetStateAction<SkillType[]>>;
    setEpisode: React.Dispatch<React.SetStateAction<number>>;
    
    // Story Actions
    storyActions: { startEpisode1: () => void }; 
}

export const useCharacterCreationActions = ({
    races, classes, startingItems, baseSkills,
    setGameState, setCharacter, setInventory, setEquipment, 
    setSkills, setEpisode, storyActions
}: CharacterCreationActionsProps) => {

    const startGame = useCallback(() => {
        setGameState('creation');
    }, [setGameState]);

    const createCharacter = useCallback((name: string, race: string, selectedClass: string, allocatedStats: AllocatedStats) => {
        const baseStats = { force: 5, intelligence: 5, agilite: 5, chance: 5 };
        const raceStats = races[race as keyof typeof races].stats;
        const classStats = classes[selectedClass as keyof typeof classes].stats;

        const finalStats: CharacterType = {
            name,
            race,
            class: selectedClass,
            force: baseStats.force + raceStats.force + classStats.force + allocatedStats.force,
            intelligence: baseStats.intelligence + raceStats.intelligence + classStats.intelligence + allocatedStats.intelligence,
            agilite: baseStats.agilite + raceStats.agilite + classStats.agilite + allocatedStats.agilite,
            chance: baseStats.chance + raceStats.chance + classStats.chance + allocatedStats.chance,
            energie: raceStats.energie + classStats.energie,
            maxEnergie: raceStats.energie + classStats.energie,
            hp: raceStats.hp + classStats.hp,
            maxHp: raceStats.hp + classStats.hp,
            fatigue: raceStats.fatigue + classStats.fatigue,
            level: 1,
            exp: 0
        };

        setCharacter(finalStats);
        setInventory(startingItems.consumables as ConsumableItem[]); 
        setEquipment({ 
            weapon: startingItems.weapons[0] as WeaponItem, 
            armor: startingItems.armor[0] as ArmorItem 
        });
        setSkills([baseSkills[0] as SkillType]);
        setEpisode(1); 
        storyActions.startEpisode1(); 
    }, [races, classes, startingItems, baseSkills, setCharacter, setInventory, setEquipment, setSkills, setEpisode, storyActions]);

    return {
        startGame,
        createCharacter
    };
};