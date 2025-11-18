// src/data/classes.ts

// Données de classes
export const classes = {
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