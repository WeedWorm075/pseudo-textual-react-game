// src/data/races.ts

// Données de races
export const races = {
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