import type { WeaponType } from './types';

export function calculateWeaponStrikeRank(baseLength: number, dex: number): number {
  const dexSR = dex >= 16 ? 1 : dex >= 13 ? 2 : dex >= 9 ? 3 : 4;
  return baseLength + dexSR;
}

export function calculateEffectiveSkill(baseChance: number, trainedSkill: number): number {
  return baseChance + trainedSkill;
}

export function calculateTrainingCost(
  weapon: WeaponType,
  currentSkill: number,
  chaDiscount: number = 0
): number {
  let cost: number;
  if (currentSkill < 25) {
    cost = weapon.costs.low;
  } else if (currentSkill < 50) {
    cost = weapon.costs.medium;
  } else {
    cost = weapon.costs.high;
  }

  cost = cost * (1 - chaDiscount);
  return Math.floor(cost);
}
