import React, { useState, useEffect } from 'react';
import { Heart, Zap, Battery, Swords, Shield, Users, Book, Package, X } from 'lucide-react';

const CrimsonPathRPG = () => {
  const [gameState, setGameState] = useState('menu'); // menu, creation, playing, combat, gameOver
  const [character, setCharacter] = useState(null);
  const [episode, setEpisode] = useState(1);
  const [story, setStory] = useState('');
  const [choices, setChoices] = useState([]);
  const [combat, setCombat] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({ weapon: null, armor: null });
  const [skills, setSkills] = useState([]);
  const [gold, setGold] = useState(50);
  const [storyLog, setStoryLog] = useState([]);
  const [metNPCs, setMetNPCs] = useState([]);

  // Données de races
  const races = {
    humain: {
      name: 'Humain',
      desc: 'Équilibré avec un surplus d\'intelligence',
      stats: { force: 0, intelligence: 3, agilite: 0, chance: 0, energie: 100, hp: 100, fatigue: 0 }
    },
    miHomme: {
      name: 'Mi-Homme',
      desc: 'Grande force et endurance, moins agile',
      stats: { force: 5, intelligence: -2, agilite: -1, chance: 0, energie: 110, hp: 100, fatigue: 0 }
    },
    witch: {
      name: 'Witch',
      desc: 'Puissance magique, faible en force',
      stats: { force: -3, intelligence: 5, agilite: 0, chance: -1, energie: 100, hp: 100, fatigue: -10 }
    },
    druide: {
      name: 'Druide',
      desc: 'Chanceux et sage, mais fragile',
      stats: { force: -4, intelligence: 2, agilite: -1, chance: 4, energie: 110, hp: 80, fatigue: 0 }
    },
    hybride: {
      name: 'Hybride',
      desc: 'Équilibré et agile, mais fatigue vite',
      stats: { force: 0, intelligence: 0, agilite: 2, chance: 0, energie: 110, hp: 110, fatigue: 15 }
    }
  };

  // Données de classes
  const classes = {
    martialArtist: {
      name: 'Martial Artist',
      desc: 'Combattant rapproché, robuste',
      stats: { force: 2, intelligence: 0, agilite: 1, chance: 2, energie: 0, hp: 20, fatigue: 0 },
      minStats: { force: 5 }
    },
    shapeshifter: {
      name: 'Shapeshifter',
      desc: '3 formes de transformation',
      stats: { force: 1, intelligence: 0, agilite: 2, chance: 0, energie: 10, hp: 10, fatigue: 0 },
      minStats: { agilite: 5 }
    },
    surnaturel: {
      name: 'Surnaturel',
      desc: 'Gros dégâts magiques, coûteux',
      stats: { force: 0, intelligence: 4, agilite: 0, chance: 0, energie: -10, hp: 0, fatigue: 5 },
      minStats: { intelligence: 6 }
    },
    engineer: {
      name: 'Engineer',
      desc: 'Maître des artefacts',
      stats: { force: 0, intelligence: 2, agilite: 0, chance: 1, energie: 0, hp: 15, fatigue: 3 },
      minStats: { intelligence: 4 }
    },
    mystic: {
      name: 'Mystic',
      desc: 'Sage et chanceux, mais fragile',
      stats: { force: 0, intelligence: 3, agilite: 0, chance: 3, energie: 0, hp: -10, fatigue: 0 },
      minStats: { intelligence: 5, chance: 3 }
    }
  };

  // Items de départ
  const startingItems = {
    weapons: [
      { id: 'w1', name: 'Épée Rouillée', grade: 'piteux', type: 'weapon', damage: 5, reqForce: 3 },
      { id: 'w2', name: 'Bâton de Novice', grade: 'piteux', type: 'weapon', damage: 3, magicDamage: 4, reqInt: 3 }
    ],
    armor: [
      { id: 'a1', name: 'Tunique en Lambeaux', grade: 'piteux', type: 'armor', defense: 2, reqForce: 2 }
    ],
    consumables: [
      { id: 'c1', name: 'Potion Mineure', grade: 'piteux', type: 'consumable', effect: 'heal', value: 20 },
      { id: 'c2', name: 'Potion Mineure', grade: 'piteux', type: 'consumable', effect: 'heal', value: 20 }
    ]
  };

  // Skills de base
  const baseSkills = [
    { id: 's1', name: 'Frappe Puissante', cost: 15, damage: 15, type: 'physical', desc: 'Attaque basée sur Force' },
    { id: 's2', name: 'Projectile Magique', cost: 15, damage: 12, type: 'magic', desc: 'Attaque basée sur Intelligence' }
  ];

  const startGame = () => {
    setGameState('creation');
  };

  const createCharacter = (name, race, selectedClass, allocatedStats) => {
    const baseStats = { force: 5, intelligence: 5, agilite: 5, chance: 5 };
    const raceStats = races[race].stats;
    const classStats = classes[selectedClass].stats;

    const finalStats = {
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
    setInventory([...startingItems.consumables]);
    setEquipment({ weapon: startingItems.weapons[0], armor: startingItems.armor[0] });
    setSkills([baseSkills[0]]);
    startEpisode1();
  };

  const startEpisode1 = () => {
    setGameState('playing');
    setEpisode(1);
    const storyText = `La Taverne du Crépuscule baigne dans une lumière dorée tamisée. L'odeur du pain frais et de l'hydromel flotte dans l'air. Vous venez d'arriver dans cette bourgade frontière entre l'Ouest chevaleresque et l'Est mystique.

Au comptoir, un vieillard aux yeux perçants vous observe. "Encore un voyageur sur la Voie Écarlate..." murmure-t-il avant de détourner le regard. Ces mots résonnent étrangement en vous.

Dans un coin sombre, une silhouette encapuchonnée semble vous surveiller. À une table bruyante, des mercenaires discutent d'une ruine récemment découverte. Le tavernier nettoie des chopes en sifflotant.

Votre aventure commence ici, étranger.`;
    
    setStory(storyText);
    setChoices([
      { 
        id: 1, 
        text: 'Approcher le vieillard et lui demander ce qu\'il sait sur la "Voie Écarlate"',
        condition: null,
        result: 'npc_kaelen'
      },
      { 
        id: 2, 
        text: 'Rejoindre les mercenaires et écouter leurs histoires de ruines',
        condition: null,
        result: 'mercenaries'
      },
      { 
        id: 3, 
        text: 'Observer discrètement la silhouette encapuchonnée',
        condition: { stat: 'agilite', min: 7 },
        result: 'shadow_observe'
      },
      { 
        id: 4, 
        text: 'Commander à boire et vous reposer (-10 Fatigue, -5 Or)',
        condition: null,
        result: 'rest'
      }
    ]);
    setStoryLog([{ episode: 1, text: 'Arrivée à la Taverne du Crépuscule' }]);
  };

  const makeChoice = (choiceId) => {
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Traiter le résultat du choix
    switch(choice.result) {
      case 'npc_kaelen':
        handleKaelenMeeting();
        break;
      case 'mercenaries':
        handleMercenaries();
        break;
      case 'shadow_observe':
        handleShadowObserve();
        break;
      case 'rest':
        handleRest();
        break;
      default:
        break;
    }
  };

  const handleKaelenMeeting = () => {
    setMetNPCs([...metNPCs, 'Kaelen']);
    const newStory = `Vous vous approchez du vieillard. Ses yeux sont d'un bleu profond, presque luminescent.

"Ah, je vois que mes paroles ont éveillé votre curiosité..." Il sourit mystérieusement. "Je m'appelle Kaelen. La Voie Écarlate n'est pas un simple chemin, jeune voyageur. C'est une destinée tissée dans le sang des anciens."

Il trace un symbole étrange sur le comptoir avec son doigt. "Trois lunes s'aligneront bientôt. Quand la rouge avalera les deux autres, les portes s'ouvriront. Souvenez-vous de cela."

Avant que vous puissiez poser plus de questions, un cri retentit à l'extérieur. Des bandits attaquent la taverne !`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Rencontre avec Kaelen le Vagabond' }]);
    
    // Démarrer un combat
    setTimeout(() => {
      startCombat({
        name: 'Bandit Ivre',
        hp: 40,
        maxHp: 40,
        damage: 8,
        defense: 2,
        image: '🗡️'
      });
    }, 2000);
  };

  const handleMercenaries = () => {
    const newStory = `Vous vous joignez aux mercenaires. Leur chef, une femme bourrue aux cicatrices impressionnantes, vous accueille d'un hochement de tête.

"Une nouvelle tête ! Bienvenue, étranger. On parlait justement des Ruines du Croissant Noir. Paraît qu'il y a un trésor là-bas, mais aussi des créatures... étranges."

Un mercenaire moustachu ajoute : "J'ai entendu dire que seuls ceux marqués par la destinée peuvent y entrer sans périr." Il rit nerveusement.

Soudain, la porte de la taverne explose ! Des bandits font irruption !`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Discussion avec les mercenaires' }]);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Armé',
        hp: 45,
        maxHp: 45,
        damage: 10,
        defense: 3,
        image: '⚔️'
      });
    }, 2000);
  };

  const handleShadowObserve = () => {
    const newStory = `Vous faites semblant de boire tout en observant la silhouette. Vos réflexes aiguisés vous permettent de remarquer des détails que d'autres auraient manqués.

La silhouette porte une broche en argent : un croissant de lune transpercé par une épée. Un symbole que vous ne reconnaissez pas encore, mais qui semble important.

Elle se lève soudainement et sort par la porte arrière. Vous avez le temps de voir son visage un instant : des yeux rouges comme le sang.

Un instant plus tard, des cris éclatent. Des bandits attaquent !

[INDICE DÉCOUVERT : Le Croissant Transpercé]`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Observation de l\'Ombre Silencieuse', clue: true }]);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Rusé',
        hp: 35,
        maxHp: 35,
        damage: 7,
        defense: 2,
        agility: 5,
        image: '🏹'
      });
    }, 2000);
  };

  const handleRest = () => {
    if (gold < 5) {
      alert('Pas assez d\'or !');
      return;
    }

    setGold(gold - 5);
    setCharacter({
      ...character,
      fatigue: Math.max(0, character.fatigue - 10)
    });

    const newStory = `Vous commandez une chope d'hydromel et vous installez confortablement. La fatigue du voyage s'estompe progressivement. Le tavernier engage la conversation.

"Vous avez l'air d'un aventurier. Faites attention par ici, les temps sont troubles. On parle de plus en plus de la Voie Écarlate, et ça attire toutes sortes de gens... et de créatures."

Il vous glisse discrètement : "Si jamais vous trouvez quelque chose d'intéressant dans vos voyages, revenez me voir. J'achète et je vends."

Votre repos est interrompu par des cris à l'extérieur. Des bandits !`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Repos à la taverne' }]);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Commun',
        hp: 38,
        maxHp: 38,
        damage: 8,
        defense: 2,
        image: '🪓'
      });
    }, 2000);
  };

  const startCombat = (enemy) => {
    setCombat({
      enemy: enemy,
      playerTurn: true,
      log: ['Le combat commence !'],
      playerEffects: [],
      enemyEffects: []
    });
    setGameState('combat');
  };

  const attack = () => {
    if (!combat.playerTurn) return;

    const weapon = equipment.weapon;
    let damage = weapon ? weapon.damage : 5;
    
    // Bonus de force
    damage += Math.floor(character.force / 2);

    // Critique
    const critChance = character.chance * 2;
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) damage *= 2;

    const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
    
    const newEnemyHp = combat.enemy.hp - finalDamage;
    const newLog = [...combat.log, `Vous attaquez pour ${finalDamage} dégâts${isCrit ? ' (CRITIQUE !)' : ''}`];

    if (newEnemyHp <= 0) {
      endCombat(true, newLog);
    } else {
      setCombat({
        ...combat,
        enemy: { ...combat.enemy, hp: newEnemyHp },
        log: newLog,
        playerTurn: false
      });
      setTimeout(() => enemyTurn(newEnemyHp, newLog), 1000);
    }
  };

  const useSkill = (skill) => {
    if (!combat.playerTurn) return;
    if (character.energie < skill.cost) {
      alert('Pas assez d\'énergie !');
      return;
    }

    let damage = skill.damage;
    if (skill.type === 'physical') {
      damage += Math.floor(character.force / 2);
    } else if (skill.type === 'magic') {
      damage += Math.floor(character.intelligence / 2);
    }

    const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
    const newEnemyHp = combat.enemy.hp - finalDamage;
    const newLog = [...combat.log, `${skill.name} ! ${finalDamage} dégâts`];

    setCharacter({ ...character, energie: character.energie - skill.cost });

    if (newEnemyHp <= 0) {
      endCombat(true, newLog);
    } else {
      setCombat({
        ...combat,
        enemy: { ...combat.enemy, hp: newEnemyHp },
        log: newLog,
        playerTurn: false
      });
      setTimeout(() => enemyTurn(newEnemyHp, newLog), 1000);
    }
  };

  const useConsumable = (item) => {
    if (!combat.playerTurn) return;

    let newLog = [...combat.log];
    let newChar = { ...character };
    let newCombat = { ...combat };

    if (item.effect === 'heal') {
      newChar.hp = Math.min(newChar.hp + item.value, newChar.maxHp);
      newLog.push(`Vous utilisez ${item.name} et récupérez ${item.value} HP`);
    }

    setCharacter(newChar);
    setInventory(inventory.filter(i => i.id !== item.id));
    setCombat({ ...newCombat, log: newLog, playerTurn: false });
    
    setTimeout(() => enemyTurn(combat.enemy.hp, newLog), 1000);
  };

  const defend = (type) => {
    if (!combat.playerTurn) return;

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
      setCombat({ ...combat, log: newLog, playerTurn: true });
    } else {
      newLog.push(`${type === 'parry' ? 'Parade' : 'Esquive'} ratée !`);
      setCombat({ ...combat, log: newLog, playerTurn: false });
      setTimeout(() => enemyTurn(combat.enemy.hp, newLog), 1000);
    }
  };

  const enemyTurn = (currentEnemyHp, currentLog) => {
    const damage = combat.enemy.damage || 8;
    const armor = equipment.armor ? equipment.armor.defense : 0;
    const finalDamage = Math.max(1, damage - armor);
    
    const newHp = character.hp - finalDamage;
    const newLog = [...currentLog, `${combat.enemy.name} attaque pour ${finalDamage} dégâts`];

    setCharacter({ ...character, hp: newHp });

    if (newHp <= 0) {
      endCombat(false, newLog);
    } else {
      setCombat({
        ...combat,
        enemy: { ...combat.enemy, hp: currentEnemyHp },
        log: newLog,
        playerTurn: true
      });
    }
  };

  const endCombat = (victory, finalLog) => {
    if (victory) {
      const expGain = 20;
      const goldGain = Math.floor(Math.random() * 20) + 10;
      
      setCharacter({
        ...character,
        exp: character.exp + expGain
      });
      setGold(gold + goldGain);

      const victoryStory = `Victoire ! Vous avez vaincu ${combat.enemy.name}.

La taverne retrouve son calme. Les clients vous regardent avec respect. Le tavernier vous offre une tournée gratuite.

"Bien joué, aventurier ! Vous avez du potentiel. La Voie Écarlate vous attend peut-être vraiment..."

Vous avez gagné ${expGain} EXP et ${goldGain} or.

[FIN DE L'ÉPISODE 1]

(Ce premier épisode démontre les mécaniques de base. Les épisodes suivants seront ajoutés avec plus de profondeur narrative, de choix conditionnels, et de conséquences à long terme.)`;

      setStory(victoryStory);
      setChoices([]);
      setGameState('playing');
      setCombat(null);
    } else {
      setGameState('gameOver');
      setCombat(null);
    }
  };

  // Composant de création de personnage
  const CharacterCreation = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedRace, setSelectedRace] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [pointsToAllocate, setPointsToAllocate] = useState(10);
    const [allocatedStats, setAllocatedStats] = useState({ force: 0, intelligence: 0, agilite: 0, chance: 0 });

    const allocateStat = (stat, value) => {
      const newAlloc = { ...allocatedStats };
      const diff = value - newAlloc[stat];
      
      if (pointsToAllocate - diff >= 0 && value >= 0) {
        newAlloc[stat] = value;
        setAllocatedStats(newAlloc);
        setPointsToAllocate(pointsToAllocate - diff);
      }
    };

    const canProceed = () => {
      if (step === 1) return name.length > 0;
      if (step === 2) return selectedRace !== '';
      if (step === 3) {
        if (selectedClass === '') return false;
        const minStats = classes[selectedClass].minStats;
        const baseStats = { force: 5, intelligence: 5, agilite: 5, chance: 5 };
        const raceStats = races[selectedRace].stats;
        
        for (let stat in minStats) {
          const total = baseStats[stat] + raceStats[stat] + allocatedStats[stat];
          if (total < minStats[stat]) return false;
        }
        return true;
      }
      return false;
    };

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-red-400">Création de Personnage</h2>
        
        {step === 1 && (
          <div>
            <h3 className="text-xl mb-4">Quel est votre nom, voyageur ?</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Entrez votre nom..."
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl mb-4">Choisissez votre race</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(races).map(([key, race]) => (
                <div
                  key={key}
                  onClick={() => setSelectedRace(key)}
                  className={`p-4 border-2 rounded cursor-pointer transition ${
                    selectedRace === key ? 'border-red-500 bg-gray-700' : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h4 className="text-lg font-bold text-red-300">{race.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{race.desc}</p>
                  <div className="text-xs text-gray-400">
                    <div>FOR: {race.stats.force >= 0 ? '+' : ''}{race.stats.force}</div>
                    <div>INT: {race.stats.intelligence >= 0 ? '+' : ''}{race.stats.intelligence}</div>
                    <div>AGI: {race.stats.agilite >= 0 ? '+' : ''}{race.stats.agilite}</div>
                    <div>CHA: {race.stats.chance >= 0 ? '+' : ''}{race.stats.chance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl mb-4">Choisissez votre classe et allouez vos stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(classes).map(([key, cls]) => (
                <div
                  key={key}
                  onClick={() => setSelectedClass(key)}
                  className={`p-4 border-2 rounded cursor-pointer transition ${
                    selectedClass === key ? 'border-red-500 bg-gray-700' : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h4 className="text-lg font-bold text-red-300">{cls.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{cls.desc}</p>
                  <div className="text-xs text-gray-400">
                    Minimum requis:
                    {Object.entries(cls.minStats).map(([stat, val]) => (
                      <div key={stat}>{stat.toUpperCase()}: {val}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedClass && (
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="text-lg mb-3">Points à allouer: {pointsToAllocate}</h4>
                {['force', 'intelligence', 'agilite', 'chance'].map(stat => {
                  const base = 5;
                  const race = races[selectedRace].stats[stat];
                  const cls = classes[selectedClass].stats[stat];
                  const alloc = allocatedStats[stat];
                  const total = base + race + cls + alloc;
                  const min = classes[selectedClass].minStats[stat] || 0;

                  return (
                    <div key={stat} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="capitalize">{stat}: {total} {total < min && <span className="text-red-500">(Min: {min})</span>}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => allocateStat(stat, alloc - 1)}
                            className="px-3 py-1 bg-gray-600 rounded"
                          >-</button>
                          <span className="px-3 py-1">+{alloc}</span>
                          <button
                            onClick={() => allocateStat(stat, alloc + 1)}
                            className="px-3 py-1 bg-gray-600 rounded"
                          >+</button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Base: {base} + Race: {race >= 0 ? '+' : ''}{race} + Classe: {cls >= 0 ? '+' : ''}{cls} + Alloué: +{alloc}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Retour
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded ml-auto ${
                canProceed() ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={() => createCharacter(name, selectedRace, selectedClass, allocatedStats)}
              disabled={!canProceed() || pointsToAllocate > 0}
              className={`px-6 py-2 rounded ml-auto ${
                canProceed() && pointsToAllocate === 0
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              Commencer l'Aventure
            </button>
          )}
        </div>
      </div>
    );
  };

  // Interface principale
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      {gameState === 'menu' && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-5xl font-bold mb-4 text-red-400">Chronicles of the Crimson Path</h1>
          <p className="text-xl mb-8 text-gray-300">Un RPG narratif où chaque choix compte</p>
          <div className="mb-8">
            <img src="https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=800" alt="Fantasy landscape" className="rounded-lg shadow-2xl mx-auto" />
          </div>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg text-xl font-bold transition"
          >
            Nouvelle Aventure
          </button>
        </div>
      )}

      {gameState === 'creation' && <CharacterCreation />}

      {gameState === 'playing' && character && (
        <div className="max-w-6xl mx-auto">
          {/* Interface Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold text-red-400 mb-2">{character.name}</h3>
              <div className="text-sm text-gray-300">
                <div>{races[character.race].name} - {classes[character.class].name}</div>
                <div>Niveau {character.level} | EXP: {character.exp}/100</div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="text-red-500" size={20} />
                <span className="font-bold">HP: {character.hp}/{character.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-blue-400" size={20} />
                <span className="font-bold">Énergie: {character.energie}/{character.maxEnergie}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all"
                  style={{ width: `${(character.energie / character.maxEnergie) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="text-yellow-400" size={20} />
                <span className="font-bold">Fatigue: {character.fatigue}%</span>
              </div>
              <div className="text-sm text-gray-400">Or: {gold} 💰</div>
            </div>
          </div>

          {/* Stats détaillées */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-xs text-gray-400">Force</div>
              <div className="text-xl font-bold text-red-400">{character.force}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-xs text-gray-400">Intelligence</div>
              <div className="text-xl font-bold text-purple-400">{character.intelligence}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-xs text-gray-400">Agilité</div>
              <div className="text-xl font-bold text-green-400">{character.agilite}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-xs text-gray-400">Chance</div>
              <div className="text-xl font-bold text-yellow-400">{character.chance}</div>
            </div>
          </div>

          {/* Histoire */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Book className="text-red-400" size={24} />
              <h2 className="text-2xl font-bold text-red-400">Épisode {episode}</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">{story}</p>
            </div>
          </div>

          {/* Choix */}
          {choices.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-red-400 mb-4">Que faites-vous ?</h3>
              <div className="grid grid-cols-1 gap-3">
                {choices.map(choice => {
                  const meetsCondition = !choice.condition || 
                    (choice.condition.stat && character[choice.condition.stat] >= choice.condition.min);
                  
                  return (
                    <button
                      key={choice.id}
                      onClick={() => makeChoice(choice.id)}
                      disabled={!meetsCondition}
                      className={`p-4 rounded-lg text-left transition ${
                        meetsCondition
                          ? 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 hover:border-red-500'
                          : 'bg-gray-900 border-2 border-gray-800 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="font-semibold">{choice.text}</div>
                      {choice.condition && !meetsCondition && (
                        <div className="text-sm text-red-400 mt-1">
                          Requis: {choice.condition.stat.toUpperCase()} ≥ {choice.condition.min}
                        </div>
                      )}
                      {choice.condition && meetsCondition && (
                        <div className="text-sm text-green-400 mt-1">
                          ✓ Choix spécial débloqué
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inventaire et équipement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Package className="text-yellow-400" size={20} />
                <h3 className="text-lg font-bold text-yellow-400">Inventaire (Max 3)</h3>
              </div>
              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.grade}</div>
                    </div>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <div className="text-gray-500 text-sm">Inventaire vide</div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-blue-400">Équipement</h3>
              </div>
              <div className="space-y-2">
                {equipment.weapon && (
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold text-sm">⚔️ {equipment.weapon.name}</div>
                    <div className="text-xs text-gray-400">
                      Dégâts: {equipment.weapon.damage} | {equipment.weapon.grade}
                    </div>
                  </div>
                )}
                {equipment.armor && (
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold text-sm">🛡️ {equipment.armor.name}</div>
                    <div className="text-xs text-gray-400">
                      Défense: {equipment.armor.defense} | {equipment.armor.grade}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'combat' && combat && character && (
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
                    onClick={() => defend('parry')}
                    className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
                  >
                    🛡️ Parade
                  </button>
                  <button
                    onClick={() => defend('evade')}
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
                          onClick={() => useSkill(skill)}
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
                      {inventory.map(item => (
                        <button
                          key={item.id}
                          onClick={() => useConsumable(item)}
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
      )}

      {gameState === 'gameOver' && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-5xl font-bold mb-4 text-red-600">Vous êtes tombé...</h1>
          <p className="text-xl mb-8 text-gray-300">
            Votre aventure se termine ici, mais la Voie Écarlate vous attend toujours.
          </p>
          <button
            onClick={() => {
              setGameState('menu');
              setCharacter(null);
              setEpisode(1);
              setInventory([]);
              setEquipment({ weapon: null, armor: null });
              setSkills([]);
              setGold(50);
              setStoryLog([]);
              setMetNPCs([]);
            }}
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