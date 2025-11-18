// src/components/CombatUI.tsx

import React from 'react';
import { Heart, Zap, Swords, Shield, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';

// --- Type Definitions (copied for this file's usage) ---
type StatKey = 'force' | 'intelligence' | 'agilite' | 'chance';

interface CharacterType {
    name: string;
    force: number;
    intelligence: number;
    agilite: number;
    chance: number;
    energie: number;
    maxEnergie: number;
    hp: number;
    maxHp: number;
    // ... other character properties
}

interface BaseItem { id: string; name: string; grade: string; type: string; }
interface ConsumableItem extends BaseItem { effect: 'heal'; value: number; }
interface WeaponItem extends BaseItem { damage: number; reqForce?: number; magicDamage?: number; reqInt?: number; }
interface ArmorItem extends BaseItem { defense: number; reqForce?: number; }

interface EquipmentType {
    weapon: WeaponItem | null;
    armor: ArmorItem | null;
}

interface SkillType {
    id: string;
    name: string;
    cost: number;
    damage: number;
    type: 'physical' | 'magic';
    desc: string;
}

interface EnemyType {
    name: string; hp: number; maxHp: number; damage: number; defense: number; image: string; agility?: number;
}

interface CombatType {
    enemy: EnemyType;
    playerTurn: boolean;
    log: string[];
    playerEffects: any[];
    enemyEffects: any[];
}
// --------------------------------------------------------

interface CombatUIProps {
    combat: CombatType;
    character: CharacterType;
    skills: SkillType[];
    inventory: ConsumableItem[];
    equipment: EquipmentType;
    attack: () => void;
    handleSkill: (skill: SkillType) => void;
    handleConsumable: (item: ConsumableItem) => void;
    handleDefend: (type: 'parry' | 'evade') => void;
}

const CombatUI: React.FC<CombatUIProps> = ({ 
  combat, 
  character, 
  skills, 
  inventory, 
  equipment, 
  attack, 
  handleSkill, 
  handleConsumable, 
  handleDefend 
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-red-600 mb-4">
        <h2 className="text-3xl font-bold text-red-400 text-center mb-6">⚔️ COMBAT ⚔️</h2>
        
        {/* Ennemi */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6 text-center">
          <div className="text-6xl mb-2">{combat.enemy.image}</div>
          <h3 className="text-2xl font-bold mb-2">{combat.enemy.name}</h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="text-red-500" size={20} />
            <span className="font-bold">HP: {combat.enemy.hp}/{combat.enemy.maxHp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 max-w-md mx-auto">
            <div
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${(combat.enemy.hp / combat.enemy.maxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* Joueur */}
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-2">{character.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="text-red-500" size={20} />
            <span>HP: {character.hp}/{character.maxHp}</span>
            <Zap className="text-blue-400 ml-4" size={20} />
            <span>Énergie: {character.energie}/{character.maxEnergie}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
              />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${(character.energie / character.maxEnergie) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Log de combat */}
        <div className="bg-gray-900 p-4 rounded-lg mb-6 max-h-32 overflow-y-auto">
          {combat.log.map((entry, idx) => (
            <div key={idx} className="text-sm text-gray-300 mb-1">
              › {entry}
            </div>
          ))}
        </div>

        {/* Actions */}
        {combat.playerTurn ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={attack}
                className="p-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition"
              >
                ⚔️ Attaque
              </button>
              <button
                onClick={() => handleDefend('parry')}
                className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
              >
                🛡️ Parade
              </button>
              <button
                onClick={() => handleDefend('evade')}
                className="p-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition"
              >
                💨 Esquive
              </button>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-purple-400 mb-2">Compétences</h4>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => handleSkill(skill)}
                      disabled={character.energie < skill.cost}
                      className={`p-3 rounded-lg text-sm transition ${
                        character.energie >= skill.cost
                          ? 'bg-purple-600 hover:bg-purple-500'
                          : 'bg-gray-700 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="font-bold">{skill.name}</div>
                      <div className="text-xs">Coût: {skill.cost} énergie</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Consommables */}
            {inventory.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-yellow-400 mb-2">Consommables</h4>
                <div className="grid grid-cols-3 gap-2">
                  {inventory.filter(item => item.type === 'consumable').map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleConsumable(item)}
                      className="p-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm transition"
                    >
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs">+{item.value} HP</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-xl text-gray-400">
            Tour de l'ennemi...
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatUI;