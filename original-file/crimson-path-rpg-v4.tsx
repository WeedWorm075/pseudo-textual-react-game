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
    shadow: { name: 'Forme Ombre', force: -2, agilite: 5, fatigueRecovery: 0, icon: '👤' },
    spirit: { name: 'Forme Spirituelle', force: 0, agilite: 0, fatigueRecovery: 10, icon: '✨' }
  };

  const allItems = {
    weapons: [
      { id: 'w1', name: 'Épée Rouillée', grade: 'piteux', type: 'weapon', damage: 5, reqForce: 3, price: 20 },
      { id: 'w2', name: 'Bâton de Novice', grade: 'piteux', type: 'weapon', damage: 3, magicDamage: 4, reqInt: 3, price: 20 },
      { id: 'w3', name: 'Lame Acier', grade: 'passable', type: 'weapon', damage: 12, reqForce: 8, price: 100 },
      { id: 'w4', name: 'Sceptre Lunaire', grade: 'magic', type: 'weapon', damage: 5, magicDamage: 15, reqInt: 10, price: 250 },
      { id: 'w5', name: 'Lame Écarlate', grade: 'artefact', type: 'weapon', damage: 25, magicDamage: 15, price: 1000 }
    ],
    armor: [
      { id: 'a1', name: 'Tunique Lambeaux', grade: 'piteux', type: 'armor', defense: 2, reqForce: 2, price: 15 },
      { id: 'a2', name: 'Armure Cuir', grade: 'passable', type: 'armor', defense: 6, reqForce: 6, price: 80 },
      { id: 'a3', name: 'Robe Enchantée', grade: 'magic', type: 'armor', defense: 4, magicDefense: 8, reqInt: 8, price: 200 }
    ],
    consumables: [
      { id: 'c1', name: 'Potion Mineure', grade: 'piteux', type: 'consumable', effect: 'heal', value: 20, price: 10 },
      { id: 'c2', name: 'Potion Moyenne', grade: 'passable', type: 'consumable', effect: 'heal', value: 50, price: 30 },
      { id: 'c3', name: 'Élixir Énergie', grade: 'passable', type: 'consumable', effect: 'energy', value: 30, price: 25 },
      { id: 'c4', name: 'Fiole de Feu', grade: 'passable', type: 'consumable', effect: 'burn', value: 5, duration: 3, price: 40 },
      { id: 'c5', name: 'Poison Violent', grade: 'magic', type: 'consumable', effect: 'poison', value: 7, duration: 3, price: 50 }
    ]
  };

  const allSkills = [
    { id: 's1', name: 'Frappe Puissante', cost: 15, damage: 15, type: 'physical', desc: 'Attaque Force', price: 50 },
    { id: 's2', name: 'Projectile Magique', cost: 15, damage: 12, type: 'magic', desc: 'Attaque Intelligence', price: 50 },
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
      alert('BURN-OUT ! Votre énergie maximale est réduite de moitié !');
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
      alert('Pas assez or !');
      return;
    }

    if (item.type === 'consumable') {
      if (inventory.length >= 3) {
        alert('Inventaire plein !');
        return;
      }
      setInventory([...inventory, item]);
    } else if (item.type === 'weapon' || item.type === 'armor') {
      const slot = item.type === 'weapon' ? 'weapon' : 'armor';
      setEquipment({ ...equipment, [slot]: item });
    } else if (item.id && item.id.startsWith('s')) {
      if (skills.length >= 4) {
        alert('Maximum 4 skills !');
        return;
      }
      setSkills([...skills, item]);
    }

    setGold(gold - item.price);
  };

  const startEpisode1 = () => {
    setGameState('playing');
    setEpisode(1);
    const storyText = `La Taverne du Crépuscule baigne dans une lumière dorée tamisée. L'odeur du pain frais et de l'hydromel flotte dans l'air.

Au comptoir, un vieillard aux yeux perçants vous observe. "Encore un voyageur sur la Voie Écarlate..." murmure-t-il.

Dans un coin sombre, une silhouette encapuchonnée vous surveille. À une table, des mercenaires discutent de ruines. Près de la cheminée, une marchande compte des pièces d'or.

Votre aventure commence ici.`;
    
    setStory(storyText);
    setChoices([
      { 
        id: 1, 
        text: 'Approcher le vieillard et parler de la Voie Écarlate',
        result: 'npc_kaelen'
      },
      { 
        id: 2, 
        text: 'Rejoindre les mercenaires',
        result: 'mercenaries'
      },
      { 
        id: 3, 
        text: 'Observer la silhouette encapuchonnée',
        condition: { stat: 'agilite', min: 7 },
        result: 'shadow_observe'
      },
      { 
        id: 4, 
        text: 'Approcher la marchande',
        result: 'merchant_elara'
      }
    ]);
  };

  const makeChoice = (choiceId) => {
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (choice.result === 'open_merchant') {
      setMerchantOpen(true);
      return;
    }

    // Vérifications conditionnelles spéciales
    if (choice.condition) {
      if (choice.condition.stat === 'total') {
        const total = character.force + character.intelligence + character.agilite + character.chance;
        if (total < choice.condition.min) {
          alert(`Stats totales insuffisantes ! Requis: ${choice.condition.min}, Actuel: ${total}`);
          return;
        }
      }
      if (choice.condition.npc && metNPCs.length < choice.condition.npc) {
        alert(`Pas assez d'alliés ! Requis: ${choice.condition.npc}, Actuel: ${metNPCs.length}`);
        return;
      }
      if (choice.condition.clues && discoveredClues.length < choice.condition.clues) {
        alert(`Pas assez d'indices ! Requis: ${choice.condition.clues}, Actuel: ${discoveredClues.length}`);
        return;
      }
      if (choice.condition.clue && !discoveredClues.includes(choice.condition.clue)) {
        alert('Vous n\'avez pas les connaissances requises !');
        return;
      }
      if (choice.condition.class && character.class !== choice.condition.class) {
        return;
      }
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
      case 'mountains':
        goToMountains();
        break;
      case 'ruins':
        goToRuins();
        break;
      case 'valley':
        goToValley();
        break;
      case 'train_shen':
        handleTrainShen();
        break;
      case 'question_shen':
        handleQuestionShen();
        break;
      case 'special_shen':
        handleSpecialShen();
        break;
      case 'ruins_left':
        handleRuinsLeft();
        break;
      case 'ruins_center':
        handleRuinsCenter();
        break;
      case 'ruins_right':
        handleRuinsRight();
        break;
      case 'study_symbols':
        handleStudySymbols();
        break;
      case 'read_crimson':
        handleReadCrimson();
        break;
      case 'read_marked':
        handleReadMarked();
        break;
      case 'oracle_future':
        handleOracleFuture();
        break;
      case 'rest_valley':
        handleRestValley();
        break;
      case 'answer_destiny':
        handleAnswerDestiny();
        break;
      case 'answer_power':
        handleAnswerPower();
        break;
      case 'answer_stop':
        handleAnswerStop();
        break;
      case 'episode3':
        startEpisode3();
        break;
      case 'fight_corvus':
        handleFightCorvus();
        break;
      case 'lie_corvus':
        handleLieCorvus();
        break;
      case 'reason_corvus':
        handleReasonCorvus();
        break;
      case 'reveal_marked':
        handleRevealMarked();
        break;
      case 'escape_corvus':
        handleEscapeCorvus();
        break;
      case 'sanctuary':
        handleSanctuary();
        break;
      case 'episode4':
        startEpisode4();
        break;
      case 'learn_ritual':
        handleLearnRitual();
        break;
      case 'final_preparation':
        handleFinalPreparation();
        break;
      case 'ending_ascension':
        handleEndingAscension();
        break;
      case 'ending_sacrifice':
        handleEndingSacrifice();
        break;
      case 'ending_corruption':
        handleEndingCorruption();
        break;
      case 'ending_balance':
        handleEndingBalance();
        break;
      case 'ending_revelation':
        handleEndingRevelation();
        break;
      case 'restart':
        setGameState('menu');
        setCharacter(null);
        setEpisode(1);
        setInventory([]);
        setEquipment({ weapon: null, armor: null });
        setSkills([]);
        setGold(50);
        setMetNPCs([]);
        setDiscoveredClues([]);
        break;
      default:
        alert('Contenu en développement !');
        break;
    }
  };

  const startEpisode3 = () => {
    setEpisode(3);
    addFatigue(20);
    
    const hasSelene = metNPCs.includes('Selene');
    const isMarked = discoveredClues.includes('Je suis un Marqué !');
    
    const storyText = `Vous reprenez votre route, l'esprit rempli de nouvelles connaissances. Le ciel s'assombrit soudainement.

Des cavaliers en armures noires vous encerclent. L'Inquisition !

À leur tête, un homme imposant descend de cheval. Sa cape écarlate flotte au vent - une ironie cruelle. Son visage est marqué de cicatrices, et ses yeux sont froids comme la glace.

"Je suis l'Inquisiteur Corvus." Sa voix résonne avec autorité. "J'ai des questions concernant... certaines activités hérétiques."

Il s'approche, vous scrutant intensément. ${isMarked ? 'Ses yeux s\'écarquillent légèrement. "Tu... tu portes la Marque ! Un autre élu maudit !"' : '"Tu as visité des lieux interdits. Tu as parlé avec des hérétiques."'}

"Je t'offre un choix, voyageur. Rejoins l'Inquisition et aide-nous à éradiquer cette malédiction qu'est la Voie Écarlate... ou meurs ici."

${hasSelene ? 'Vous sentez l\'amulette de Selene vibrer à votre cou.' : 'Vos compagnons sont loin. Vous êtes seul.'}

La tension est à son comble. Les soldats ont la main sur leurs armes.

[MOMENT CRITIQUE : Corvus]`;

    setStory(storyText);
    setMetNPCs([...metNPCs, 'Corvus']);

    const newChoices = [
      {
        id: 1,
        text: 'Refuser et se préparer au combat',
        result: 'fight_corvus'
      },
      {
        id: 2,
        text: 'Accepter de rejoindre l\'Inquisition (mentir)',
        condition: { stat: 'intelligence', min: 9 },
        result: 'lie_corvus'
      },
      {
        id: 3,
        text: 'Tenter de raisonner Corvus sur son passé',
        condition: { clue: 'Corvus était un Marqué' },
        result: 'reason_corvus'
      },
      {
        id: 4,
        text: '[Si Marqué] Révéler votre vraie nature',
        condition: { clue: 'Je suis un Marqué !' },
        result: 'reveal_marked'
      }
    ];

    if (hasSelene) {
      newChoices.push({
        id: 5,
        text: '[Selene] Activer l\'amulette et fuir',
        result: 'escape_corvus'
      });
    }

    setChoices(newChoices);
  };

  const handleFightCorvus = () => {
    const storyText = `"Ainsi soit-il." Corvus dégaine son épée écarlate.

"Je respecte ton courage, mais tu es un fou. Personne ne défie l'Inquisition et survit."

Les soldats reculent. C'est un duel à mort !`;

    setStory(storyText);
    
    setTimeout(() => {
      startCombat({
        name: 'Inquisiteur Corvus',
        hp: 120,
        maxHp: 120,
        damage: 20,
        defense: 8,
        image: '⚔️',
        loot: { gold: 200, exp: 100 }
      });
    }, 2000);
  };

  const handleLieCorvus = () => {
    const storyText = `Vous baissez la tête. "Je... j'accepte. La Voie Écarlate est une malédiction. Je veux aider à l'éradiquer."

Corvus vous observe longuement. "Intéressant. Très bien. Tu viendras avec nous à la forteresse."

En chemin vers la forteresse, vous remarquez que les soldats sont tendus. Corvus parle peu.

La nuit, pendant que le camp dort, vous vous échappez discrètement. Vous avez gagné du temps.

Mais maintenant, Corvus sait qui vous êtes. Il vous traquera.

[CORVUS DEVIENT UN ENNEMI MAJEUR]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Fuir vers un lieu sûr',
        result: 'episode4'
      }
    ]);
  };

  const handleReasonCorvus = () => {
    const hasOracleKnowledge = discoveredClues.includes('Corvus a renoncé au pouvoir');
    
    const storyText = `Vous prenez une grande inspiration. "Corvus... tu étais un Marqué. Tu as ressenti le pouvoir de la Voie Écarlate."

Corvus se fige. Ses soldats murmurent, choqués.

"Comment oses-tu..." Sa voix tremble de rage.

"Tu as renoncé par peur ! ${hasOracleKnowledge ? 'Tu as perdu ton humanité en trahissant ta destinée !' : 'Mais pourquoi chasser ceux qui sont comme toi ?'}"

Corvus vous regarde, et pour la première fois, vous voyez de la douleur dans ses yeux.

"Tu ne comprends rien..." Il murmure. "Le pouvoir... il consume tout. J'ai vu mes frères Marqués devenir des monstres. J'ai dû les tuer de mes propres mains."

"Je les protège en les tuant avant qu'ils ne deviennent... ça." Il montre ses mains tremblantes. "Mais tu as raison sur une chose. Je ne suis plus humain."

Il rengaine son épée. "Pars. Je ne peux pas te tuer aujourd'hui. Mais la prochaine fois... je n'hésiterai pas."

Les soldats sont confus mais obéissent quand Corvus ordonne le départ.

[CORVUS RELATION : COMPLEXE]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Partir pendant que c\'est possible',
        result: 'episode4'
      }
    ]);
  };

  const handleRevealMarked = () => {
    const storyText = `Vous vous tenez droit. "Je suis un Marqué, Corvus. Comme tu l'étais."

Un silence de mort tombe sur l'assemblée.

Soudain, votre corps s'illumine d'une aura écarlate. Les trois lunes apparaissent brièvement au-dessus de vous - une vision prophétique.

Corvus recule, horrifié. "Non... pas encore un... Je ne peux pas..."

Ses soldats sont pétrifiés par la peur. Certains tombent à genoux.

Corvus hurle : "TUE-LE ! TUEZ-LE MAINTENANT !"

Mais avant que quiconque ne bouge, une silhouette apparaît entre vous et Corvus.

Selene ! "Assez, Corvus. Tu ne toucheras pas celui-ci."

"Toi..." Corvus crache. "La Gardienne. Toujours à protéger ces maudits."

"Viens, jeune Marqué." Selene vous prend la main. En un éclair de lumière, vous disparaissez.

[TÉLÉPORTATION VERS LE SANCTUAIRE]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Reprendre vos esprits',
        result: 'sanctuary'
      }
    ]);
  };

  const handleEscapeCorvus = () => {
    const storyText = `Vous saisissez l'amulette de Selene. Elle brille intensément !

"Quoi ?!" Corvus bondit en avant, mais trop tard.

Une barrière de lumière écarlate vous entoure. Les soldats ne peuvent pas la franchir.

"MAUDIT SOIS-TU !" Corvus frappe la barrière de rage. "Je te retrouverai ! Tous les Marqués périront !"

La barrière pulse et vous téléporte loin, très loin.

[FUITE RÉUSSIE]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Voir où vous êtes',
        result: 'episode4'
      }
    ]);
  };

  const handleSanctuary = () => {
    const storyText = `Vous vous réveillez dans un lieu magnifique. Un temple ancien flotte dans les airs, entouré de trois lunes brillantes.

Le Sanctuaire des Marqués.

Selene est là, ainsi que trois autres personnes aux auras écarlates.

"Bienvenue au Sanctuaire." Selene sourit. "Tu as été révélé. L'Alignement est dans deux jours. Nous devons nous préparer."

Un homme grand et musclé s'avance. "Je suis Aldric, Marqué de la Force." Il vous serre la main.

Une jeune femme aux yeux mystiques : "Lysa, Marquée de l'Esprit."

Un vieil homme sage : "Et moi, Theron, Marqué du Savoir."

"Nous sommes les derniers Marqués de cette génération." Selene explique. "Quand l'Alignement viendra, nous devrons accomplir le Rituel du Croissant. C'est notre destinée."

"Mais Corvus et l'Inquisition attaqueront. Ils veulent empêcher le Rituel à tout prix."

[ÉPISODE 4 COMMENCE]`;

    setStory(storyText);
    setEpisode(4);
    setMetNPCs([...metNPCs, 'Aldric', 'Lysa', 'Theron']);
    setChoices([
      {
        id: 1,
        text: 'S\'entraîner pour l\'Alignement',
        result: 'train_sanctuary'
      },
      {
        id: 2,
        text: 'En apprendre plus sur le Rituel',
        result: 'learn_ritual'
      },
      {
        id: 3,
        text: 'Parler avec les autres Marqués',
        result: 'talk_marked'
      }
    ]);
  };

  const startEpisode4 = () => {
    setEpisode(4);
    addFatigue(15);
    
    const hasCorvusKnowledge = discoveredClues.includes('Corvus était un Marqué');
    
    const storyText = `Vous voyagez pendant des jours. Le ciel change. Les trois lunes deviennent visibles même en plein jour.

L'Alignement approche.

Vous arrivez finalement aux Ruines du Croissant Noir. Cette fois, vous savez où aller - vers la Chambre du Croissant.

En entrant dans les ruines, vous sentez une présence. Selene apparaît.

"Tu es venu. Bien. L'Alignement est dans quelques heures. Les autres Marqués sont en route."

"Mais Corvus aussi. Il amène toute son armée. Ce sera une bataille sanglante."

Elle vous regarde gravement. "Tu devras faire un choix aujourd'hui. Un choix qui déterminera l'avenir de notre monde."

"Le Rituel peut être accompli de plusieurs façons. Chacune mènera à un résultat différent."

[L'HEURE DE LA DÉCISION APPROCHE]`;

    setStory(storyText);
    
    const newChoices = [
      {
        id: 1,
        text: 'Demander plus de détails sur le Rituel',
        result: 'learn_ritual'
      },
      {
        id: 2,
        text: 'Se préparer au combat final',
        result: 'prepare_final'
      },
      {
        id: 3,
        text: '[Haute Intelligence] Chercher une autre solution',
        condition: { stat: 'intelligence', min: 12 },
        result: 'alternative'
      }
    ];

    setChoices(newChoices);
  };

  const handleLearnRitual = () => {
    const storyText = `Selene vous explique le Rituel du Croissant.

"Quand les trois lunes s'aligneront, un pouvoir immense se manifestera. Les Marqués peuvent canaliser ce pouvoir de cinq façons :

**L'Ascension** : Absorber tout le pouvoir. Devenir un être divin, mais perdre son humanité.

**Le Sacrifice** : Donner votre vie pour purifier le monde de toute corruption, y compris la Voie Écarlate.

**La Corruption** : Utiliser le pouvoir pour dominer. Devenir un tyran tout-puissant.

**L'Équilibre** : Partager le pouvoir équitablement. Créer une harmonie entre tous les peuples.

**La Révélation** : Découvrir la vraie nature du monde et de la Voie Écarlate. Transcender la réalité elle-même."

"Chaque choix changera le monde à jamais. Choisis sagement."

[CONNAISSANCES ACQUISES]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Les Cinq Voies du Rituel']);
    setChoices([
      {
        id: 1,
        text: 'Se préparer pour l\'Alignement',
        result: 'final_preparation'
      }
    ]);
  };

  const handleFinalPreparation = () => {
    setEpisode(5);
    
    const totalClues = discoveredClues.length;
    const hasAllNPCs = metNPCs.length >= 6;
    const highStats = character.force + character.intelligence + character.agilite + character.chance >= 50;
    
    const storyText = `L'Alignement commence. Les trois lunes convergent dans le ciel.

Vous vous tenez dans la Chambre du Croissant avec les autres Marqués. Un cercle de runes écarlates brille au sol.

Soudain, les portes explosent. Corvus et son armée !

"ARRÊTEZ CE RITUEL !" Corvus hurle. "Vous condamnez l'humanité !"

Une bataille féroce éclate. Les Marqués combattent l'Inquisition.

Au centre de tout, vous sentez le pouvoir monter. Les trois lunes fusionnent au-dessus de vous.

C'est le moment. Vous devez choisir comment utiliser ce pouvoir.

Selene crie : "Fais ton choix, maintenant !"

[LE MOMENT FINAL EST ARRIVÉ]
[VOTRE DESTINÉE VOUS ATTEND]

Indices découverts : ${totalClues}
Stats totales : ${character.force + character.intelligence + character.agilite + character.chance}
Alliés rencontrés : ${metNPCs.length}`;

    setStory(storyText);
    
    const finalChoices = [
      {
        id: 1,
        text: 'L\'ASCENSION - Absorber tout le pouvoir',
        condition: { stat: 'total', min: 50 },
        result: 'ending_ascension'
      },
      {
        id: 2,
        text: 'LE SACRIFICE - Donner votre vie pour purifier le monde',
        result: 'ending_sacrifice'
      },
      {
        id: 3,
        text: 'LA CORRUPTION - Dominer le monde',
        result: 'ending_corruption'
      },
      {
        id: 4,
        text: 'L\'ÉQUILIBRE - Partager le pouvoir équitablement',
        condition: { npc: 6 },
        result: 'ending_balance'
      },
      {
        id: 5,
        text: 'LA RÉVÉLATION - Transcender la réalité',
        condition: { clues: 15 },
        result: 'ending_revelation'
      }
    ];

    setChoices(finalChoices);
  };

  const handleEndingAscension = () => {
    const storyText = `Vous tendez les bras vers les trois lunes. Votre corps s'illumine d'une lumière aveuglante.

Le pouvoir de l'Alignement s'engouffre en vous. Vous absorbez tout - chaque once de puissance divine.

Vous sentez votre humanité s'effacer. Vos émotions disparaissent. Votre mortalité se dissipe.

Corvus recule, terrifié. "Non... encore un dieu fou..."

Vous êtes devenu un être transcendant. Vous pouvez voir tous les fils du destin, contrôler tous les éléments, plier la réalité à votre volonté.

Mais à quel prix ?

Les autres Marqués vous regardent avec peur. Selene pleure. "Nous t'avons perdu..."

Vous vous élevez dans les cieux, abandonnant votre ancienne vie. Vous êtes maintenant un dieu solitaire, puissant mais vide.

Le monde continue sous votre regard détaché.

═══════════════════════
FIN 1 : L'ASCENSION
═══════════════════════

Vous avez atteint la puissance ultime, mais perdu votre humanité.
Le monde est en paix sous votre règne distant, mais vous êtes seul pour l'éternité.

Stats finales :
- Niveau : Divin
- Pouvoir : Infini
- Humanité : 0%

Merci d'avoir joué à Chronicles of the Crimson Path !`;

    setStory(storyText);
    setGameState('gameOver');
  };

  const handleEndingSacrifice = () => {
    const storyText = `Vous fermez les yeux. "Je sais ce que je dois faire."

Vous canalisez le pouvoir... non pas en vous, mais en dehors. Vous le dispersez dans le monde entier.

Votre corps commence à briller, puis à se dissoudre.

"NON !" Selene court vers vous, mais c'est trop tard.

Vous sentez votre essence se répandre. Chaque particule de votre être devient lumière pure.

Le pouvoir de la Voie Écarlate se purifie. La malédiction des Marqués disparaît. Corvus sent sa corruption s'effacer.

"Qu'as-tu fait..." Corvus tombe à genoux, pleurant. "Tu... tu nous as sauvés."

Les trois lunes se séparent et reprennent leur cours normal. L'Alignement est terminé.

Votre sacrifice a libéré le monde. Plus aucun Marqué ne naîtra. Plus aucune guerre entre l'Inquisition et les élus.

Dans leurs cœurs, tous se souviendront de vous. Le héros qui a donné sa vie pour la paix.

═══════════════════════
FIN 2 : LE SACRIFICE
═══════════════════════

Vous avez donné votre vie pour sauver le monde.
Votre nom sera chanté dans les légendes pour toujours.

Legacy :
- Le monde est en paix
- Les Marqués n'existent plus
- Vous êtes devenu une légende

Merci d'avoir joué à Chronicles of the Crimson Path !`;

    setStory(storyText);
    setGameState('gameOver');
  };

  const handleEndingCorruption = () => {
    const storyText = `Un sourire sombre apparaît sur votre visage. "Ce pouvoir... il est à MOI."

Vous saisissez le pouvoir de l'Alignement avec avidité. Il corrompt instantanément votre âme.

Vos yeux deviennent noirs comme la nuit. Votre aura écarlate vire au noir profond.

"ARRÊTE !" Selene essaie de vous atteindre, mais vous la repoussez d'un geste. Elle s'écrase contre un mur.

Corvus charge avec son épée. D'un regard, vous le figez sur place. "Tu m'as appris quelque chose, Corvus. Le pouvoir est tout."

Vous écrasez son esprit. Il tombe, mort.

Les autres Marqués tentent de vous arrêter. Vous les détruisez un par un, absorbant leur essence.

Avec le pouvoir combiné de tous les Marqués et de l'Alignement, vous devenez invincible.

Vous sortez des ruines. Le monde s'étend devant vous, prêt à être conquis.

Une à une, les nations tombent sous votre règne de terreur. Vous êtes devenu le Tyran Écarlate.

Le monde vit dans la peur, mais personne ne peut vous arrêter.

═══════════════════════
FIN 3 : LA CORRUPTION
═══════════════════════

Vous avez embrassé les ténèbres et dominé le monde.
Vous êtes le tyran le plus puissant qui ait jamais existé.

Règne :
- Le monde vous craint
- Vous êtes immortel
- Vous êtes seul au sommet

Merci d'avoir joué à Chronicles of the Crimson Path !`;

    setStory(storyText);
    setGameState('gameOver');
  };

  const handleEndingBalance = () => {
    const storyText = `Vous regardez tous vos compagnons. Kaelen, Elara, Maître Shen, Oracle Lyra, Selene, les autres Marqués...

"Je ne peux pas décider seul. Ce pouvoir appartient à tous."

Vous canalisez le pouvoir de l'Alignement... et le dispersez équitablement entre tous les peuples du monde.

Les humains, les mi-hommes, les witches, les druides, les hybrides - tous reçoivent une part égale.

Le pouvoir se transforme. Il n'est plus une malédiction, mais une bénédiction partagée.

Corvus sent le changement. Sa corruption disparaît, remplacée par la paix. Il tombe à genoux, libéré.

"Merci..." Il murmure, des larmes coulant sur son visage scarifié.

Les Marqués sourient. "Tu as trouvé la vraie voie." Selene vous embrasse.

Le monde change. Les races qui se battaient autrefois apprennent à coexister. Le pouvoir partagé crée une harmonie nouvelle.

Vous devenez le médiateur, celui qui maintient l'équilibre. Une vie longue et remplie vous attend.

Maître Shen vous forme. Oracle Lyra vous conseille. Elara commerce dans le nouveau monde. Kaelen guide les nouveaux élus.

Ensemble, vous construisez un avenir meilleur.

═══════════════════════
FIN 4 : L'ÉQUILIBRE
═══════════════════════

Vous avez uni le monde dans l'harmonie.
Le pouvoir partagé a créé une ère de paix et de prospérité.

Accomplissement :
- Toutes les races vivent en paix
- Vous êtes le gardien de l'équilibre
- Vos alliés règnent à vos côtés

Merci d'avoir joué à Chronicles of the Crimson Path !`;

    setStory(storyText);
    setGameState('gameOver');
  };

  const handleEndingRevelation = () => {
    const storyText = `Vous avez découvert tous les secrets. Tous les indices s'assemblent dans votre esprit.

Les trois lunes. Le Croissant Transpercé. La Voie Écarlate. Les Marqués. Corvus. Tout fait partie d'un cycle.

"Attendez..." Vous levez la main. Le rituel se fige.

"Ce n'est pas la première fois. Cela s'est déjà produit. Encore et encore, à travers les âges."

Selene pâlit. "Comment... comment sais-tu ?"

"Parce que j'ai lu TOUS les textes. J'ai vu TOUS les signes." Vous touchez les runes au sol.

Elles révèlent leur vraie nature. Ce ne sont pas des prophéties - ce sont des enregistrements.

"L'Alignement n'est pas une destinée. C'est un test. Un cycle sans fin pour voir si l'humanité peut transcender sa nature."

Vous canalisez le pouvoir différemment. Vous ne l'absorbez pas, ne le partagez pas, ne le sacrifiez pas.

Vous le COMPRENEZ.

Le pouvoir se transforme en pure connaissance. Vous voyez la vérité de l'univers.

La réalité se déchire. Vous transcendez toutes les dimensions. Vous existez maintenant au-delà du temps et de l'espace.

Vous voyez tous les cycles passés, tous les futurs possibles. Vous êtes devenu l'Observateur Éternel.

D'un geste, vous brisez le cycle. Plus jamais il n'y aura d'Alignement. Plus jamais de Marqués maudits.

Le monde continue, libéré de son destin circulaire.

Et vous ? Vous observez depuis votre plan d'existence supérieur, veillant sur tous les mondes.

═══════════════════════
FIN 5 : LA RÉVÉLATION
(FIN SECRÈTE)
═══════════════════════

Vous avez découvert la vérité ultime et brisé le cycle éternel.
Vous avez transcendé la réalité elle-même.

Vérité :
- Tous les secrets découverts : ${discoveredClues.length}
- Vous avez brisé le cycle
- Vous êtes devenu l'Observateur Éternel

FÉLICITATIONS pour avoir atteint la fin secrète !

Merci d'avoir joué à Chronicles of the Crimson Path !`;

    setStory(storyText);
    setGameState('gameOver');
  };

  const handleKaelenMeeting = () => {
    setMetNPCs([...metNPCs, 'Kaelen']);
    const newStory = `Vous approchez le vieillard. Ses yeux sont bleus luminescents.

"Je m'appelle Kaelen. La Voie Écarlate est une destinée tissée dans le sang des anciens."

Il trace un symbole : trois lunes. "Quand la rouge avalera les deux autres, les portes s'ouvriront."

Soudain, des bandits attaquent la taverne !

[INDICE : Les Trois Lunes]`;

    setStory(newStory);
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
    const newStory = `Vous rejoignez les mercenaires. Leur chef vous accueille.

"On parlait des Ruines du Croissant Noir. Il y a un trésor là-bas, mais des créatures étranges."

Soudain, des bandits font irruption !

[INDICE : Ruines du Croissant Noir]`;

    setStory(newStory);
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
    const newStory = `Vous observez discrètement la silhouette.

Elle porte une broche : un croissant de lune transpercé. Des yeux rouges comme le sang.

Elle laisse une note : "Le Croissant attend. Les Non-Marqués périront."

Des bandits attaquent !

[INDICES : Le Croissant Transpercé, Yeux Écarlates]`;

    setStory(newStory);
    setDiscoveredClues([...discoveredClues, 'Le Croissant Transpercé', 'Yeux Écarlates']);
    setMetNPCs([...metNPCs, 'Ombre']);
    
    setTimeout(() => {
      startCombat({
        name: 'Bandit Rusé',
        hp: 35,
        maxHp: 35,
        damage: 7,
        defense: 2,
        image: '🏹',
        loot: { gold: 20, exp: 22 }
      });
    }, 2000);
  };

  const handleElaraMeeting = () => {
    setMetNPCs([...metNPCs, 'Elara']);
    const newStory = `Vous approchez la marchande rousse. Elle sourit.

"Je m'appelle Elara, marchande itinérante. J'ai tout pour survivre sur la Voie."

"Si tu trouves des artefacts aux Ruines, reviens me voir. Je paie bien !"

Des bandits attaquent !`;

    setStory(newStory);
    
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
    const hasObserved = metNPCs.includes('Ombre');
    
    let storyText = `Le lendemain, vous quittez la taverne. Le soleil teinte le ciel de rouge.

Vous êtes à un carrefour. Trois chemins s'offrent à vous :

**Le Nord** - Montagnes des Lames : Territoire des maîtres martiaux. Des colonnes de fumée s'élèvent. On dit qu'un légendaire Maître Shen y enseigne.

**L'Ouest** - Ruines du Croissant Noir : Une aura étrange émane de cette direction. ${hasKaelen ? 'Kaelen a mentionné un rendez-vous ici dans trois nuits.' : 'Des légendes parlent de trésors anciens.'}

**Le Sud** - Vallée des Échos : Connue pour ses herboristes et érudits mystiques. Un lieu de sagesse et de secrets.`;

    if (hasObserved) {
      storyText += `\n\nVous repensez à la note de l'Ombre : "Les Non-Marqués périront." Êtes-vous un Marqué ?`;
    }

    setStory(storyText);
    
    const newChoices = [
      {
        id: 1,
        text: 'Aller au Nord vers les Montagnes des Lames',
        result: 'mountains'
      },
      {
        id: 2,
        text: 'Aller à l\'Ouest vers les Ruines du Croissant Noir',
        result: 'ruins'
      },
      {
        id: 3,
        text: 'Aller au Sud vers la Vallée des Échos',
        condition: { stat: 'intelligence', min: 8 },
        result: 'valley'
      }
    ];

    if (hasElara) {
      newChoices.push({
        id: 4,
        text: '[Elara] Retourner voir la marchande avant de partir',
        result: 'open_merchant'
      });
    }

    setChoices(newChoices);
  };

  const goToMountains = () => {
    addFatigue(15);
    const storyText = `Après une journée de marche, vous atteignez les Montagnes des Lames. L'air est froid et sec. Des dojos parsèment les pentes rocheuses.

Au sommet d'une colline, un vieux temple. De la fumée s'échappe. Vous entendez le son d'un entraînement martial.

Un vieil homme aux cheveux blancs pratique des mouvements fluides. Malgré son âge, chaque geste rayonne de puissance. Il s'arrête et vous regarde.

"Un voyageur. Je suis Maître Shen. Tu portes l'odeur de la Voie Écarlate."

Il vous jauge. "L'Inquisiteur Corvus et ses hommes sont passés hier, cherchant les Marqués. Ils n'ont rien trouvé ici."

${character.class === 'martialArtist' ? '"Je sens en toi le potentiel d\'un artiste martial. Veux-tu que je t\'enseigne ?"' : '"Tu n\'es pas un artiste martial, mais je peux t\'aider si tu le mérites."'}

[NPC : Maître Shen]`;

    setStory(storyText);
    setMetNPCs([...metNPCs, 'Maitre Shen']);
    setDiscoveredClues([...discoveredClues, 'Inquisiteur Corvus cherche les Marqués']);

    const newChoices = [
      {
        id: 1,
        text: 'Demander un entraînement (-20 Énergie, +2 Force)',
        condition: { stat: 'energie', min: 20 },
        result: 'train_shen'
      },
      {
        id: 2,
        text: 'Poser des questions sur la Voie Écarlate',
        result: 'question_shen'
      },
      {
        id: 3,
        text: '[Martial Artist] Demander un enseignement spécial',
        condition: { class: 'martialArtist' },
        result: 'special_shen'
      },
      {
        id: 4,
        text: 'Partir respectueusement',
        result: 'episode3'
      }
    ];

    setChoices(newChoices);
  };

  const goToRuins = () => {
    addFatigue(15);
    const hasKaelen = metNPCs.includes('Kaelen');
    const hasObserved = metNPCs.includes('Ombre');

    const storyText = `Les Ruines du Croissant Noir se dressent devant vous, imposantes et menaçantes. Des colonnes brisées témoignent d'une grandeur passée.

L'atmosphère est oppressante. Une énergie étrange pulse depuis les profondeurs. Vous voyez des symboles partout : des croissants de lune transpercés par des épées.

${hasObserved ? 'Les mêmes symboles que sur la broche de l\'Ombre Silencieuse !' : 'Ces symboles semblent anciens et puissants.'}

À l'entrée, trois chemins :

**Gauche** : Lumineux, avec des torches allumées. Vous entendez des voix - l'Inquisition ?

**Centre** : L'entrée principale, sombre et silencieuse. ${hasKaelen ? 'Le rendez-vous de Kaelen serait-il ici ?' : 'Une aura mystérieuse en émane.'}

**Droite** : Un passage étroit avec des marques de griffes sur les murs.

Soudain, une silhouette encapuchonnée apparaît au loin - des yeux rouges vous fixent avant de disparaître.

[LIEU : Ruines du Croissant Noir]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Entrée des Ruines']);

    const newChoices = [
      {
        id: 1,
        text: 'Emprunter le chemin de gauche (Inquisition)',
        result: 'ruins_left'
      },
      {
        id: 2,
        text: 'Emprunter le chemin central (mystérieux)',
        result: 'ruins_center'
      },
      {
        id: 3,
        text: 'Emprunter le chemin de droite (dangereux)',
        condition: { stat: 'agilite', min: 8 },
        result: 'ruins_right'
      },
      {
        id: 4,
        text: '[Haute Intelligence] Étudier les symboles',
        condition: { stat: 'intelligence', min: 10 },
        result: 'study_symbols'
      }
    ];

    setChoices(newChoices);
  };

  const goToValley = () => {
    addFatigue(10);
    const storyText = `La Vallée des Échos est un lieu de beauté sereine. Des cascades chantent doucement, l'air est parfumé d'herbes médicinales.

Vous arrivez dans un village de cabanes circulaires. Des érudits en robes simples vaquent à leurs occupations.

Une vieille femme aux yeux sages vous accueille. "Bienvenue, voyageur. Je suis Oracle Lyra. Nous sentons tous que les temps changent. La Voie Écarlate s'éveille."

Elle vous guide vers une bibliothèque. "Vous cherchez des réponses. Nous en avons quelques-unes, mais la connaissance a un prix - non pas en or, mais en vérité."

Les étagères débordent de livres anciens. Certains parlent de la Voie Écarlate, d'autres des Marqués, d'autres de l'Inquisition.

"L'Inquisiteur Corvus est lui-même un ancien Marqué qui a trahi sa destinée. Il cherche maintenant à détruire tous ceux qui suivent la Voie."

[NPC : Oracle Lyra]`;

    setStory(storyText);
    setMetNPCs([...metNPCs, 'Oracle Lyra']);
    setDiscoveredClues([...discoveredClues, 'Corvus était un Marqué', 'Corvus a trahi']);

    const newChoices = [
      {
        id: 1,
        text: 'Lire sur la Voie Écarlate (-15 Fatigue)',
        result: 'read_crimson'
      },
      {
        id: 2,
        text: 'Lire sur les Marqués et leur pouvoir',
        result: 'read_marked'
      },
      {
        id: 3,
        text: 'Demander à Oracle de prédire votre avenir',
        condition: { stat: 'intelligence', min: 7 },
        result: 'oracle_future'
      },
      {
        id: 4,
        text: 'Demander soins et repos (-50 Or, -30 Fatigue, +20 HP)',
        result: 'rest_valley'
      }
    ];

    setChoices(newChoices);
  };

  const handleTrainShen = () => {
    setCharacter({
      ...character,
      energie: character.energie - 20,
      force: character.force + 2
    });

    const storyText = `Maître Shen vous fait travailler pendant des heures. Chaque mouvement, chaque frappe est corrigé avec précision.

"La force ne vient pas seulement des muscles, mais de l'harmonie entre le corps et l'esprit."

À la fin de l'entraînement, vous sentez votre corps transformé, plus fort, plus réactif.

"Tu as du potentiel. Continue sur ta voie, jeune guerrier. Et méfie-toi de Corvus - il ne pardonne pas."

[GAIN : +2 Force !]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Remercier et continuer votre route',
        result: 'episode3'
      }
    ]);
  };

  const handleQuestionShen = () => {
    const storyText = `Maître Shen s'assoit en position de méditation et vous invite à faire de même.

"La Voie Écarlate est une ancienne prophétie. Quand les trois lunes s'aligneront, les Marqués se révéleront. Ces élus posséderont un pouvoir capable de changer le monde."

"L'Inquisition a été créée il y a cent ans pour empêcher cette prophétie. Corvus, leur chef actuel, était lui-même un Marqué. Mais il a renoncé à son pouvoir par peur."

"Les Ruines du Croissant Noir sont le berceau de cette prophétie. C'est là que les Marqués doivent se rassembler quand viendra l'Alignement."

"Si tu es vraiment un Marqué, tu le sauras bientôt. Ton destin t'appellera."

[INDICES : La Prophétie, L'Alignement des Trois Lunes, Corvus a renoncé]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'La Prophétie', 'Alignement', 'Corvus a renoncé au pouvoir']);
    setChoices([
      {
        id: 1,
        text: 'Continuer votre route',
        result: 'episode3'
      }
    ]);
  };

  const handleSpecialShen = () => {
    setCharacter({
      ...character,
      energie: character.energie - 30,
      force: character.force + 3,
      agilite: character.agilite + 2
    });

    const storyText = `Maître Shen sourit. "Je reconnais un vrai artiste martial. Laisse-moi te montrer une technique secrète."

Il vous enseigne pendant trois jours la "Danse du Croissant Écarlate", une technique légendaire combinant force et agilité.

"Cette technique n'est enseignée qu'aux élus. Tu es maintenant l'un des rares à la connaître. Utilise-la sagement."

Vous sentez votre corps et votre esprit transformés. Vous êtes devenu bien plus fort.

[GAIN : +3 Force, +2 Agilité !]
[SKILL APPRIS : Danse du Croissant Écarlate]`;

    const newSkill = {
      id: 's_special',
      name: 'Danse Écarlate',
      cost: 35,
      damage: 40,
      type: 'physical',
      desc: 'Technique légendaire',
      price: 0
    };

    if (skills.length < 4) {
      setSkills([...skills, newSkill]);
    }

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Remercier profondément et partir',
        result: 'episode3'
      }
    ]);
  };

  const handleRuinsLeft = () => {
    const storyText = `Vous empruntez le chemin de gauche. Les torches éclairent un couloir large et bien entretenu.

Soudain, vous entendez des voix. Vous vous cachez derrière une colonne.

Trois soldats de l'Inquisition patrouillent. Leur chef parle : "L'Inquisiteur Corvus veut que ces ruines soient surveillées jour et nuit. Les Marqués ne doivent pas atteindre la Chambre du Croissant."

Un autre soldat répond : "Mais pourquoi ? Si Corvus était lui-même un Marqué, pourquoi les chasse-t-il ?"

"Silence ! Ne questionne jamais l'Inquisiteur. Il sait ce qu'il fait."

Ils continuent leur patrouille. Vous avez appris quelque chose d'important.

[INDICE : La Chambre du Croissant existe !]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Chambre du Croissant']);
    setChoices([
      {
        id: 1,
        text: 'Continuer en évitant les patrouilles',
        result: 'episode3'
      }
    ]);
  };

  const handleRuinsCenter = () => {
    const hasKaelen = metNPCs.includes('Kaelen');
    const storyText = `Vous empruntez le chemin central. L'obscurité est totale. Vous avancez à tâtons.

Soudain, le sol s'illumine. Des runes écarlates apparaissent sous vos pieds, formant un cercle avec trois lunes.

${hasKaelen ? 'Le symbole que Kaelen a tracé ! Vous êtes au bon endroit.' : 'Un symbole ancien et puissant.'}

Une voix résonne : "Un voyageur s'approche. Es-tu un Marqué ou un imposteur ?"

${metNPCs.includes('Ombre') ? 'Vous reconnaissez cette voix - c\'est l\'Ombre Silencieuse !' : 'La voix est mystérieuse et ancienne.'}

"Réponds avec vérité : pourquoi cherches-tu la Voie Écarlate ?"`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Répondre : "Pour comprendre mon destin"',
        result: 'answer_destiny'
      },
      {
        id: 2,
        text: 'Répondre : "Pour obtenir le pouvoir"',
        result: 'answer_power'
      },
      {
        id: 3,
        text: 'Répondre : "Pour arrêter l\'Inquisition"',
        result: 'answer_stop'
      }
    ]);
  };

  const handleRuinsRight = () => {
    const storyText = `Vous empruntez le passage étroit. Les marques de griffes sont profondes et récentes.

Soudain, un grondement. Une créature surgit des ténèbres !

Un Gardien des Ruines - une créature de pierre et d'ombre, créée pour protéger ce lieu. Ses yeux brillent d'une lumière écarlate.

Il attaque !`;

    setStory(storyText);
    setTimeout(() => {
      startCombat({
        name: 'Gardien des Ruines',
        hp: 70,
        maxHp: 70,
        damage: 15,
        defense: 5,
        image: '🗿',
        loot: { gold: 80, exp: 50 }
      });
    }, 2000);
  };

  const handleStudySymbols = () => {
    setCharacter({
      ...character,
      intelligence: character.intelligence + 1
    });

    const storyText = `Vous passez plusieurs heures à étudier les symboles gravés sur les murs des ruines.

Vos connaissances s'approfondissent. Vous comprenez maintenant que ces symboles racontent l'histoire des Marqués.

"Quand la lune rouge avalera ses sœurs, les Marqués s'éveilleront. Dans la Chambre du Croissant, leur destinée sera scellée."

"Trois épreuves les attendent : la Force, l'Esprit, et le Sacrifice. Seuls les vrais Marqués pourront les surmonter."

Vous avez découvert des informations cruciales !

[GAIN : +1 Intelligence !]
[INDICES : Les Trois Épreuves]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Les Trois Épreuves : Force, Esprit, Sacrifice']);
    setChoices([
      {
        id: 1,
        text: 'Continuer votre exploration',
        result: 'episode3'
      }
    ]);
  };

  const handleReadCrimson = () => {
    setCharacter({
      ...character,
      fatigue: Math.max(0, character.fatigue - 15)
    });

    const storyText = `Vous plongez dans les manuscrits anciens parlant de la Voie Écarlate.

"La Voie Écarlate n'est pas un chemin de pouvoir, mais de destinée. Les Marqués ne sont pas choisis pour leur force, mais pour leur cœur."

"Chaque génération voit naître quelques Marqués, reconnaissables par leur résonance avec les lunes. Quand l'Alignement arrive, ils doivent se rassembler."

"Le pouvoir des Marqués peut guérir ou détruire. C'est pourquoi l'Inquisition les craint."

Vous comprenez mieux maintenant. Êtes-vous l'un d'eux ?

[-15 Fatigue]
[INDICE : Les Marqués résonnent avec les lunes]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Marqués résonnent avec lunes']);
    setChoices([
      {
        id: 1,
        text: 'Continuer votre recherche',
        result: 'episode3'
      }
    ]);
  };

  const handleReadMarked = () => {
    const storyText = `Vous lisez les textes sur les Marqués et leurs pouvoirs.

"Les Marqués possèdent des capacités qui transcendent les lois naturelles. Certains peuvent manipuler les éléments, d'autres peuvent voir l'avenir, d'autres encore peuvent guérir ou détruire d'un simple contact."

"Mais ce pouvoir a un prix. Plus un Marqué utilise son don, plus il se lie à la Voie Écarlate. S'il trahit sa destinée, comme l'a fait Corvus, il perd son humanité."

"C'est pour cela que Corvus chasse maintenant ses anciens frères. Il ne supporte pas de voir ce qu'il a abandonné."

Une révélation importante !

[INDICE : Le pouvoir a un prix, Corvus a perdu son humanité]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Pouvoir a un prix', 'Corvus inhumain']);
    setChoices([
      {
        id: 1,
        text: 'Continuer',
        result: 'episode3'
      }
    ]);
  };

  const handleOracleFuture = () => {
    const storyText = `Oracle Lyra ferme les yeux et entre en transe. Ses mains tremblent.

"Je vois... trois chemins devant toi. Le premier mène à la gloire, mais tu perdras ton âme. Le second mène au sacrifice, mais tu sauveras beaucoup. Le troisième... je ne peux pas le voir clairement. Il est voilé."

"L'Alignement approche. Dans moins d'une lune, les trois lunes se rencontreront. Tu devras faire un choix."

"Corvus te cherche. Il sait que tu es spécial. Il viendra pour toi."

Elle ouvre les yeux, épuisée. "Prépare-toi, voyageur. Ton destin t'attend."

[INDICE : L'Alignement dans moins d'une lune, Corvus vous cherche]`;

    setStory(storyText);
    setDiscoveredClues([...discoveredClues, 'Alignement proche', 'Corvus me cherche']);
    setChoices([
      {
        id: 1,
        text: 'Remercier et partir',
        result: 'episode3'
      }
    ]);
  };

  const handleRestValley = () => {
    if (gold < 50) {
      alert('Pas assez or !');
      return;
    }

    setGold(gold - 50);
    setCharacter({
      ...character,
      fatigue: Math.max(0, character.fatigue - 30),
      hp: Math.min(character.hp + 20, character.maxHp)
    });

    const storyText = `Vous payez pour les soins et le repos. Les herboristes vous donnent des remèdes puissants.

Vous passez la nuit dans une cabane confortable. Au matin, vous vous sentez régénéré.

Oracle Lyra vous offre une tisane : "Pour le voyage qui t'attend. Tu en auras besoin."

[-50 Or, -30 Fatigue, +20 HP]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Continuer votre route',
        result: 'episode3'
      }
    ]);
  };

  const handleAnswerDestiny = () => {
    const storyText = `"Pour comprendre ton destin..." La voix semble satisfaite.

L'Ombre Silencieuse apparaît devant vous, son visage partiellement visible. Ses yeux rouges brillent.

"Une bonne réponse. Tu n'es pas motivé par la cupidité ou la vengeance. C'est rare."

Elle retire sa capuche. Vous voyez une femme aux traits elfiques, marquée de runes écarlates.

"Je suis Selene, Gardienne de la Voie. Je veille sur les Marqués depuis des siècles. Et tu es l'un d'eux."

Elle pose sa main sur votre front. Une chaleur intense vous envahit.

"Je t'ai marqué. Quand viendra l'Alignement, tu sauras où aller. Prépare-toi, car Corvus ne te laissera pas faire."

[RÉVÉLATION : Vous êtes un Marqué !]
[NPC : Selene la Gardienne]`;

    setStory(storyText);
    setMetNPCs([...metNPCs, 'Selene']);
    setDiscoveredClues([...discoveredClues, 'Je suis un Marqué !']);
    setCharacter({
      ...character,
      maxHp: character.maxHp + 10,
      maxEnergie: character.maxEnergie + 20
    });
    setChoices([
      {
        id: 1,
        text: 'Accepter votre destinée',
        result: 'episode3'
      }
    ]);
  };

  const handleAnswerPower = () => {
    const storyText = `"Pour obtenir le pouvoir..." La voix devient froide.

"Ainsi, tu es comme les autres. Cupide et aveugle."

L'Ombre disparaît. Vous êtes seul dans l'obscurité.

Soudain, le sol se dérobe sous vos pieds ! Vous tombez dans un piège !

Vous vous réveillez à l'extérieur des ruines, meurtri mais vivant. Vous avez échoué le test.

[-20 HP]`;

    setStory(storyText);
    setCharacter({
      ...character,
      hp: Math.max(1, character.hp - 20)
    });
    setChoices([
      {
        id: 1,
        text: 'Reprendre votre route',
        result: 'episode3'
      }
    ]);
  };

  const handleAnswerStop = () => {
    const storyText = `"Pour arrêter l'Inquisition..." La voix semble intriguée.

"Une réponse noble, mais incomplète. La vengeance ne suffit pas."

L'Ombre apparaît partiellement. "Tu as du potentiel, mais tu dois apprendre que la Voie Écarlate n'est pas une arme."

"Reviens quand tu comprendras vraiment. Pour l'instant, prends ceci."

Elle vous lance un objet - une amulette avec le symbole du croissant transpercé.

"Cela te protégera de Corvus... pour un temps."

[OBJET REÇU : Amulette du Croissant]`;

    setStory(storyText);
    setChoices([
      {
        id: 1,
        text: 'Prendre amulette et partir',
        result: 'episode3'
      }
    ]);
  };

  const startCombat = (enemy) => {
    setCombat({
      enemy: enemy,
      playerTurn: true,
      log: ['Le combat commence !'],
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
    const newLog = [...combat.log, `Vous attaquez : ${finalDamage} dégâts${isCrit ? ' CRITIQUE !' : ''}`];

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
      alert('Pas assez énergie !');
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
      newLog.push(`${skill.name} : +${skill.healing} HP`);
    } else {
      const finalDamage = Math.max(1, damage - (combat.enemy.defense || 0));
      newEnemyHp = combat.enemy.hp - finalDamage;
      newLog.push(`${skill.name} : ${finalDamage} dégâts`);
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
        newLog.push(`${item.name} : +${item.value} HP`);
        break;
      case 'energy':
        newChar.energie = Math.min(newChar.energie + item.value, newChar.maxEnergie);
        newLog.push(`+${item.value} Énergie`);
        break;
      case 'burn':
        newCombat.enemyEffects = [...newCombat.enemyEffects, { type: 'burn', duration: item.duration, value: item.value }];
        newLog.push(`${combat.enemy.name} brûle !`);
        break;
      case 'poison':
        newCombat.enemyEffects = [...newCombat.enemyEffects, { type: 'poison', duration: item.duration, value: item.value }];
        newLog.push(`${combat.enemy.name} est empoisonné !`);
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
    let newLog = [...currentLog];
    let newCombat = { ...combat };

    let dotDamage = 0;
    newCombat.enemyEffects = newCombat.enemyEffects.map(effect => {
      if (effect.type === 'burn' || effect.type === 'poison') {
        dotDamage += effect.value;
        newLog.push(`${effect.type} : ${effect.value} dégâts`);
        return { ...effect, duration: effect.duration - 1 };
      }
      return { ...effect, duration: effect.duration - 1 };
    }).filter(e => e.duration > 0);

    currentEnemyHp -= dotDamage;

    if (currentEnemyHp <= 0) {
      endCombat(true, newLog);
      return;
    }

    const damage = combat.enemy.damage || 8;
    const armor = equipment.armor ? equipment.armor.defense : 0;
    const finalDamage = Math.max(1, damage - armor);
    
    const newHp = character.hp - finalDamage;
    newLog.push(`${combat.enemy.name} attaque : ${finalDamage} dégâts`);

    setCharacter({ ...character, hp: newHp });

    if (newHp <= 0) {
      endCombat(false, newLog);
    } else {
      setCombat({
        ...newCombat,
        enemy: { ...combat.enemy, hp: currentEnemyHp },
        log: newLog,
        playerTurn: true
      });
    }
  };

  const endCombat = (victory, finalLog) => {
    if (victory) {
      const expGain = combat.enemy.loot?.exp || 20;
      const goldGain = combat.enemy.loot?.gold || 20;
      
      setCharacter({
        ...character,
        exp: character.exp + expGain
      });
      setGold(gold + goldGain);

      const victoryStory = `Victoire ! Vous avez vaincu ${combat.enemy.name}.

Vous gagnez ${expGain} EXP et ${goldGain} or.

${episode === 1 ? 'La taverne retrouve son calme. Les clients vous respectent.' : 'Vous reprenez votre souffle.'}`;

      setStory(victoryStory);
      
      if (episode === 1) {
        setChoices([
          {
            id: 1,
            text: 'Continuer vers Episode 2',
            result: 'episode2'
          }
        ]);
      } else {
        setChoices([
          {
            id: 1,
            text: 'Continuer votre route',
            result: 'continue'
          }
        ]);
      }
      
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
            <h3 className="text-xl mb-4">Quel est votre nom ?</h3>
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
            <h3 className="text-xl mb-4">Choisissez votre classe</h3>
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
              Commencer Aventure
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
          <h2 className="text-2xl font-bold text-red-400">Boutique Elara</h2>
          <button onClick={() => setMerchantOpen(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="text-yellow-400 mb-4">Or: {gold}</div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Armes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allItems.weapons.slice(2).map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.grade} | Dégâts: {item.damage}</div>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={gold < item.price}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= item.price ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.price}
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
                    <div className="text-xs text-gray-400">{item.grade}</div>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={gold < item.price || inventory.length >= 3}
                    className={`px-3 py-1 rounded text-sm ${
                      gold >= item.price && inventory.length < 3 ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.price}
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
                    {skill.price}
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
              <div className="text-sm text-gray-400">Or: {gold}</div>
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
              <h3 className="text-lg font-bold text-purple-400 mb-3">Transformations</h3>
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
            <div className="max-w-none">
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">{story}</p>
            </div>
          </div>

          {discoveredClues.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600 mb-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Indices ({discoveredClues.length})</h3>
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
                  let meetsCondition = true;
                  
                  if (choice.condition && choice.condition.stat) {
                    meetsCondition = character[choice.condition.stat] >= choice.condition.min;
                  }
                  
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
                          Requis: {choice.condition.stat.toUpperCase()} &gt;= {choice.condition.min}
                        </div>
                      )}
                      {choice.condition && meetsCondition && (
                        <div className="text-sm text-green-400 mt-1">
                          Choix spécial débloqué
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
                  <div key={idx} className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.grade}</div>
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
                    <div className="font-semibold text-sm">{equipment.weapon.name}</div>
                    <div className="text-xs text-gray-400">
                      Dégâts: {equipment.weapon.damage} | {equipment.weapon.grade}
                    </div>
                  </div>
                )}
                {equipment.armor && (
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold text-sm">{equipment.armor.name}</div>
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
            <h2 className="text-3xl font-bold text-red-400 text-center mb-6">COMBAT</h2>
            
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
                  {entry}
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
                    Attaque
                  </button>
                  <button
                    onClick={() => defend('parry')}
                    className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
                  >
                    Parade
                  </button>
                  <button
                    onClick={() => defend('evade')}
                    className="p-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition"
                  >
                    Esquive
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
                          <div className="text-xs">Coût: {skill.cost}</div>
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
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-xl text-gray-400">
                Tour de ennemi...
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="max-w-2xl mx-auto text-center py-20">
          {episode >= 5 ? (
            <div>
              <div className="mb-8 text-6xl">
                {story.includes('ASCENSION') && '👑'}
                {story.includes('SACRIFICE') && '✨'}
                {story.includes('CORRUPTION') && '💀'}
                {story.includes('ÉQUILIBRE') && '⚖️'}
                {story.includes('RÉVÉLATION') && '🌌'}
              </div>
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-gray-200 whitespace-pre-line leading-relaxed">{story}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Statistiques de Run</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Indices découverts: {discoveredClues.length}</div>
                  <div>NPC rencontrés: {metNPCs.length}</div>
                  <div>Force: {character?.force || 0}</div>
                  <div>Intelligence: {character?.intelligence || 0}</div>
                  <div>Agilité: {character?.agilite || 0}</div>
                  <div>Chance: {character?.chance || 0}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl font-bold mb-4 text-red-600">Vous êtes tombé...</h1>
              <p className="text-xl mb-8 text-gray-300">
                Votre aventure se termine ici, mais la Voie Écarlate vous attend toujours.
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setGameState('menu');
              setCharacter(null);
              setEpisode(1);
              setInventory([]);
              setEquipment({ weapon: null, armor: null });
              setSkills([]);
              setGold(50);
              setMetNPCs([]);
              setDiscoveredClues([]);
              setStory('');
              setChoices([]);
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