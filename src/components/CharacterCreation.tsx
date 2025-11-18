// src/components/CharacterCreation.tsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- NOUVELLES DÉFINITIONS DE TYPES POUR FIXER LES ERREURS TS ---

// 1. Définit l'union des clés de statistiques valides
type StatKey = 'force' | 'intelligence' | 'agilite' | 'chance';

// 2. CORRECTION TS1337 / TS2339 :
// Utilise un Mapped Type pour définir l'interface AllocatedStats.
// Cela garantit que l'objet possède EXACTEMENT ces clés et permet l'accès par notation pointée (allocatedStats.force).
type AllocatedStats = {
  [K in StatKey]: number;
};

// CharacterCreationProps: Defines the props this component expects from the parent (CrimsonPathRPG)
interface CharacterCreationProps {
  races: any; // Idéalement un type Race spécifique, mais 'any' pour l'instant
  classes: any; // Idéalement un type Class spécifique
  // Met à jour le type pour utiliser l'interface AllocatedStats
  createCharacter: (name: string, race: string, selectedClass: string, allocatedStats: AllocatedStats) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ races, classes, createCharacter }) => {
  // --- Internal Component State ---
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  // Correction TS2345: Définit le type comme string OU null
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [allocatedPoints, setAllocatedPoints] = useState(5);
  // Utilise le type AllocatedStats
  const [allocatedStats, setAllocatedStats] = useState<AllocatedStats>({
    force: 0,
    intelligence: 0,
    agilite: 0,
    chance: 0
  });

  // --- Helper Functions ---

  // Correction TS7053: Type le paramètre stat en StatKey
  const allocateStat = (stat: StatKey, amount: number) => {
    // Prevent allocating negative points or using more than available
    if (allocatedPoints === 0 && amount > 0) return;
    // Maintenant, nous pouvons accéder via allocatedStats[stat] ou allocatedStats.stat
    if (allocatedStats[stat] === 0 && amount < 0) return; 

    setAllocatedPoints(prev => prev - amount);
    setAllocatedStats(prev => ({
      ...prev,
      [stat]: prev[stat] + amount
    }));
  };

  const renderRaceStats = (raceKey: string) => {
    const race = races[raceKey];
    if (!race) return null;

    // A small function to combine base stats + allocated stats for display
    // Correction TS2339: L'accès par notation pointée est maintenant valide grâce au Mapped Type
    const finalStats = {
        force: 5 + race.stats.force + (selectedClass ? classes[selectedClass].stats.force : 0) + allocatedStats.force,
        intelligence: 5 + race.stats.intelligence + (selectedClass ? classes[selectedClass].stats.intelligence : 0) + allocatedStats.intelligence,
        agilite: 5 + race.stats.agilite + (selectedClass ? classes[selectedClass].stats.agilite : 0) + allocatedStats.agilite,
        chance: 5 + race.stats.chance + (selectedClass ? classes[selectedClass].stats.chance : 0) + allocatedStats.chance,
    };

    return (
        <div className="text-sm mt-2 p-2 bg-gray-800 rounded">
            <h4 className="font-bold text-red-300">Statistiques de Base (Après Race/Classe) :</h4>
            <ul className="list-disc ml-4 text-gray-300">
                {/* Suppression de l'assertion de type, car 'key' est ici juste une string, mais la logique est correcte */}
                {Object.entries(finalStats).map(([key, value]) => (
                    <li key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: <span className="font-mono text-red-400">{value}</span>
                        {/* Correction TS7053: Utilisation de l'assertion 'key as StatKey' pour accéder à allocatedStats */}
                        {key in allocatedStats && allocatedStats[key as StatKey] > 0 && ` (+${allocatedStats[key as StatKey]})`}
                    </li>
                ))}
            </ul>
        </div>
    );
  };
  
  const canProceed = () => {
    switch (step) {
      case 1: // Name
        return name.length >= 3;
      case 2: // Race
        return selectedRace !== null;
      case 3: // Class
        // CORRECTION: Supprime la vérification des stats minimales.
        return selectedClass !== null && selectedRace !== null;
        
      case 4: // Allocation
        return allocatedPoints === 0; // Doit utiliser tous les points
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (step < 4) {
        setStep(prev => prev + 1);
      } else {
        // Final Step: Call the parent function to start the game
        // Correction TS2345: Utilisation de l'opérateur '!' car selectedRace/selectedClass sont garantis non-null ici
        createCharacter(name, selectedRace!, selectedClass!, allocatedStats);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  // --- Rendering Logic (JSX) ---

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl border border-red-900">
      <h2 className="text-3xl font-bold text-red-400 mb-6 border-b border-red-700 pb-2">Création de Personnage - Étape {step}/4</h2>

      {/* STEP 1: Name */}
      {step === 1 && (
        <div>
          <h3 className="text-xl mb-4">1. Quel est votre nom, étranger ?</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez le nom de votre héros..."
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:border-red-500 focus:outline-none"
          />
          <p className="mt-2 text-sm text-gray-400">Le nom doit comporter au moins 3 lettres.</p>
        </div>
      )}

      {/* STEP 2: Race */}
      {step === 2 && (
        <div>
          <h3 className="text-xl mb-4">2. Choisissez votre Race :</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(races).map(([key, race]: [string, any]) => (
              <button
                key={key}
                onClick={() => setSelectedRace(key)}
                className={`p-4 rounded-lg text-left transition ${selectedRace === key ? 'bg-red-700 border-2 border-red-400' : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'}`}
              >
                <div className="font-bold text-lg">{race.name}</div>
                <div className="text-sm text-gray-300 italic">{race.desc}</div>
                <div className="text-xs mt-1 text-red-200">
                    Force: {race.stats.force >= 0 ? '+' : ''}{race.stats.force}, 
                    Int: {race.stats.intelligence >= 0 ? '+' : ''}{race.stats.intelligence}, 
                    Agil: {race.stats.agilite >= 0 ? '+' : ''}{race.stats.agilite}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Class */}
      {step === 3 && (
        <div>
          <h3 className="text-xl mb-4">3. Choisissez votre Classe :</h3>
          {selectedRace && <p className="mb-4 text-md text-red-200">Race sélectionnée : <span className="font-bold">{races[selectedRace].name}</span></p>}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(classes).map(([key, cls]: [string, any]) => {
                // CORRECTION: Supprime la logique de vérification et d'affichage des prérequis
                
                return (
                    <button
                        key={key}
                        onClick={() => setSelectedClass(key)}
                        // CORRECTION: Supprime l'attribut disabled basé sur les prérequis
                        className={`p-4 rounded-lg text-left transition ${selectedClass === key ? 'bg-red-700 border-2 border-red-400' : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'}`}
                    >
                        <div className="font-bold text-lg">{cls.name}</div>
                        <div className="text-sm text-gray-300 italic">{cls.desc}</div>
                        {/* CORRECTION: Le bloc d'affichage des prérequis (minStatsDisplay) est supprimé */}
                    </button>
                );
            })}
          </div>
          {selectedRace && selectedClass && renderRaceStats(selectedRace)}
        </div>
      )}

      {/* STEP 4: Stat Allocation */}
      {step === 4 && (
        <div>
          <h3 className="text-xl mb-4">4. Allouez vos Points de Compétence :</h3>
          <p className="mb-4 text-2xl font-mono text-red-400">
            Points Restants: <span className="font-extrabold">{allocatedPoints}</span>
          </p>

          {/* Utilisation de l'assertion pour itérer sur les StatKey */}
          {(['force', 'intelligence', 'agilite', 'chance'] as StatKey[]).map(stat => (
            <div key={stat} className="flex items-center justify-between p-3 mb-3 bg-gray-700 rounded-lg">
              <span className="w-1/4 font-bold capitalize text-red-300">{stat}</span>
              <div className="w-2/4 text-center font-mono text-xl">
                {/* Correction TS2538/TS7053: Utilisation de '!' sur race/class et accès direct à allocatedStats[stat] */}
                {5 + (races[selectedRace!]?.stats[stat] || 0) + (classes[selectedClass!]?.stats[stat] || 0) + allocatedStats[stat]}
                <span className="text-sm text-gray-400"> ({allocatedStats[stat] >= 0 ? '+' : ''}{allocatedStats[stat]})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => allocateStat(stat, -1)}
                  disabled={allocatedStats[stat] === 0}
                  className="p-1 bg-red-600 hover:bg-red-500 rounded-full disabled:bg-gray-500"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => allocateStat(stat, 1)}
                  disabled={allocatedPoints === 0}
                  className="p-1 bg-green-600 hover:bg-green-500 rounded-full disabled:bg-gray-500"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 border-t border-gray-700 pt-4">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded transition disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-6 py-2 rounded transition font-bold ${canProceed() ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'}`}
        >
          {step < 4 ? 'Suivant' : 'Terminer & Commencer'}
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;