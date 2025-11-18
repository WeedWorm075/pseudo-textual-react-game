// src/data/items.ts

// NOTE: Vous pourriez vouloir définir des types ici (WeaponItem, ConsumableItem) 
// pour la rigueur TypeScript, mais nous utilisons 'any' pour la rapidité.

export const startingItems = {
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