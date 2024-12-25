import type { WeaponType } from './types';

export const weaponTypes: WeaponType[] = [
  // 10% Chance Base
  {
    category: 'Missile Weapons',
    name: 'Axe (thrown)',
    basic: 25,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 3,
    damage: '1D6',
    encumbrance: 1
  },
  {
    category: 'Missile Weapons',
    name: 'Bow',
    basic: 25,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 2,
    damage: '1D8',
    encumbrance: 1
  },
  {
    category: 'Hand to Hand Weapons',
    name: 'Head Butt',
    basic: 25,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 8,
    damage: '1D3',
    encumbrance: 0
  },
  {
    category: 'Defensive Items',
    name: 'Medium Shield',
    basic: 25,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 0,
    damage: '',
    encumbrance: 2
  },
  {
    category: 'Thrusting Weapons',
    name: 'Pike',
    basic: 10,
    baseChance: 10,
    costs: { low: 400, medium: 800, high: 1600 },
    strikeRank: 1,
    damage: '2D6',
    encumbrance: 4
  },
  {
    category: 'Missile Weapons',
    name: 'Sling',
    basic: 25,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 3,
    damage: '1D8',
    encumbrance: 0.5
  },
  {
    category: 'Thrusting Weapons',
    name: 'Spear, 1H',
    basic: 10,
    baseChance: 10,
    costs: { low: 200, medium: 400, high: 1000 },
    strikeRank: 2,
    damage: '1D6+1',
    encumbrance: 2
  },
  {
    category: 'Cut and Thrust Weapons',
    name: 'Sword, 1H',
    basic: 10,
    baseChance: 10,
    costs: { low: 300, medium: 500, high: 1000 },
    strikeRank: 3,
    damage: '1D8+1',
    encumbrance: 2
  },

  // 15% Chance Base
  {
    category: 'Cut and Thrust Weapons',
    name: 'Axe, 1H',
    basic: 20,
    baseChance: 15,
    costs: { low: 300, medium: 500, high: 1000 },
    strikeRank: 4,
    damage: '1D6+2',
    encumbrance: 1
  },
  {
    category: 'Missile Weapons',
    name: 'Flail',
    basic: 15,
    baseChance: 15,
    costs: { low: 400, medium: 800, high: 1200 },
    strikeRank: 6,
    damage: '1D6+2',
    encumbrance: 2
  },
  {
    category: 'Missile Weapons',
    name: 'Javelin/Dart (thrown)',
    basic: 25,
    baseChance: 15,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 2,
    damage: '1D10',
    encumbrance: 1
  },
  {
    category: 'Hand to Hand Weapons',
    name: 'Knife (thrown)',
    basic: 25,
    baseChance: 15,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 1,
    damage: '1D4',
    encumbrance: 0.5
  },
  {
    category: 'Smashing Weapons',
    name: 'Maul',
    basic: 20,
    baseChance: 15,
    costs: { low: 200, medium: 600, high: 1500 },
    strikeRank: 7,
    damage: '2D6',
    encumbrance: 4
  },
  {
    category: 'Cut and Thrust Weapons',
    name: 'Shortsword',
    basic: 15,
    baseChance: 15,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 4,
    damage: '1D6+1',
    encumbrance: 1
  },
  {
    category: 'Cut and Thrust Weapons',
    name: 'Sickle',
    basic: 15,
    baseChance: 15,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 5,
    damage: '1D6+1',
    encumbrance: 1
  },

  // 20% Chance Base
  {
    category: 'Cut and Thrust Weapons',
    name: 'Club/Mace, 1H or 2H',
    basic: 25,
    baseChance: 20,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 5,
    damage: '1D6+2',
    encumbrance: 1
  },
  {
    category: 'Missile Weapons',
    name: 'Crossbow',
    basic: 25,
    baseChance: 20,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 1,
    damage: '2D6+2',
    encumbrance: 3
  },
  {
    category: 'Smashing Weapons',
    name: 'Hammer, 1H',
    basic: 15,
    baseChance: 20,
    costs: { low: 300, medium: 600, high: 1000 },
    strikeRank: 5,
    damage: '1D6+2',
    encumbrance: 1
  },
  {
    category: 'Defensive Items',
    name: 'Large Shield',
    basic: 25,
    baseChance: 20,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 0,
    damage: '',
    encumbrance: 3
  },
  {
    category: 'Thrusting Weapons',
    name: 'Spear, 2H',
    basic: 20,
    baseChance: 20,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 2,
    damage: '1D8+1',
    encumbrance: 2
  },
  {
    category: 'Hand to Hand Weapons',
    name: 'Staff',
    basic: 25,
    baseChance: 20,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 2,
    damage: '1D8',
    encumbrance: 2
  },

  // 25% Chance Base
  {
    category: 'Hand to Hand Weapons',
    name: 'Dagger',
    basic: 25,
    baseChance: 25,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 7,
    damage: '1D4+2',
    encumbrance: 0.5
  },
  {
    category: 'Hand to Hand Weapons',
    name: 'Grapple',
    basic: 25,
    baseChance: 25,
    costs: { low: 500, medium: 800, high: 1200 },
    strikeRank: 8,
    damage: 'Special',
    encumbrance: 0
  },
  {
    category: 'Hand to Hand Weapons',
    name: 'Kick',
    basic: 25,
    baseChance: 25,
    costs: { low: 200, medium: 400, high: 1000 },
    strikeRank: 8,
    damage: '1D3',
    encumbrance: 0
  },
  {
    category: 'Missile Weapons',
    name: 'Thrown Rock',
    basic: 25,
    baseChance: 25,
    costs: { low: 200, medium: 400, high: 800 },
    strikeRank: 3,
    damage: '1D6',
    encumbrance: 0.5
  }
];

// Group weapons by their base chance for easier reference

export const weaponsByBaseChance = {
  10: weaponTypes.filter(w => w.baseChance === 10),
  15: weaponTypes.filter(w => w.baseChance === 15),
  20: weaponTypes.filter(w => w.baseChance === 20),
  25: weaponTypes.filter(w => w.baseChance === 25)
};
