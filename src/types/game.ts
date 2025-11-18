// src/types/game.ts

// ----------------------------------------------------------------------
// 1. DÉFINITION DES TYPES ET INTERFACES GLOBALES
// ----------------------------------------------------------------------

export type StatKey = 'force' | 'intelligence' | 'agilite' | 'chance';
export type GameState = 'menu' | 'creation' | 'playing' | 'combat' | 'gameOver';
export type AllocatedStats = { [K in StatKey]: number }; // Utilisé par createCharacter

// Types d'Équipement et d'Inventaire
export interface BaseItem {
    id: string;
    name: string;
    grade: string;
    type: string; // 'weapon', 'armor', 'consumable'
}

export interface WeaponItem extends BaseItem {
    damage: number;
    reqForce?: number;
    magicDamage?: number;
    reqInt?: number;
}

export interface ArmorItem extends BaseItem {
    defense: number;
    reqForce?: number;
}

export interface ConsumableItem extends BaseItem {
    effect: 'heal'; // Type littéral strict
    value: number;
}

export interface EquipmentType {
    weapon: WeaponItem | null;
    armor: ArmorItem | null;
}

// Type de Compétence
export interface SkillType {
    id: string;
    name: string;
    cost: number;
    damage: number;
    type: 'physical' | 'magic'; // Union de types littéraux stricts
    desc: string;
}

// Type de Personnage
export interface CharacterType {
    name: string;
    race: string;
    class: string;
    force: number;
    intelligence: number;
    agilite: number;
    chance: number;
    energie: number;
    maxEnergie: number;
    hp: number;
    maxHp: number;
    fatigue: number;
    level: number;
    exp: number;
}

// Types pour l'Histoire et les Choix
export interface ChoiceCondition {
    stat: StatKey;
    min: number;
}

export interface ChoiceType {
    id: number;
    text: string;
    condition: ChoiceCondition | null;
    result: string;
}

export interface StoryLogEntry {
    episode: number;
    text?: string;
    choice?: string;
    clue?: boolean;
}

// Types pour le Combat
export interface EnemyType {
    name: string;
    hp: number;
    maxHp: number;
    damage: number;
    defense: number;
    image: string;
    agility?: number;
}

export interface CombatType {
    enemy: EnemyType;
    playerTurn: boolean;
    log: string[];
    playerEffects: any[];
    enemyEffects: any[];
}

// --- NOUVEAUX TYPES DE JEU ---

// Le nouveau type d'objet inclut le coût pour la boutique
export interface ShopItem extends BaseItem {
  cost: number;
  damage?: number; // Permet aux armes/armures d'être dans la liste avec coût
  defense?: number;
  value?: number; // Pour les consommables
  magicDamage?: number;
  reqForce?: number;
  reqInt?: number;
  effect?: string; // Pour l'antidote, etc.
}

// Les nouvelles variables d'état (pas besoin d'interface, juste pour référence)
export type ClueType = string;
export type ShapeshifterForm = 'human' | 'wolf' | 'raven' | 'bear';

// Interface pour le retour des actions du hook
export interface GameActions {
    startGame: () => void;
    createCharacter: (name: string, race: string, selectedClass: string, allocatedStats: AllocatedStats) => void;
    makeChoice: (choiceId: number) => void;
    resetGame: () => void;
    attack: () => void;
    handleSkill: (skill: SkillType) => void;
    handleConsumable: (item: ConsumableItem) => void;
    handleDefend: (type: 'parry' | 'evade') => void;
    handleToggleMerchant: () => void; // Nouvelle action
    handleBuyItem: (item: ShopItem) => void; // Nouvelle action
    handleSellItem: (item: BaseItem) => void; // Nouvelle action
}