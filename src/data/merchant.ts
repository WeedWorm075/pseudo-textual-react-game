// src/data/merchant.ts

// NOTE : J'utilise des IDs génériques. Assurez-vous qu'ils ne chevauchent pas
// ceux des startingItems si vous implémentez une gestion d'ID stricte.

export const merchantItems = [
  // Armes
  { id: 'm_w1', name: 'Dague de Chasse', grade: 'commun', type: 'weapon', damage: 8, reqForce: 4, cost: 40 },
  { id: 'm_w2', name: 'Grimoire de Base', grade: 'commun', type: 'weapon', damage: 2, magicDamage: 10, reqInt: 5, cost: 55 },

  // Armures
  { id: 'm_a1', name: 'Cuir Bouilli', grade: 'commun', type: 'armor', defense: 4, reqForce: 3, cost: 30 },
  
  // Consommables
  { id: 'm_c1', name: 'Grande Potion', grade: 'rare', type: 'consumable', effect: 'heal', value: 50, cost: 25 },
  { id: 'm_c2', name: 'Antidote', grade: 'commun', type: 'consumable', effect: 'remove_poison', value: 0, cost: 10 }
];