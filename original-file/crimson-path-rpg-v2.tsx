import React, { useState } from 'react';
import { Heart, Zap, Battery, Shield, Book, Package, ShoppingCart, X } from 'lucide-react';

const CrimsonPathRPG = () => {
  const [gameState, setGameState] = useState('menu');
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
  const [discoveredClues, setDiscoveredClues] = useState([]);
  const [shapeshifterForm, setShapeshifterForm] = useState('human');
  const [merchantOpen, setMerchantOpen] = useState(false);

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
      desc: 'Puissance magique, récupération fatigue',
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

  const shapeshifterForms = {
    human: { name: 'Forme Humaine', force: 0, agilite: 0, fatigueRecovery: 0, icon: '🧍' },
    beast: { name: 'Forme Bestiale', force: 5, agilite: -2, fatigueRecovery: 0, icon: '🐺' },
    shadow: { name: 'Forme d\'Ombre', force: -2, agilite: 5, fatigueRecovery: 0, icon: '👤' },
    spirit: { name: 'Forme Spirituelle', force: 0, agilite: 0, fatigueRecovery: 10, icon: '✨' }
  };

  const allItems = {
    weapons: [
      { id: 'w1', name: 'Épée Rouillée', grade: 'piteux', type: 'weapon', damage: 5, reqForce: 3, price: 20 },
      { id: 'w2', name: 'Bâton de Novice', grade: 'piteux', type: 'weapon', damage: 3, magicDamage: 4, reqInt: 3, price: 20 },
      { id: 'w3', name: 'Lame d\'Acier', grade: 'passable', type: 'weapon', damage: 12, reqForce: 8, price: 100 },
      { id: 'w4', name: 'Sceptre Lunaire', grade: 'magic', type: 'weapon', damage: 5, magicDamage: 15, reqInt: 10, price: 250 },
      { id: 'w5', name: 'Lame Écarlate', grade: 'artefact', type: 'weapon', damage: 25, magicDamage: 15, price: 1000 }
    ],
    armor: [
      { id: 'a1', name: 'Tunique en Lambeaux', grade: 'piteux', type: 'armor', defense: 2, reqForce: 2, price: 15 },
      { id: 'a2', name: 'Armure de Cuir', grade: 'passable', type: 'armor', defense: 6, reqForce: 6, price: 80 },
      { id: 'a3', name: 'Robe Enchantée', grade: 'magic', type: 'armor', defense: 4, magicDefense: 8, reqInt: 8, price: 200 }
    ],
    consumables: [
      { id: 'c1', name: 'Potion Mineure', grade: 'piteux', type: 'consumable', effect: 'heal', value: 20, price: 10 },
      { id: 'c2', name: 'Potion Moyenne', grade: 'passable', type: 'consumable', effect: 'heal', value: 50, price: 30 },
      { id: 'c3', name: 'Élixir d\'Énergie', grade: 'passable', type: 'consumable', effect: 'energy', value: 30, price: 25 },
      { id: 'c4', name: 'Fiole de Feu', grade: 'passable', type: 'consumable', effect: 'burn', value: 5, duration: 3, price: 40 },
      { id: 'c5', name: 'Poison Violent', grade: 'magic', type: 'consumable', effect: 'poison', value: 7, duration: 3, price: 50 },
      { id: 'c6', name: 'Poudre Aveuglante', grade: 'passable', type: 'consumable', effect: 'blind', duration: 2, price: 35 },
      { id: 'c7', name: 'Essence de Force', grade: 'artefact', type: 'consumable', effect: 'permForce', value: 1, price: 500 }
    ]
  };

  const allSkills = [
    { id: 's1', name: 'Frappe Puissante', cost: 15, damage: 15, type: 'physical', desc: 'Attaque basée sur Force', price: 50 },
    { id: 's2', name: 'Projectile Magique', cost: 15, damage: 12, type: 'magic', desc: 'Attaque basée sur Intelligence', price: 50 },
    { id: 's3', name: 'Coup Tourbillon', cost: 25, damage: 25, type: 'physical', desc: 'Attaque dévastatrice', price: 150 },
    { id: 's4', name: 'Boule de Feu', cost: 30, damage: 30, type: 'magic', desc: 'Magie destructrice', price: 180 },
    { id: 's5', name: 'Méditation', cost: 10, healing: 30, type: 'support', desc: 'Récupère HP', price: 100 }
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
    setInventory([allItems.consumables[0], allItems.consumables[0]]);
    setEquipment({ weapon: allItems.weapons[0], armor: allItems.armor[0] });
    setSkills([allSkills[0]]);
    startEpisode1();
  };

  const addFatigue = (amount) => {
    const newFatigue = Math.min(100, character.fatigue + amount);
    setCharacter({ ...character, fatigue: newFatigue });
    
    if (newFatigue >= 80 && Math.random() < 0.3) {
      setCharacter({
        ...character,
        fatigue: newFatigue,
        maxEnergie: Math.floor(character.maxEnergie * 0.5),
        energie: Math.floor(character.energie * 0.5)
      });
      alert('💀 BURN-OUT ! Votre énergie maximale est réduite de moitié !');
      return true;
    }
    return false;
  };

  const transformShapeshifter = (form) => {
    if (character.class !== 'shapeshifter') return;
    
    const oldForm = shapeshifterForms[shapeshifterForm];
    const newForm = shapeshifterForms[form];
    
    setCharacter({
      ...character,
      force: character.force - oldForm.force + newForm.force,
      agilite: character.agilite - oldForm.agilite + newForm.agilite,
      fatigue: Math.max(0, character.fatigue - newForm.fatigueRecovery)
    });
    
    setShapeshifterForm(form);
  };

  const buyItem = (item) => {
    if (gold < item.price) {
      alert('Pas assez d\'or !');
      return;
    }

    if (item.type === 'consumable') {
      if (inventory.length >= 3) {
        alert('Inventaire plein ! (max 3)');
        return;
      }
      setInventory([...inventory, item]);
    } else if (item.type === 'weapon' || item.type === 'armor') {
      const slot = item.type === 'weapon' ? 'weapon' : 'armor';
      setEquipment({ ...equipment, [slot]: item });
    } else if (item.id && item.id.startsWith('s')) {
      if (skills.length >= 4) {
        alert('Maximum 4 skills ! Équipez d\'abord un skill pour le remplacer.');
        return;
      }
      setSkills([...skills, item]);
    }

    setGold(gold - item.price);
  };

  const startEpisode1 = () => {
    setGameState('playing');
    setEpisode(1);
    const storyText = `La Taverne du Crépuscule baigne dans une lumière dorée tamisée. L'odeur du pain frais et de l'hydromel flotte dans l'air. Vous venez d'arriver dans cette bourgade frontière entre l'Ouest chevaleresque et l'Est mystique.

Au comptoir, un vieillard aux yeux perçants vous observe. "Encore un voyageur sur la Voie Écarlate..." murmure-t-il avant de détourner le regard. Ces mots résonnent étrangement en vous.

Dans un coin sombre, une silhouette encapuchonnée semble vous surveiller. À une table bruyante, des mercenaires discutent d'une ruine récemment découverte. Près de la cheminée, une femme élégante aux cheveux roux compte des pièces d'or - une marchande itinérante.

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
        text: 'Approcher la marchande pour voir ses produits',
        condition: null,
        result: 'merchant_elara'
      }
    ]);
    setStoryLog([{ episode: 1, text: 'Arrivée à la Taverne du Crépuscule' }]);
  };

  const makeChoice = (choiceId) => {
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (choice.result === 'open_merchant') {
      setMerchantOpen(true);
      return;
    }

    addFatigue(5);

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
      case 'merchant_elara':
        handleElaraMeeting();
        break;
      case 'episode2':
        startEpisode2();
        break;
      default:
        break;
    }
  };

  const handleKaelenMeeting = () => {
    setMetNPCs([...metNPCs, 'Kaelen']);
    const newStory = `Vous vous approchez du vieillard. Ses yeux sont d'un bleu profond, presque luminescent.

"Ah, je vois que mes paroles ont éveillé votre curiosité..." Il sourit mystérieusement. "Je m'appelle Kaelen. La Voie Écarlate n'est pas un simple chemin, jeune voyageur. C'est une destinée tissée dans le sang des anciens."

Il trace un symbole étrange sur le comptoir avec son doigt - un cercle avec trois lunes. "Trois lunes s'aligneront bientôt. Quand la rouge avalera les deux autres, les portes s'ouvriront. Souvenez-vous de cela."

Avant que vous puissiez poser plus de questions, un cri retentit à l'extérieur. Des bandits attaquent la taverne !

[✨ INDICE : Les Trois Lunes]`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Rencontre avec Kaelen le Vagabond' }]);
    setDiscoveredClues([...discoveredClues, 'Les Trois Lunes']);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Ivre',
        hp: 40,
        maxHp: 40,
        damage: 8,
        defense: 2,
        image: '🗡️',
        loot: { gold: 25, exp: 20 }
      });
    }, 2000);
  };

  const handleMercenaries = () => {
    const newStory = `Vous vous joignez aux mercenaires. Leur chef, une femme bourrue aux cicatrices impressionnantes, vous accueille d'un hochement de tête.

"Une nouvelle tête ! Bienvenue, étranger. On parlait justement des Ruines du Croissant Noir. Paraît qu'il y a un trésor là-bas, mais aussi des créatures... étranges."

Un mercenaire moustachu ajoute : "J'ai entendu dire que seuls ceux marqués par la destinée peuvent y entrer sans périr. Quelque chose à voir avec un symbole ancien." Il rit nerveusement.

Soudain, la porte de la taverne explose ! Des bandits font irruption !

[✨ INDICE : Ruines du Croissant Noir]`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Discussion avec les mercenaires' }]);
    setDiscoveredClues([...discoveredClues, 'Ruines du Croissant Noir']);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Armé',
        hp: 45,
        maxHp: 45,
        damage: 10,
        defense: 3,
        image: '⚔️',
        loot: { gold: 30, exp: 25 }
      });
    }, 2000);
  };

  const handleShadowObserve = () => {
    const newStory = `Vous faites semblant de boire tout en observant la silhouette. Vos réflexes aiguisés vous permettent de remarquer des détails que d'autres auraient manqués.

La silhouette porte une broche en argent : un croissant de lune transpercé par une épée. Un symbole qui semble lié aux histoires des mercenaires.

Elle se lève soudainement et sort par la porte arrière. Vous avez le temps de voir son visage : des yeux rouges comme le sang et des marques runiques sur la joue.

Un instant plus tard, des cris éclatent. Des bandits attaquent !

[✨ INDICES DÉCOUVERTS : Le Croissant Transpercé, Yeux Écarlates]`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Observation de l\'Ombre Silencieuse', clue: true }]);
    setDiscoveredClues([...discoveredClues, 'Le Croissant Transpercé', 'Yeux Écarlates']);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Rusé',
        hp: 35,
        maxHp: 35,
        damage: 7,
        defense: 2,
        agility: 5,
        image: '🏹',
        loot: { gold: 20, exp: 22 }
      });
    }, 2000);
  };

  const handleElaraMeeting = () => {
    setMetNPCs([...metNPCs, 'Elara']);
    const newStory = `Vous vous approchez de la femme aux cheveux roux. Elle lève les yeux et vous accueille d'un sourire chaleureux.

"Ah, un nouvel aventurier ! Je m'appelle Elara, marchande itinérante et collectionneuse d'objets rares. J'ai tout ce qu'il faut pour survivre sur la Voie..." Elle tapote ses marchandises.

"Des potions, des armes, des artefacts magiques... Tout a un prix, bien sûr. Et si tu trouves quelque chose d'intéressant, reviens me voir !" Elle vous fait un clin d'œil.

Vous examinez ses produits rapidement quand soudain, la porte explose. Des bandits !`;

    setStory(newStory);
    setStoryLog([...storyLog, { episode: 1, choice: 'Rencontre avec Elara la Marchande' }]);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Commun',
        hp: 38,
        maxHp: 38,
        damage: 8,
        defense: 2,
        image: '🪓',
        loot: { gold: 35, exp: 18 }
      });
    }, 2000);
  };

  const startEpisode2 = () => {
    setEpisode(2);
    addFatigue(10);
    
    const hasKaelen = metNPCs.includes('Kaelen');
    const hasElara = metNPCs.includes('Elara');
    
    let storyText = `Le lendemain matin, vous quittez la Taverne du Crépuscule. Le soleil levant teinte le ciel d'un rouge profond - un mauvais présage selon les locaux.

Vous vous tenez à un carrefour. Trois chemins s'offrent à vous :

Le chemin du Nord mène vers les Montagnes des Lames, territoire des maîtres martiaux. Des colonnes de fumée s'élèvent au loin.

Le chemin de l'Ouest serpente vers les Ruines du Croissant Noir. Une aura étrange émane de cette direction.

Le chemin du Sud descend vers la Vallée des Échos, connue pour ses herboristes et érudits.`;

    if (hasKaelen) {
      storyText += `\n\nVous repensez aux paroles de Kaelen sur les trois lunes. Le symbole qu'il a tracé vous hante.`;
    }

    setStory(storyText);
    
    const newChoices = [
      {
        id: 1,
        text: 'Prendre le chemin du Nord vers les Montagnes des Lames',
        condition: null,
        result: 'mountains'
      },
      {
        id: 2,
        text: 'Explorer les Ruines du Croissant Noir à l\'Ouest',
        condition: null,
        result: 'ruins'
      },
      {
        id: 3,
        text: 'Descendre dans la Vallée des Échos au Sud',
        condition: { stat: 'intelligence', min: 8 },
        result: 'valley'
      }
    ];

    if (hasElara) {
      newChoices.push({
        id: 4,
        text: '[Elara] Voir la marchande avant de partir',
        condition: null,
        result: 'open_merchant'
      });
    }

    setChoices(newChoices);
    setStoryLog([...storyLog, { episode: 2, text: 'Le Carrefour des Destinées' }]);
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
    
    damage += Math.floor(character.force / 2);

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

    let damage = skill.damage || 0;
    if (skill.type === 'physical') {
      damage += Math.floor(character.force / 2);
    } else if (skill.type === 'magic') {
      damage += Math.floor(character.intelligence / 2);
    }

    const newLog = [...combat.log];
    let newChar = { ...character, energie: character.energie - skill.cost };
    let newEnemyHp = combat.enemy.hp;

    if (skill.healing) {
      newChar.hp = Math.min(newChar.hp + skill.healing, newChar.maxHp);
      newLog.push(`${skill.name} ! Vous récupérez ${skill.healing} HP`);
    } else {
      const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
      newEnemyHp = combat.enemy.hp - finalDamage;
      newLog.push(`${skill.name} ! ${finalDamage} dégâts`);
    }

    setCharacter(newChar);

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

    switch(item.effect) {
      case 'heal':
        newChar.hp = Math.min(newChar.hp + item.value, newChar.maxHp);
        newLog.push(`Vous utilisez ${item.name} et récupérez ${item.value} HP`);
        break;
      case 'energy':
        newChar.energie = Math.min(newChar.energie + item.value, newChar.maxEnergie);
        newLog.push(`Vous récupérez ${item.value} Énergie`);
        break;
      case 'burn':
        newCombat.enemyEffects.push({ type: 'burn', duration: item.duration, value: item.value });
        newLog.push(`${combat.enemy.name} brûle !`);
        break;
      case 'poison':
        newCombat.enemyEffects.push({ type: 'poison', duration: item.duration, value: item.value });
        newLog.push(`${combat.enemy.name} est empoisonné !`);
        break;
      case 'blind':
        newCombat.enemyEffects.push({ type: 'blind', duration: item.duration });
        newLog.push(`${combat.enemy.name} est aveuglé !`);
        break;
      default:
        break;
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
      const expGain = combat.enemy.loot.exp || 20;
      const goldGain = combat.enemy.loot.gold || 20;
      
      setCharacter({
        ...character,
        exp: character.exp + expGain
      });
      setGold(gold + goldGain);

      const victoryStory = `✨ Victoire ! Vous avez vaincu ${combat.enemy.name}.

La taverne retrouve son calme. Les clients vous regardent avec respect. Le tavernier vous offre une tournée.

"Bien joué, aventurier ! La Voie Écarlate vous attend peut-être vraiment..."

Vous avez gagné ${expGain} EXP et ${goldGain} or.`;

      setStory(victoryStory);
      setChoices([
        {
          id: 1,
          text: 'Continuer vers l\'Épisode 2',
          condition: null,
          result: 'episode2'
        }
      ]);
      setGameState('playing');
      setCombat(null);
    } else {
      setGameState('gameOver');
      setCombat(null);
    }
  };

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
                            className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                          >-</button>
                          <span className="px-3 py-1">+{alloc}</span>
                          <button
                            onClick={() => allocateStat(stat, alloc + 1)}
                            className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
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

  const MerchantModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-400">Boutique d'Elara</h2>
          <button onClick={() => setMerchantOpen(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="text-yellow-400 mb-4">💰 Or: {gold}</div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Armes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allItems.weapons.slice(2).map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.grade} | Dégâts: {item.damage}
                      {item.reqForce && ` | FOR≥${item.reqForce}`}
                      {item.reqInt && ` | INT≥${item.reqInt}`}
                    </div>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={gold < item.price}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= item.price ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.price}💰
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-2">Armures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allItems.armor.slice(1).map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.grade} | Déf: {item.defense}
                      {item.reqForce && ` | FOR≥${item.reqForce}`}
                    </div>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={gold < item.price}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= item.price ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.price}💰
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Consommables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allItems.consumables.slice(1).map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.grade} | {item.effect}
                      {item.value && `: ${item.value}`}
                    </div>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={gold < item.price || inventory.length >= 3}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= item.price && inventory.length < 3 ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.price}💰
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Compétences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allSkills.slice(2).map(skill => (
                <div key={skill.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{skill.name}</div>
                    <div className="text-xs text-gray-400">{skill.desc}</div>
                  </div>
                  <button
                    onClick={() => buyItem(skill)}
                    disabled={gold < skill.price || skills.length >= 4}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= skill.price && skills.length < 4 ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {skill.price}💰
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      {gameState === 'menu' && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-5xl font-bold mb-4 text-red-400">Chronicles of the Crimson Path</h1>
          <p className="text-xl mb-8 text-gray-300">Un RPG narratif où chaque choix compte</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg text-xl font-bold transition"
          >
            Nouvelle Aventure
          </button>
        </div>
      )}

      {gameState === 'creation' && <CharacterCreation />}

      {merchantOpen && <MerchantModal />}

      {gameState === 'playing' && character && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold text-red-400 mb-2">{character.name}</h3>
              <div className="text-sm text-gray-300">
                <div>{races[character.race].name} - {classes[character.class].name}</div>
                <div>Niveau {character.level} | EXP: {character.exp}/100</div>
                {character.class === 'shapeshifter' && (
                  <div className="text-xs text-purple-400 mt-1">
                    Forme: {shapeshifterForms[shapeshifterForm].name}
                  </div>
                )}
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

          {character.class === 'shapeshifter' && (
            <div className="bg-gray-800 p-4 rounded-lg border border-purple-600 mb-6">
              <h3 className="text-lg font-bold text-purple-400 mb-3">🐺 Transformations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(shapeshifterForms).map(([key, form]) => (
                  <button
                    key={key}
                    onClick={() => transformShapeshifter(key)}
                    className={`p-3 rounded transition ${
                      shapeshifterForm === key
                        ? 'bg-purple-600 border-2 border-purple-400'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{form.icon}</div>
                    <div className="text-xs font-bold">{form.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Book className="text-red-400" size={24} />
              <h2 className="text-2xl font-bold text-red-400">Épisode {episode}</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">{story}</p>
            </div>
          </div>

          {discoveredClues.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600 mb-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">✨ Indices Découverts</h3>
              <div className="flex flex-wrap gap-2">
                {discoveredClues.map((clue, idx) => (
                  <span key={idx} className="bg-yellow-900 px-3 py-1 rounded text-sm">{clue}</span>
                ))}
              </div>
            </div>
          )}

          {choices.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="text-yellow-400" size={20} />
                  <h3 className="text-lg font-bold text-yellow-400">Inventaire ({inventory.length}/3)</h3>
                </div>
                {metNPCs.includes('Elara') && (
                  <button
                    onClick={() => setMerchantOpen(true)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm flex items-center gap-1"
                  >
                    <ShoppingCart size={16} />
                    Boutique
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {inventory.map((item, idx) => (
                  <div key={idx} className="bg-gray-700 p-2 rounded flex justify-between items-center">
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

            <div className="bg-gray-900 p-4 rounded-lg mb-6 max-h-32 overflow-y-auto">
              {combat.log.map((entry, idx) => (
                <div key={idx} className="text-sm text-gray-300 mb-1">
                  › {entry}
                </div>
              ))}
            </div>

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

                {inventory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-yellow-400 mb-2">Consommables</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {inventory.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => useConsumable(item)}
                          className="p-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm transition"
                        >
                          <div className="font-bold text-xs">{item.name}</div>
                          <div className="text-xs">
                            {item.effect === 'heal' && `+${item.value} HP`}
                            {item.effect === 'energy' && `+${item.value} EN`}
                            {item.effect === 'burn' && '🔥 Brûlure'}
                            {item.effect === 'poison' && '☠️ Poison'}
                          </div>
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
              setDiscoveredClues([]);
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