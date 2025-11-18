// src/components/GameUI.tsx

import React from 'react';
import { DollarSign, Package, BookOpen } from 'lucide-react'; 
import StatBar from './StatBar'; // <-- NOUVEL IMPORT
import { 
    CharacterType, EquipmentType, ConsumableItem, ChoiceType, 
    StatKey, 
} from '../types/game';

// --- Interface des Props (selon l'usage dans CrimsonPathRPG.tsx) ---
interface GameUIProps {
    character: CharacterType;
    episode: number;
    story: string;
    choices: ChoiceType[];
    gold: number;
    inventory: ConsumableItem[];
    equipment: EquipmentType;
    makeChoice: (choiceId: number) => void;
}

const GameUI: React.FC<GameUIProps> = ({
    character,
    episode,
    story,
    choices,
    gold,
    inventory,
    equipment,
    makeChoice
}) => {
    // Rendu des stats de base (hors barres)
    const renderStat = (label: string, value: string | number) => (
      <p className="text-sm text-gray-300 flex justify-between">
          <span className="font-semibold">{label}:</span> 
          {/* On s'assure que les nombres sont arrondis pour l'affichage si nécessaire */}
          <span className="text-red-300">{typeof value === 'number' ? Math.round(value) : value}</span>
      </p>
  );

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Colonne de Gauche: STATS, INVENTAIRE, ÉQUIPEMENT (lg: col-span-1) */}
            <div className="lg:col-span-1 space-y-6">

                {/* --- STATISTIQUES DU PERSONNAGE (Utilisation de StatBar) --- */}
                <div className="p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <h3 className="text-lg font-bold mb-3 text-red-400 border-b pb-2 border-gray-700">
                        {character.name} (Nv. {character.level})
                    </h3>
                    
                    {/* UTILISATION DU COMPOSANT STATBAR */}
                    <StatBar 
                        type="hp" 
                        label="Vie" 
                        current={character.hp} 
                        max={character.maxHp} 
                        color="red-500" 
                    />
                    <StatBar 
                        type="energie" 
                        label="Énergie" 
                        current={character.energie} 
                        max={character.maxEnergie} 
                        color="blue-500" 
                    />
                    <StatBar 
                        type="fatigue" 
                        label="Fatigue" 
                        current={character.fatigue} 
                        max={100} // La fatigue est souvent limitée à 100
                        color="gray-500" 
                    />
                    
                    {/* Le reste des stats n'utilisant pas de barre */}
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-1">
            {renderStat("Race", character.race)} 
            {renderStat("Classe", character.class)}
            <hr className="border-gray-700 my-2" />
            {renderStat("Force", character.force)}
            {renderStat("Intelligence", character.intelligence)}
            {renderStat("Agilité", character.agilite)}
            {renderStat("Chance", character.chance)}
            <p className="text-sm text-gray-300">
                 XP: <span className="text-yellow-400">{character.exp}</span> / {character.level * 100}
            </p>
        </div>
                </div>

                {/* Bloc Or */}
                <div className="p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-yellow-500 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Or
                    </h3>
                    <span className="text-2xl font-bold text-yellow-400">{gold}</span>
                </div>

                {/* Bloc Équipement */}
                {/* ... (Affichage de l'équipement) ... */}

                {/* Bloc Inventaire */}
                {/* ... (Affichage de l'inventaire) ... */}

            </div>

            {/* Colonne Droite: HISTOIRE ET CHOIX (lg: col-span-3) */}
            <div className="lg:col-span-3">
                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl min-h-[400px] flex flex-col">
                    
                    {/* Historique/Titre */}
                    <div className="mb-6 border-b pb-4 border-gray-700">
                        <h2 className="text-3xl font-extrabold text-red-300 flex items-center">
                            <BookOpen className="w-6 h-6 mr-3" />
                            Épisode {episode}
                        </h2>
                    </div>

                    {/* Zone d'Histoire */}
                    <p className="text-lg mb-8 whitespace-pre-line text-gray-200 flex-grow">{story}</p>
                    
                    {/* Zone de Choix */}
                    <div className="space-y-3 mt-auto">
                        {choices.length > 0 ? (
                            choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => makeChoice(choice.id)}
                                    className={`w-full text-left p-3 rounded-lg font-semibold transition 
                                        ${
                                            choice.condition && character[choice.condition.stat as StatKey] < choice.condition.min
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-red-500 opacity-70'
                                                : 'bg-red-700 hover:bg-red-600 text-white'
                                        }`}
                                    // CORRECTION SYNTAXE/TS2322: Ajout du prop disabled, forcé en booléen
                                    disabled={!!(choice.condition && character[choice.condition.stat as StatKey] < choice.condition.min)}
                                >
                                    {choice.text}
                                    {choice.condition && character[choice.condition.stat as StatKey] < choice.condition.min && (
                                        <span className="ml-3 text-xs text-red-300 block sm:inline">
                                            (Req: {choice.condition.stat}: {choice.condition.min})
                                        </span>
                                    )}
                                </button>
                            )) // Fin de choices.map
                        ) : (
                            <p className="text-center text-xl text-gray-400">En attente de l'événement suivant...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameUI;